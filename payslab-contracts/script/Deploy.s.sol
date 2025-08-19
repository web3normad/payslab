// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/PaySlab.sol";
import "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title Deploy PaySlab with Funded Address
 * @dev Deployment script for Base Sepolia with your funded address
 */
contract DeployPaySlabFunded is Script {
    // Your funded address private key (the one that has Base ETH)
    uint256 private constant DEPLOYER_PRIVATE_KEY = 0x0ad471842b8d1d384368f8ea64c937a4aba1ca3c0ac604279478feb137462287;
    
    // Base Sepolia configuration
    address private constant USDC_BASE_SEPOLIA = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    uint256 private constant PLATFORM_FEE_RATE = 100; // 1% in basis points
    
    function run() external {
        address deployer = vm.addr(DEPLOYER_PRIVATE_KEY);
        
        // This should be your funded address: 0x88747BD8D8250e1279731253c8Ec6e5F47549Bf0
        require(deployer == 0x88747BD8D8250e1279731253c8Ec6e5F47549Bf0, "Address mismatch - check private key");
        
        console.log("=== PaySlab Live Deployment on Base Sepolia ===");
        console.log("Deployer:", deployer);
        console.log("Deployer Balance:", deployer.balance / 1e18, "ETH");
        console.log("USDC Address:", USDC_BASE_SEPOLIA);
        console.log("Platform Fee Rate:", PLATFORM_FEE_RATE, "basis points");
        
        // Check balance before deployment
        require(deployer.balance > 0.001 ether, "Insufficient ETH balance for deployment");
        console.log("Sufficient ETH balance confirmed");
        console.log("===============================================");
        
        vm.startBroadcast(DEPLOYER_PRIVATE_KEY);
        
        // Deploy implementation contract
        console.log("Deploying PaySlab Implementation...");
        PaySlab implementation = new PaySlab();
        console.log("Implementation deployed at:", address(implementation));
        
        // Prepare initialization data
        bytes memory initData = abi.encodeWithSelector(
            PaySlab.initialize.selector,
            USDC_BASE_SEPOLIA,    // USDC address
            PLATFORM_FEE_RATE,   // Platform fee rate
            deployer              // Fee collector
        );
        
        // Deploy proxy contract
        console.log("Deploying PaySlab Proxy...");
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), initData);
        console.log("Proxy deployed at:", address(proxy));
        
        // Get proxy instance
        PaySlab payslabProxy = PaySlab(address(proxy));
        
        // Add deployer as inspector
        console.log("Setting up initial configuration...");
        payslabProxy.addInspector(deployer);
        console.log("Added deployer as inspector");
        
        // Verify deployment
        require(payslabProxy.owner() == deployer, "Owner verification failed");
        require(address(payslabProxy.usdc()) == USDC_BASE_SEPOLIA, "USDC verification failed");
        require(payslabProxy.platformFeeRate() == PLATFORM_FEE_RATE, "Fee rate verification failed");
        require(payslabProxy.authorizedInspectors(deployer), "Inspector verification failed");
        console.log("All verifications passed");
        
        vm.stopBroadcast();
        
        console.log("\n === DEPLOYMENT SUCCESSFUL === ");
        console.log("Network: Base Sepolia");
        console.log("Implementation Contract: ", address(implementation));
        console.log("Proxy Contract (MAIN):   ", address(proxy));
        console.log("Contract Owner:          ", deployer);
        console.log("Fee Collector:           ", deployer);
        console.log("Platform Fee Rate:       ", PLATFORM_FEE_RATE, "basis points (1%)");
        console.log("USDC Token:              ", USDC_BASE_SEPOLIA);
        console.log("====================================");
        
        console.log("\n IMPORTANT - SAVE THESE ADDRESSES:");
        console.log("Main Contract (for frontend): ", address(proxy));
        console.log("Implementation:               ", address(implementation));
        console.log("===================================");
        
        console.log("\n View on Base Sepolia Explorer:");
        console.log("Proxy:", string.concat("https://sepolia.basescan.org/address/", vm.toString(address(proxy))));
        console.log("Implementation:", string.concat("https://sepolia.basescan.org/address/", vm.toString(address(implementation))));
        
        console.log("\n Ready for frontend integration!");
    }
}