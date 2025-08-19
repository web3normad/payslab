// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../../src/PaySlab.sol";
import "../../src/mocks/MockUSDC.sol";

/**
 * @title TestHelper
 * @dev Utility functions and helpers for PaySlab tests
 */
contract TestHelper is Test {
    
    // ============ Address Generation Helpers ============
    
    function createTestUsers(uint256 count) internal pure returns (address[] memory) {
        address[] memory users = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            users[i] = address(uint160(0x1000 + i));
        }
        return users;
    }
    
    function createBuyer() internal returns (address) {
        return makeAddr("buyer");
    }
    
    function createSeller() internal returns (address) {
        return makeAddr("seller");
    }
    
    function createInspector() internal returns (address) {
        return makeAddr("inspector");
    }
    
    // ============ Mock Data Helpers ============
    
    function generateTestBVN(uint256 seed) internal pure returns (string memory) {
        return string(abi.encodePacked("1234567890", vm.toString(seed % 10)));
    }
    
    function generateTrackingNumber(uint256 seed) internal pure returns (string memory) {
        return string(abi.encodePacked("DHL", vm.toString(seed), "NG"));
    }
    
    function generateQualityStandards(string memory commodity) internal pure returns (string memory) {
        return string(abi.encodePacked(
            "Premium ", 
            commodity, 
            " - Grade A, moisture <8%, foreign matter <2%"
        ));
    }
    
    // ============ Time Helpers ============
    
    function futureTimestamp(uint256 daysFromNow) internal view returns (uint256) {
        return block.timestamp + (daysFromNow * 24 * 60 * 60);
    }
    
    function pastTimestamp(uint256 daysAgo) internal view returns (uint256) {
        return block.timestamp - (daysAgo * 24 * 60 * 60);
    }
    
    function skipDays(uint256 numDays) internal {
        vm.warp(block.timestamp + (numDays * 24 * 60 * 60));
    }
    
    function skipHours(uint256 numHours) internal {
        vm.warp(block.timestamp + (numHours * 60 * 60));
    }
    
    // ============ USDC Helpers ============
    
    function usdcAmount(uint256 dollars) internal pure returns (uint256) {
        return dollars * 10**6; // USDC has 6 decimals
    }
    
    function setupUSDCBalances(
        MockUSDC usdc, 
        address[] memory users, 
        uint256[] memory amounts
    ) internal {
        require(users.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < users.length; i++) {
            usdc.mint(users[i], amounts[i]);
        }
    }
    
    function approveUSDC(MockUSDC usdc, address user, address spender, uint256 amount) internal {
        vm.prank(user);
        usdc.approve(spender, amount);
    }
    
    // ============ PaySlab Setup Helpers ============
    
    function verifyUsers(PaySlab payslab, address[] memory users) internal {
        for (uint256 i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            payslab.verifyUser(generateTestBVN(i + 1));
        }
    }
    
    function setupInspectors(PaySlab payslab, address owner, address[] memory inspectors) internal {
        vm.startPrank(owner);
        for (uint256 i = 0; i < inspectors.length; i++) {
            payslab.addInspector(inspectors[i]);
        }
        vm.stopPrank();
    }
    
    // ============ Trade Creation Helpers ============
    
    struct TradeParams {
        address buyer;
        address seller;
        uint256 amount;
        uint256 deliveryDays;
        string qualityStandards;
        bool inspectionRequired;
    }
    
    function createBasicTrade(
        PaySlab payslab,
        address buyer,
        address seller,
        uint256 amount
    ) internal returns (uint256) {
        vm.prank(buyer);
        return payslab.createTrade(
            seller,
            amount,
            futureTimestamp(30),
            "Standard trade goods",
            false
        );
    }
    
    function createTradeWithParams(
        PaySlab payslab,
        TradeParams memory params
    ) internal returns (uint256) {
        vm.prank(params.buyer);
        return payslab.createTrade(
            params.seller,
            params.amount,
            futureTimestamp(params.deliveryDays),
            params.qualityStandards,
            params.inspectionRequired
        );
    }
    
    function createAndFundTrade(
        PaySlab payslab,
        MockUSDC usdc,
        address buyer,
        address seller,
        uint256 amount
    ) internal returns (uint256) {
        // Create trade
        uint256 tradeId = createBasicTrade(payslab, buyer, seller, amount);
        
        // Fund trade
        vm.prank(buyer);
        usdc.approve(address(payslab), amount);
        
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        return tradeId;
    }
    
    function completeTradeFlow(
        PaySlab payslab,
        MockUSDC usdc,
        address buyer,
        address seller,
        uint256 amount,
        bool withInspection,
        address inspector
    ) internal returns (uint256) {
        // Create trade
        vm.prank(buyer);
        uint256 tradeId = payslab.createTrade(
            seller,
            amount,
            futureTimestamp(30),
            "Complete flow test",
            withInspection
        );
        
        // Fund trade
        vm.prank(buyer);
        usdc.approve(address(payslab), amount);
        vm.prank(buyer);
        payslab.fundTrade(tradeId);
        
        // Ship goods
        vm.prank(seller);
        payslab.markShipped(tradeId, generateTrackingNumber(tradeId));
        
        // Confirm delivery
        vm.prank(buyer);
        payslab.confirmDelivery(tradeId);
        
        // Complete inspection if required
        if (withInspection) {
            vm.prank(inspector);
            payslab.completeQualityInspection(tradeId, PaySlab.InspectionStatus.PASSED);
        }
        
        return tradeId;
    }
    
    // ============ Assertion Helpers ============
    
    function assertTradeStatus(
        PaySlab payslab,
        uint256 tradeId,
        PaySlab.TradeStatus expectedStatus
    ) internal {
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.status), uint8(expectedStatus));
    }
    
    function assertInspectionStatus(
        PaySlab payslab,
        uint256 tradeId,
        PaySlab.InspectionStatus expectedStatus
    ) internal {
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        assertEq(uint8(trade.inspectionStatus), uint8(expectedStatus));
    }
    
    function assertUserVerified(PaySlab payslab, address user, bool expected) internal {
        assertEq(payslab.isUserVerified(user), expected);
    }
    
    function assertBalanceChange(
        MockUSDC usdc,
        address user,
        uint256 balanceBefore,
        int256 expectedChange
    ) internal {
        uint256 currentBalance = usdc.balanceOf(user);
        if (expectedChange >= 0) {
            assertEq(currentBalance, balanceBefore + uint256(expectedChange));
        } else {
            assertEq(currentBalance, balanceBefore - uint256(-expectedChange));
        }
    }
    
    // ============ Fee Calculation Helpers ============
    
    function calculatePlatformFee(uint256 amount, uint256 feeRate) internal pure returns (uint256) {
        return (amount * feeRate) / 10000;
    }
    
    function calculateMilestoneAmounts(uint256 totalAmount) 
        internal 
        pure 
        returns (uint256 deposit, uint256 shipment, uint256 delivery) 
    {
        deposit = (totalAmount * 20) / 100;
        shipment = (totalAmount * 30) / 100;
        delivery = totalAmount - deposit - shipment; // Remaining 50%
    }
    
    function calculateNetAmount(uint256 amount, uint256 feeRate) internal pure returns (uint256) {
        return amount - calculatePlatformFee(amount, feeRate);
    }
    
    // ============ Event Testing Helpers ============
    
    function expectTradeCreatedEvent(
        address buyer,
        address seller,
        uint256 amount,
        uint256 expectedTradeId
    ) internal {
        vm.expectEmit(true, true, true, true);
        // Note: The actual event emission should be done in the test contract
        // that inherits from TestHelper, since events need to be defined there
    }
    
    function expectTradeFundedEvent(uint256 tradeId, uint256 amount) internal {
        vm.expectEmit(true, false, false, true);
        // Event expectation setup only
    }
    
    function expectUserVerifiedEvent(address user, string memory bvn) internal {
        vm.expectEmit(true, false, false, true);
        // Event expectation setup only
    }
    
    // ============ Error Testing Helpers ============
    
    function expectUnauthorizedAccess() internal {
        vm.expectRevert(PaySlab.UnauthorizedAccess.selector);
    }
    
    function expectUserNotVerified() internal {
        vm.expectRevert(PaySlab.UserNotVerified.selector);
    }
    
    function expectInvalidTradeStatus() internal {
        vm.expectRevert(PaySlab.InvalidTradeStatus.selector);
    }
    
    function expectTradeNotFound() internal {
        vm.expectRevert(PaySlab.TradeNotFound.selector);
    }
    
    // ============ Logging Helpers ============
    
    function logTradeDetails(PaySlab payslab, uint256 tradeId) internal view {
        PaySlab.Trade memory trade = payslab.getTrade(tradeId);
        
        console.log("=== Trade Details ===");
        console.log("Trade ID:", tradeId);
        console.log("Buyer:", trade.buyer);
        console.log("Seller:", trade.seller);
        console.log("Amount:", trade.totalAmount / 10**6, "USDC");
        console.log("Status:", uint8(trade.status));
        console.log("Tracking:", trade.trackingNumber);
        console.log("Inspection Required:", trade.qualityInspectionRequired);
        console.log("==================");
    }
    
    function logUserProfile(PaySlab payslab, address user) internal view {
        PaySlab.UserProfile memory profile = payslab.getUserProfile(user);
        
        console.log("=== User Profile ===");
        console.log("Address:", user);
        console.log("BVN:", profile.bvn);
        console.log("Verified:", profile.isVerified);
        console.log("Total Trades:", uint256(profile.totalTrades));
        console.log("Successful Trades:", uint256(profile.successfulTrades));
        console.log("Reputation Score:", uint256(profile.reputationScore));
        console.log("==================");
    }
    
    function logBalances(MockUSDC usdc, address[] memory users, string[] memory labels) internal view {
        require(users.length == labels.length, "Array length mismatch");
        
        console.log("=== Current Balances ===");
        for (uint256 i = 0; i < users.length; i++) {
            console.log(labels[i], ":", usdc.balanceOf(users[i]) / 10**6, "USDC");
        }
        console.log("======================");
    }
    
    // ============ Fuzzing Helpers ============
    
    function boundTradeAmount(uint256 amount) internal pure returns (uint256) {
        return bound(amount, 1000 * 10**6, 1_000_000 * 10**6); // 1K to 1M USDC
    }
    
    function boundDeliveryDays(uint256 numDays) internal pure returns (uint256) {
        return bound(numDays, 1, 365); // 1 day to 1 year
    }
    
    function boundFeeRate(uint256 rate) internal pure returns (uint256) {
        return bound(rate, 10, 500); // 0.1% to 5%
    }
    
    // ============ Scenario Builders ============
    
    function buildBasicTradeScenario(
        PaySlab payslab,
        MockUSDC usdc
    ) internal returns (address buyerAddr, address sellerAddr, uint256 tradeId) {
        buyerAddr = createBuyer();
        sellerAddr = createSeller();
        
        // Setup
        usdc.mint(buyerAddr, usdcAmount(100_000));
        usdc.mint(sellerAddr, usdcAmount(10_000));
        
        vm.prank(buyerAddr);
        payslab.verifyUser("12345678901");
        vm.prank(sellerAddr);
        payslab.verifyUser("10987654321");
        
        // Create trade
        tradeId = createAndFundTrade(payslab, usdc, buyerAddr, sellerAddr, usdcAmount(10_000));
    }
    
    function buildMultiUserScenario(
        PaySlab payslab,
        MockUSDC usdc,
        uint256 userCount
    ) internal returns (address[] memory users, uint256[] memory tradeIds) {
        users = new address[](userCount);
        tradeIds = new uint256[](userCount / 2);
        
        // Create users
        for (uint256 i = 0; i < userCount; i++) {
            users[i] = makeAddr(string(abi.encodePacked("user", vm.toString(i))));
            usdc.mint(users[i], usdcAmount(50_000));
            
            vm.prank(users[i]);
            payslab.verifyUser(generateTestBVN(i + 1));
        }
        
        // Create trades between users (buyers and sellers alternating)
        for (uint256 i = 0; i < userCount / 2; i++) {
            address buyer = users[i * 2];
            address seller = users[i * 2 + 1];
            
            tradeIds[i] = createAndFundTrade(
                payslab, 
                usdc, 
                buyer, 
                seller, 
                usdcAmount(5_000)
            );
        }
    }
}