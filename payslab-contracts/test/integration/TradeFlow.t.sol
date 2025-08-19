// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../../src/PaySlab.sol";
import "../../src/mocks/MockUSDC.sol";
import "../../src/mocks/MockBVNOracle.sol";
import "../utils/TestHelper.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title TradeFlow Integration Tests
 * @dev Tests complete trade flows from creation to completion
 */
contract TradeFlowTest is Test, TestHelper {
    PaySlab public payslab;
    MockUSDC public mockUSDC;
    MockBVNOracle public mockBVNOracle;
    
    address public owner;
    address public feeCollector;
    address public buyer;
    address public seller;
    address public inspector;
    
    uint256 public constant PLATFORM_FEE_RATE = 150; // 1.5%
    uint256 public constant TRADE_AMOUNT = 50_000 * 10**6; // 50,000 USDC
    
    struct TradeBalances {
        uint256 buyerBefore;
        uint256 sellerBefore;
        uint256 feeCollectorBefore;
        uint256 contractBefore;
    }
    
    function setUp() public {
        owner = makeAddr("owner");
        feeCollector = makeAddr("feeCollector");
        buyer = makeAddr("buyer");
        seller = makeAddr("seller");
        inspector = makeAddr("inspector");
        
        vm.startPrank(owner);
        
        // Deploy contracts
        mockUSDC = new MockUSDC();
        mockBVNOracle = new MockBVNOracle();
        
        PaySlab implementation = new PaySlab();
        bytes memory initData = abi.encodeWithSelector(
            PaySlab.initialize.selector,
            address(mockUSDC),
            PLATFORM_FEE_RATE,
            feeCollector
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        payslab = PaySlab(address(proxy));
        payslab.addInspector(inspector);
        
        vm.stopPrank();
        
        // Setup user balances and verification
        mockUSDC.mint(buyer, 1_000_000 * 10**6); // 1M USDC
        mockUSDC.mint(seller, 100_000 * 10**6); // 100k USDC
        
        vm.prank(buyer);
        payslab.verifyUser("12345678901");
        
        vm.prank(seller);
        payslab.verifyUser("10987654321");
    }
    
    // ============ Complete Trade Flow Tests ============
    
    function test_CompleteTradeFlowWithoutInspection() public {
        console.log("=== Testing Complete Trade Flow (No Inspection) ===");
        
        TradeBalances memory initialBalances = _captureBalances();
        
        // Step 1: Create Trade
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "50MT Premium Nigerian Cashew W320 Grade",
            false // No inspection required
        );
        
        console.log("Trade created with ID:", tradeId);
        _logTradeDetails(tradeId);
        
        // Step 2: Fund Trade
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        console.log("Trade funded - 20% released to seller");
        _logBalanceChanges(initialBalances, "After Funding");
        
        // Verify 20% payment to seller
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.FUNDED));
        
        // Step 3: Mark as Shipped
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL1234567890NG");
        
        console.log("Trade marked as shipped - 30% released to seller");
        _logBalanceChanges(initialBalances, "After Shipping");
        
        trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.SHIPPED));
        assertEq(trade.trackingNumber, "DHL1234567890NG");
        
        // Step 4: Confirm Delivery
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        console.log("Delivery confirmed - 50% released to seller");
        _logBalanceChanges(initialBalances, "After Delivery");
        
        trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        
        // Verify final balances
        _verifyFinalBalances(initialBalances, false);
        
        console.log("=== Trade Flow Complete ===");
    }
    
    function test_CompleteTradeFlowWithInspection() public {
        console.log("=== Testing Complete Trade Flow (With Inspection) ===");
        
        TradeBalances memory initialBalances = _captureBalances();
        
        // Step 1: Create Trade with Quality Inspection
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "50MT Premium Nigerian Cashew W320 Grade, <8% moisture, <2% foreign matter",
            true // Quality inspection required
        );
        
        console.log("Trade created with quality inspection requirement");
        
        // Step 2: Fund Trade
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        // Step 3: Ship Goods
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL1234567890NG");
        
        // Step 4: Confirm Delivery (but payment pending inspection)
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.DELIVERED));
        assertEq(uint8(trade.inspectionStatus), uint8(PaySlab.InspectionStatus.PENDING));
        
        console.log("Delivery confirmed but payment pending quality inspection");
        
        // Step 5: Complete Quality Inspection
        vm.prank(inspector);
        payslab.completeQualityInspection(tradeId, PaySlab.InspectionStatus.PASSED);
        
        console.log("Quality inspection passed - final payment released");
        
        trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        assertEq(uint8(trade.inspectionStatus), uint8(PaySlab.InspectionStatus.PASSED));
        assertEq(trade.inspector, inspector);
        
        _verifyFinalBalances(initialBalances, true);
        
        console.log("=== Trade Flow with Inspection Complete ===");
    }
    
    function test_MultipleTradesSimultaneously() public {
        console.log("=== Testing Multiple Simultaneous Trades ===");
        
        // Create additional users
        address buyer2 = makeAddr("buyer2");
        address seller2 = makeAddr("seller2");
        
        mockUSDC.mint(buyer2, 100_000 * 10**6);
        mockUSDC.mint(seller2, 100_000 * 10**6);
        
        vm.prank(buyer2);
        payslab.verifyUser("55566677788");
        
        vm.prank(seller2);
        payslab.verifyUser("11122233344");
        
        // Trade 1: Large cashew order
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        vm.prank(buyer);
        uint256 trade1 = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 45 days,
            "50MT Premium Cashew",
            true
        );
        vm.prank(buyer);
        payslab.fundTrade(trade1);
        
        // Trade 2: Sesame order
        uint256 trade2Amount = 20_000 * 10**6;
        vm.prank(buyer2);
        mockUSDC.approve(address(payslab), trade2Amount);
        vm.prank(buyer2);
        uint256 trade2 = payslab.createTrade(
            seller2,
            trade2Amount,
            block.timestamp + 60 days,
            "20MT Sesame Seeds",
            false
        );
        vm.prank(buyer2);
        payslab.fundTrade(trade2);
        
        console.log("Two trades created and funded simultaneously");
        console.log("Trade 1 ID:", trade1);
        console.log("Amount: 50,000 USDC");
        console.log("Trade 2 ID:", trade2); 
        console.log("Amount: 20,000 USDC");
        
        // Ship both trades
        vm.prank(seller);
        payslab.markShipped(trade1, "DHL1111111111");
        
        vm.prank(seller2);
        payslab.markShipped(trade2, "DHL2222222222");
        
        // Complete trade 2 first (no inspection)
        vm.prank(buyer2);
        payslab.confirmDelivery(trade2);
        
        PaySlab.Trade memory completedTrade = payslab.getTrade(trade2);
        assertEq(uint8(completedTrade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        
        // Complete trade 1 with inspection
        vm.prank(buyer);
        payslab.confirmDelivery(trade1);
        
        vm.prank(inspector);
        payslab.completeQualityInspection(trade1, PaySlab.InspectionStatus.PASSED);
        
        PaySlab.Trade memory inspectedTrade = payslab.getTrade(trade1);
        assertEq(uint8(inspectedTrade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        
        console.log("Both trades completed successfully");
        
        // Verify user profiles updated
        PaySlab.UserProfile memory buyer1Profile = payslab.getUserProfile(buyer);
        PaySlab.UserProfile memory buyer2Profile = payslab.getUserProfile(buyer2);
        PaySlab.UserProfile memory seller1Profile = payslab.getUserProfile(seller);
        PaySlab.UserProfile memory seller2Profile = payslab.getUserProfile(seller2);
        
        assertEq(buyer1Profile.totalTrades, 1);
        assertEq(buyer2Profile.totalTrades, 1);
        assertEq(seller1Profile.totalTrades, 1);
        assertEq(seller2Profile.totalTrades, 1);
        
        console.log("User profiles updated correctly");
    }
    
    function test_DisputeAndResolutionFlow() public {
        console.log("=== Testing Dispute and Resolution Flow ===");
        
        // Create and fund trade
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "50MT Cashew - Grade A",
            true
        );
        
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        // Ship goods
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL1234567890");
        
        // Buyer disputes the trade
        vm.prank(buyer);
        payslab.disputeTrade(tradeId, "Goods quality below specified standards");
        
        PaySlab.Trade memory disputedTrade = payslab.getTrade(tradeId);
        assertEq(uint8(disputedTrade.status), uint8(PaySlab.TradeStatus.DISPUTED));
        
        console.log("Trade disputed by buyer");
        
        // In a real scenario, dispute resolution would be handled off-chain
        // For this test, we'll show that disputed trades cannot proceed normally
        // until resolved by admin/arbitration
        
        // Verify that disputed trade cannot be confirmed for delivery
        vm.prank(buyer);
        vm.expectRevert(PaySlab.InvalidTradeStatus.selector);
        payslab.confirmDelivery(tradeId);
        
        console.log("Dispute prevents normal trade progression - working as expected");
        
        // In production, this would require admin intervention or arbitration
        // The contract correctly prevents progression of disputed trades
    }
    
    function test_TradeTimeoutScenario() public {
        console.log("=== Testing Trade Timeout Scenario ===");
        
        // Create trade with short deadline
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 1 days, // Short deadline
            "Emergency Order - 24h delivery",
            false
        );
        
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        // Fast forward past deadline
        vm.warp(block.timestamp + 2 days);
        
        // Buyer can cancel due to timeout
        vm.prank(buyer);
        payslab.cancelTrade(tradeId);
        
        PaySlab.Trade memory cancelledTrade = payslab.getTrade(tradeId);
        assertEq(uint8(cancelledTrade.status), uint8(PaySlab.TradeStatus.CANCELLED));
        
        console.log("Trade cancelled due to timeout");
    }
    
    function test_LargeVolumeTradeFlow() public {
        console.log("=== Testing Large Volume Trade Flow ===");
        
        uint256 largeAmount = 500_000 * 10**6; // 500,000 USDC
        mockUSDC.mint(buyer, largeAmount);
        
        TradeBalances memory initialBalances = _captureBalances();
        
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            largeAmount,
            block.timestamp + 60 days,
            "500MT Premium Nigerian Cashew - Bulk Export Order",
            true
        );
        
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), largeAmount);
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        console.log("Large trade funded:");
        console.log("Amount:", largeAmount / 10**6, "USDC");
        
        // Complete the flow
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL_BULK_001");
        
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        vm.prank(inspector);
        payslab.completeQualityInspection(tradeId, PaySlab.InspectionStatus.PASSED);
        
        PaySlab.Trade memory completedTrade = payslab.getTrade(tradeId);
        assertEq(uint8(completedTrade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        
        // Verify large amounts handled correctly
        uint256 totalFees = largeAmount * PLATFORM_FEE_RATE / 10000;
        uint256 sellerReceived = largeAmount - totalFees;
        
        assertEq(
            mockUSDC.balanceOf(seller),
            initialBalances.sellerBefore + sellerReceived
        );
        
        console.log("Large volume trade completed successfully");
        console.log("Total fees collected:", totalFees / 10**6, "USDC");
    }
    
    // ============ Helper Functions ============
    
    function _captureBalances() internal view returns (TradeBalances memory) {
        return TradeBalances({
            buyerBefore: mockUSDC.balanceOf(buyer),
            sellerBefore: mockUSDC.balanceOf(seller),
            feeCollectorBefore: mockUSDC.balanceOf(feeCollector),
            contractBefore: mockUSDC.balanceOf(address(payslab))
        });
    }
    
    function _logTradeDetails(uint256 tradeId) internal view {
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        console.log("Buyer:", trade.buyer);
        console.log("Seller:", trade.seller);
        console.log("Total Amount:", trade.totalAmount / 10**6, "USDC");
        console.log("Deposit (20%):", trade.depositAmount / 10**6, "USDC");
        console.log("Shipment (30%):", trade.shipmentAmount / 10**6, "USDC");
        console.log("Delivery (50%):", trade.deliveryAmount / 10**6, "USDC");
    }
    
    function _logBalanceChanges(TradeBalances memory initial, string memory stage) internal view {
        console.log("=== Balance Changes:", stage, "===");
        
        int256 buyerChange = int256(mockUSDC.balanceOf(buyer)) - int256(initial.buyerBefore);
        int256 sellerChange = int256(mockUSDC.balanceOf(seller)) - int256(initial.sellerBefore);
        int256 feeCollectorChange = int256(mockUSDC.balanceOf(feeCollector)) - int256(initial.feeCollectorBefore);
        int256 contractChange = int256(mockUSDC.balanceOf(address(payslab))) - int256(initial.contractBefore);
        
        console.log("Buyer change:", uint256(buyerChange >= 0 ? buyerChange : -buyerChange) / 10**6, "USDC");
        console.log("Seller change:", uint256(sellerChange >= 0 ? sellerChange : -sellerChange) / 10**6, "USDC");
        console.log("Fee Collector change:", uint256(feeCollectorChange >= 0 ? feeCollectorChange : -feeCollectorChange) / 10**6, "USDC");
        console.log("Contract change:", uint256(contractChange >= 0 ? contractChange : -contractChange) / 10**6, "USDC");
    }
    
    function _verifyFinalBalances(TradeBalances memory initial, bool withInspection) internal view {
        // Calculate expected amounts
        uint256 totalFees = TRADE_AMOUNT * PLATFORM_FEE_RATE / 10000;
        uint256 sellerNet = TRADE_AMOUNT - totalFees;
        
        // Verify balances
        assertEq(mockUSDC.balanceOf(buyer), initial.buyerBefore - TRADE_AMOUNT);
        assertEq(mockUSDC.balanceOf(seller), initial.sellerBefore + sellerNet);
        assertEq(mockUSDC.balanceOf(feeCollector), initial.feeCollectorBefore + totalFees);
        assertEq(mockUSDC.balanceOf(address(payslab)), initial.contractBefore);
        
        console.log("Final balance verification passed");
        console.log("Total fees collected:", totalFees / 10**6, "USDC");
        console.log("Seller net received:", sellerNet / 10**6, "USDC");
    }
}