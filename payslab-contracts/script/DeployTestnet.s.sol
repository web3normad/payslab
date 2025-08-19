// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/PaySlab.sol";
import "../src/mocks/MockUSDC.sol";
import "../src/mocks/MockBVNOracle.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title Deploy PaySlab with Mocks for Testing
 * @dev Deployment script for local development and testing
 * 
 * Usage:
 * forge script script/DeployTestnet.s.sol:DeployTestnet --rpc-url anvil --broadcast
 */
contract DeployTestnet is Script {
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying PaySlab testnet version...");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Mock USDC
        MockUSDC mockUSDC = new MockUSDC();
        console.log("Mock USDC deployed to:", address(mockUSDC));
        
        // Deploy Mock BVN Oracle
        MockBVNOracle mockBVNOracle = new MockBVNOracle();
        console.log("Mock BVN Oracle deployed to:", address(mockBVNOracle));
        
        // Deploy PaySlab implementation
        PaySlab implementation = new PaySlab();
        console.log("PaySlab Implementation deployed to:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            PaySlab.initialize.selector,
            address(mockUSDC),    // Mock USDC address
            50,                   // 0.5% platform fee for testing
            deployer              // Fee collector
        );
        
        // Deploy proxy contract
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        PaySlab payslabProxy = PaySlab(address(proxy));
        
        console.log("PaySlab Proxy deployed to:", address(proxy));
        
        // Setup test environment
        _setupTestEnvironment(mockUSDC, payslabProxy, deployer);
        
        vm.stopBroadcast();
        
        console.log("\n=== Testnet Deployment Complete ===");
        console.log("Mock USDC:", address(mockUSDC));
        console.log("Mock BVN Oracle:", address(mockBVNOracle));
        console.log("PaySlab Implementation:", address(implementation));
        console.log("PaySlab Proxy:", address(proxy));
        console.log("Test users created: 5");
        
        // Save testnet deployment
        _saveTestnetDeployment(
            address(mockUSDC),
            address(mockBVNOracle),
            address(implementation),
            address(proxy)
        );
    }
    
    function _setupTestEnvironment(
        MockUSDC mockUSDC,
        PaySlab payslabProxy,
        address deployer
    ) internal {
        // Add deployer as inspector
        payslabProxy.addInspector(deployer);
        
        // Create test users
        address[] memory testUsers = new address[](5);
        for (uint256 i = 0; i < 5; i++) {
            address testUser = vm.addr(i + 1000); // Generate deterministic test addresses
            testUsers[i] = testUser;
            
            // Mint test USDC to each user
            mockUSDC.mint(testUser, 100_000 * 10**6); // 100k USDC per user
            
            console.log("Test user", i + 1, ":", testUser);
            console.log("Balance: 100,000 USDC");
        }
        
        // Mint extra USDC to deployer for testing
        mockUSDC.mint(deployer, 1_000_000 * 10**6); // 1M USDC for deployer
        console.log("Deployer USDC balance: 1,000,000 USDC");
        
        // Setup mock BVN data for test users
        // This would be done in the MockBVNOracle if needed
        
        console.log("Test environment setup complete");
    }
    
    function _saveTestnetDeployment(
        address mockUSDC,
        address mockBVNOracle,
        address implementation,
        address proxy
    ) internal {
        string memory json = "testnet_deployment";
        
        vm.serializeUint(json, "chainId", block.chainid);
        vm.serializeString(json, "network", "Local Testnet");
        vm.serializeAddress(json, "mockUSDC", mockUSDC);
        vm.serializeAddress(json, "mockBVNOracle", mockBVNOracle);
        vm.serializeAddress(json, "implementation", implementation);
        vm.serializeAddress(json, "proxy", proxy);
        vm.serializeUint(json, "deployedAt", block.timestamp);
        
        string memory finalJson = vm.serializeAddress(json, "deployer", msg.sender);
        
        vm.writeJson(finalJson, "deployments/testnet.json");
        console.log("Testnet deployment info saved to: deployments/testnet.json");
    }
}

/**
 * @title Setup Demo Data
 * @dev Script to create demo trades and users for testing
 */
contract SetupDemoData is Script {
    function run() external {
        address payslabProxy = vm.envAddress("PAYSLAB_PROXY_ADDRESS");
        address mockUSDC = vm.envAddress("MOCK_USDC_ADDRESS");
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        PaySlab payslab = PaySlab(payslabProxy);
        MockUSDC usdc = MockUSDC(mockUSDC);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Create demo users
        address buyer = vm.addr(1001);
        address seller = vm.addr(1002);
        
        // Mint USDC and verify users
        usdc.mint(buyer, 50_000 * 10**6);
        usdc.mint(seller, 50_000 * 10**6);
        
        // Verify users with mock BVNs
        vm.stopBroadcast();
        
        // Switch to buyer
        vm.startBroadcast(vm.envUint("BUYER_PRIVATE_KEY"));
        payslab.verifyUser("12345678901");
        vm.stopBroadcast();
        
        // Switch to seller
        vm.startBroadcast(vm.envUint("SELLER_PRIVATE_KEY"));
        payslab.verifyUser("10987654321");
        vm.stopBroadcast();
        
        // Create demo trade
        vm.startBroadcast(vm.envUint("BUYER_PRIVATE_KEY"));
        
        // Approve USDC
        usdc.approve(payslabProxy, 10_000 * 10**6);
        
        // Create trade
        uint256 tradeId = payslab.createTrade(
            seller,
            10_000 * 10**6, // 10,000 USDC
            block.timestamp + 30 days, // 30 days delivery
            "Grade A Nigerian Cashew, moisture <8%, foreign matter <2%",
            true // Quality inspection required
        );
        
        // Fund the trade
        payslab.fundTrade(tradeId);
        
        vm.stopBroadcast();
        
        console.log("Demo data created:");
        console.log("Trade ID:", tradeId);
        console.log("Buyer:", buyer);
        console.log("Seller:", seller);
        console.log("Trade Amount: 10,000 USDC");
    }
}