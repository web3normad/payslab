// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/PaySlab.sol";
import "../src/mocks/MockUSDC.sol";
import "../src/mocks/MockBVNOracle.sol";
import "../test/utils/TestHelper.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract PaySlabTest is Test, TestHelper {
    PaySlab public payslab;
    PaySlab public implementation;
    MockUSDC public mockUSDC;
    MockBVNOracle public mockBVNOracle;
    
    address public owner;
    address public feeCollector;
    address public buyer;
    address public seller;
    address public inspector;
    address public attacker;
    
    uint256 public constant PLATFORM_FEE_RATE = 150; // 1.5%
    uint256 public constant TRADE_AMOUNT = 10_000 * 10**6; // 10,000 USDC
    
    event TradeCreated(uint256 indexed tradeId, address indexed buyer, address indexed seller, uint256 amount);
    event TradeFunded(uint256 indexed tradeId, uint256 amount);
    event UserVerified(address indexed user, string bvn);
    
    function setUp() public {
        // Setup test accounts
        owner = makeAddr("owner");
        feeCollector = makeAddr("feeCollector");
        buyer = makeAddr("buyer");
        seller = makeAddr("seller");
        inspector = makeAddr("inspector");
        attacker = makeAddr("attacker");
        
        vm.startPrank(owner);
        
        // Deploy mock contracts
        mockUSDC = new MockUSDC();
        mockBVNOracle = new MockBVNOracle();
        
        // Deploy PaySlab implementation
        implementation = new PaySlab();
        
        // Deploy proxy
        bytes memory initData = abi.encodeWithSelector(
            PaySlab.initialize.selector,
            address(mockUSDC),
            PLATFORM_FEE_RATE,
            feeCollector
        );
        
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        payslab = PaySlab(address(proxy));
        
        // Setup inspector
        payslab.addInspector(inspector);
        
        vm.stopPrank();
        
        // Setup test balances
        mockUSDC.mint(buyer, 100_000 * 10**6); // 100k USDC
        mockUSDC.mint(seller, 100_000 * 10**6); // 100k USDC
        
        // Verify test users
        vm.prank(buyer);
        payslab.verifyUser("12345678901");
        
        vm.prank(seller);
        payslab.verifyUser("10987654321");
    }
    
    // ============ Initialization Tests ============
    
    function test_Initialization() public {
        assertEq(address(payslab.usdc()), address(mockUSDC));
        assertEq(payslab.platformFeeRate(), PLATFORM_FEE_RATE);
        assertEq(payslab.owner(), owner);
        assertTrue(payslab.authorizedInspectors(inspector));
    }
    
    function test_CannotInitializeTwice() public {
        vm.expectRevert("Initializable: contract is already initialized");
        payslab.initialize(address(mockUSDC), PLATFORM_FEE_RATE, feeCollector);
    }
    
    // ============ User Verification Tests ============
    
    function test_UserVerification() public {
        address newUser = makeAddr("newUser");
        string memory bvn = "11122233344";
        
        vm.prank(newUser);
        vm.expectEmit(true, false, false, true);
        emit UserVerified(newUser, bvn);
        payslab.verifyUser(bvn);
        
        assertTrue(payslab.isUserVerified(newUser));
        
        PaySlab.UserProfile memory profile = payslab.getUserProfile(newUser);
        assertEq(profile.bvn, bvn);
        assertTrue(profile.isVerified);
        assertEq(profile.reputationScore, 500); // Default starting reputation
    }
    
    function test_CannotVerifyWithInvalidBVNLength() public {
        address newUser = makeAddr("newUser");
        
        vm.prank(newUser);
        vm.expectRevert("Invalid BVN length");
        payslab.verifyUser("123456789"); // Too short
        
        vm.prank(newUser);
        vm.expectRevert("Invalid BVN length");
        payslab.verifyUser("123456789012"); // Too long
    }
    
    function test_CannotReuseUsedBVN() public {
        string memory bvn = "11122233344";
        address user1 = makeAddr("user1");
        address user2 = makeAddr("user2");
        
        // First user verifies successfully
        vm.prank(user1);
        payslab.verifyUser(bvn);
        
        // Second user cannot use same BVN
        vm.prank(user2);
        vm.expectRevert("BVN already registered");
        payslab.verifyUser(bvn);
    }
    
    // ============ Trade Creation Tests ============
    
    function test_CreateTrade() public {
        uint256 expectedTradeId = payslab.nextTradeId();
        uint256 deliveryDeadline = block.timestamp + 30 days;
        
        vm.prank(buyer);
        vm.expectEmit(true, true, true, true);
        emit TradeCreated(expectedTradeId, buyer, seller, TRADE_AMOUNT);
        
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            deliveryDeadline,
            "Grade A Nigerian Cashew",
            true
        );
        
        assertEq(tradeId, expectedTradeId);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(trade.buyer, buyer);
        assertEq(trade.seller, seller);
        assertEq(trade.totalAmount, TRADE_AMOUNT);
        assertEq(trade.depositAmount, TRADE_AMOUNT * 20 / 100);
        assertEq(trade.shipmentAmount, TRADE_AMOUNT * 30 / 100);
        assertEq(trade.deliveryAmount, TRADE_AMOUNT * 50 / 100);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.CREATED));
    }
    
    function test_CannotCreateTradeWithUnverifiedUser() public {
        address unverifiedUser = makeAddr("unverified");
        
        vm.prank(unverifiedUser);
        vm.expectRevert(PaySlab.UserNotVerified.selector);
        payslab.createTrade(seller, TRADE_AMOUNT, block.timestamp + 30 days, "Test", false);
        
        vm.prank(buyer);
        vm.expectRevert(PaySlab.UserNotVerified.selector);
        payslab.createTrade(unverifiedUser, TRADE_AMOUNT, block.timestamp + 30 days, "Test", false);
    }
    
    // ============ Trade Funding Tests ============
    
    function test_FundTrade() public {
        // Create trade
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Grade A Nigerian Cashew",
            false
        );
        
        // Approve USDC
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        
        // Get initial balances
        uint256 buyerInitialBalance = mockUSDC.balanceOf(buyer);
        uint256 sellerInitialBalance = mockUSDC.balanceOf(seller);
        uint256 feeCollectorInitialBalance = mockUSDC.balanceOf(feeCollector);
        
        // Fund trade
        vm.prank(buyer);
        vm.expectEmit(true, false, false, true);
        emit TradeFunded(tradeId, TRADE_AMOUNT);
        payslab.fundTrade(tradeId);
        
        // Check trade status
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.FUNDED));
        
        // Check balances
        uint256 depositAmount = TRADE_AMOUNT * 20 / 100;
        uint256 platformFee = depositAmount * PLATFORM_FEE_RATE / 10000;
        uint256 sellerAmount = depositAmount - platformFee;
        
        assertEq(mockUSDC.balanceOf(buyer), buyerInitialBalance - TRADE_AMOUNT);
        assertEq(mockUSDC.balanceOf(seller), sellerInitialBalance + sellerAmount);
        assertEq(mockUSDC.balanceOf(feeCollector), feeCollectorInitialBalance + platformFee);
    }
    
    function test_CannotFundTradeWithoutApproval() public {
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Test",
            false
        );
        
        vm.prank(buyer);
        vm.expectRevert("Insufficient allowance");
        payslab.fundTrade(tradeId);
    }
    
    function test_CannotFundTradeByNonBuyer() public {
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Test",
            false
        );
        
        vm.prank(seller);
        vm.expectRevert(PaySlab.UnauthorizedAccess.selector);
        payslab.fundTrade(tradeId);
    }
    
    // ============ Trade Shipping Tests ============
    
    function test_MarkShipped() public {
        uint256 tradeId = _createAndFundTrade();
        string memory trackingNumber = "DHL123456789";
        
        uint256 sellerInitialBalance = mockUSDC.balanceOf(seller);
        uint256 feeCollectorInitialBalance = mockUSDC.balanceOf(feeCollector);
        
        vm.prank(seller);
        payslab.markShipped(tradeId, trackingNumber);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.SHIPPED));
        assertEq(trade.trackingNumber, trackingNumber);
        
        // Check payment release (30%)
        uint256 shipmentAmount = TRADE_AMOUNT * 30 / 100;
        uint256 platformFee = shipmentAmount * PLATFORM_FEE_RATE / 10000;
        uint256 sellerAmount = shipmentAmount - platformFee;
        
        assertEq(mockUSDC.balanceOf(seller), sellerInitialBalance + sellerAmount);
        assertEq(mockUSDC.balanceOf(feeCollector), feeCollectorInitialBalance + platformFee);
    }
    
    function test_CannotMarkShippedByNonSeller() public {
        uint256 tradeId = _createAndFundTrade();
        
        vm.prank(buyer);
        vm.expectRevert(PaySlab.UnauthorizedAccess.selector);
        payslab.markShipped(tradeId, "DHL123456789");
    }
    
    function test_CannotMarkShippedUnfundedTrade() public {
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Test",
            false
        );
        
        vm.prank(seller);
        vm.expectRevert(PaySlab.InvalidTradeStatus.selector);
        payslab.markShipped(tradeId, "DHL123456789");
    }
    
    // ============ Delivery Confirmation Tests ============
    
    function test_ConfirmDelivery() public {
        uint256 tradeId = _createFundAndShipTrade();
        
        uint256 sellerInitialBalance = mockUSDC.balanceOf(seller);
        uint256 feeCollectorInitialBalance = mockUSDC.balanceOf(feeCollector);
        
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        
        // Check final payment release (50%)
        uint256 deliveryAmount = TRADE_AMOUNT * 50 / 100;
        uint256 platformFee = deliveryAmount * PLATFORM_FEE_RATE / 10000;
        uint256 sellerAmount = deliveryAmount - platformFee;
        
        assertEq(mockUSDC.balanceOf(seller), sellerInitialBalance + sellerAmount);
        assertEq(mockUSDC.balanceOf(feeCollector), feeCollectorInitialBalance + platformFee);
    }
    
    function test_ConfirmDeliveryByOwner() public {
        uint256 tradeId = _createFundAndShipTrade();
        
        vm.prank(owner);
        payslab.confirmDelivery(tradeId);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.COMPLETED));
    }
    
    // ============ Quality Inspection Tests ============
    
    function test_QualityInspectionRequired() public {
        uint256 tradeId = _createFundAndShipTradeWithInspection();
        
        // Confirm delivery first
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.DELIVERED));
        
        // Complete quality inspection
        vm.prank(inspector);
        payslab.completeQualityInspection(tradeId, PaySlab.InspectionStatus.PASSED);
        
        trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.COMPLETED));
        assertEq(uint8(trade.inspectionStatus), uint8(PaySlab.InspectionStatus.PASSED));
    }
    
    function test_CannotCompleteInspectionUnauthorized() public {
        uint256 tradeId = _createFundAndShipTradeWithInspection();
        
        vm.prank(buyer);
        vm.expectRevert(PaySlab.UnauthorizedAccess.selector);
        payslab.completeQualityInspection(tradeId, PaySlab.InspectionStatus.PASSED);
    }
    
    // ============ Dispute Tests ============
    
    function test_DisputeTrade() public {
        uint256 tradeId = _createAndFundTrade();
        
        vm.prank(buyer);
        payslab.disputeTrade(tradeId, "Goods not as described");
        
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(PaySlab.TradeStatus.DISPUTED));
    }
    
    function test_CannotDisputeCompletedTrade() public {
        uint256 tradeId = _createFundAndShipTrade();
        
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        vm.prank(buyer);
        vm.expectRevert(PaySlab.InvalidTradeStatus.selector);
        payslab.disputeTrade(tradeId, "Too late");
    }
    
    // ============ Admin Tests ============
    
    function test_AddRemoveInspector() public {
        address newInspector = makeAddr("newInspector");
        
        assertFalse(payslab.authorizedInspectors(newInspector));
        
        vm.prank(owner);
        payslab.addInspector(newInspector);
        assertTrue(payslab.authorizedInspectors(newInspector));
        
        vm.prank(owner);
        payslab.removeInspector(newInspector);
        assertFalse(payslab.authorizedInspectors(newInspector));
    }
    
    function test_UpdatePlatformFee() public {
        uint256 newFeeRate = 200; // 2%
        
        vm.prank(owner);
        payslab.updatePlatformFee(newFeeRate);
        
        assertEq(payslab.platformFeeRate(), newFeeRate);
    }
    
    function test_CannotSetExcessiveFee() public {
        vm.prank(owner);
        vm.expectRevert("Fee too high");
        payslab.updatePlatformFee(600); // 6% (max is 5%)
    }
    
    function test_OnlyOwnerCanCallAdminFunctions() public {
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        payslab.addInspector(attacker);
        
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        payslab.updatePlatformFee(200);
    }
    
    // ============ Helper Functions ============
    
    function _createAndFundTrade() internal returns (uint256) {
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Test Trade",
            false
        );
        
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        return tradeId;
    }
    
    function _createFundAndShipTrade() internal returns (uint256) {
        uint256 tradeId = _createAndFundTrade();
        
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL123456789");
        
        return tradeId;
    }
    
    function _createFundAndShipTradeWithInspection() internal returns (uint256) {
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            TRADE_AMOUNT,
            block.timestamp + 30 days,
            "Grade A Cashew",
            true // Quality inspection required
        );
        
        vm.prank(buyer);
        mockUSDC.approve(address(payslab), TRADE_AMOUNT);
        
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        vm.prank(seller);
        payslab.markShipped(tradeId, "DHL123456789");
        
        return tradeId;
    }
}