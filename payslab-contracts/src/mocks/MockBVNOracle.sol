// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MockBVNOracle
 * @dev Mock BVN verification oracle for testing
 */
contract MockBVNOracle {
    struct BVNData {
        string firstName;
        string lastName;
        string middleName;
        string phoneNumber;
        string dateOfBirth;
        string gender;
        bool exists;
        bool isValid;
    }
    
    mapping(string => BVNData) public bvnDatabase;
    mapping(string => bool) public usedBVNs;
    mapping(address => string) public userToBVN;
    mapping(string => address) public bvnToUser;
    
    event BVNRegistered(string indexed bvn, address indexed user);
    event BVNVerified(string indexed bvn, address indexed user, bool success);
    
    constructor() {
        // Setup some test BVN data
        _setupTestData();
    }
    
    function _setupTestData() internal {
        // Test BVN 1 - Valid Nigerian data
        bvnDatabase["12345678901"] = BVNData({
            firstName: "Adebayo",
            lastName: "Johnson",
            middleName: "Oluwaseun",
            phoneNumber: "08012345678",
            dateOfBirth: "1990-05-15",
            gender: "Male",
            exists: true,
            isValid: true
        });
        
        // Test BVN 2 - Valid Nigerian data
        bvnDatabase["10987654321"] = BVNData({
            firstName: "Fatima",
            lastName: "Ibrahim",
            middleName: "Aisha",
            phoneNumber: "08087654321",
            dateOfBirth: "1985-11-22",
            gender: "Female",
            exists: true,
            isValid: true
        });
        
        // Test BVN 3 - Valid Nigerian data
        bvnDatabase["11122233344"] = BVNData({
            firstName: "Chukwuemeka",
            lastName: "Okafor",
            middleName: "Kingsley",
            phoneNumber: "08099887766",
            dateOfBirth: "1992-03-10",
            gender: "Male",
            exists: true,
            isValid: true
        });
        
        // Test BVN 4 - Invalid/Blacklisted
        bvnDatabase["99999999999"] = BVNData({
            firstName: "Invalid",
            lastName: "User",
            middleName: "",
            phoneNumber: "08000000000",
            dateOfBirth: "1980-01-01",
            gender: "Male",
            exists: true,
            isValid: false
        });
        
        // Test BVN 5 - Valid data for testing
        bvnDatabase["55566677788"] = BVNData({
            firstName: "Amina",
            lastName: "Suleiman",
            middleName: "Hauwa",
            phoneNumber: "08055566677",
            dateOfBirth: "1988-07-30",
            gender: "Female",
            exists: true,
            isValid: true
        });
        
        // Test BVN 6 - Valid trader data
        bvnDatabase["77788899900"] = BVNData({
            firstName: "Emeka",
            lastName: "Okwu",
            middleName: "Christopher",
            phoneNumber: "08077788899",
            dateOfBirth: "1987-12-08",
            gender: "Male",
            exists: true,
            isValid: true
        });
        
        // Test BVN 7 - Valid female trader
        bvnDatabase["66677788899"] = BVNData({
            firstName: "Kemi",
            lastName: "Adebayo",
            middleName: "Folake",
            phoneNumber: "08066677788",
            dateOfBirth: "1993-04-25",
            gender: "Female",
            exists: true,
            isValid: true
        });
        
        // Test BVN 8 - Valid exporter
        bvnDatabase["44455566677"] = BVNData({
            firstName: "Yusuf",
            lastName: "Musa",
            middleName: "Abdullahi",
            phoneNumber: "08044455566",
            dateOfBirth: "1989-09-18",
            gender: "Male",
            exists: true,
            isValid: true
        });
        
        // Test BVN 9 - Valid inspector
        bvnDatabase["33344455566"] = BVNData({
            firstName: "Grace",
            lastName: "Eze",
            middleName: "Chinelo",
            phoneNumber: "08033344455",
            dateOfBirth: "1986-06-12",
            gender: "Female",
            exists: true,
            isValid: true
        });
        
        // Test BVN 10 - Valid agricultural trader
        bvnDatabase["22233344455"] = BVNData({
            firstName: "Ibrahim",
            lastName: "Garba",
            middleName: "Sani",
            phoneNumber: "08022233344",
            dateOfBirth: "1991-01-30",
            gender: "Male",
            exists: true,
            isValid: true
        });
    }
    
    function verifyBVN(
        string calldata bvn,
        string calldata firstName,
        string calldata lastName,
        string calldata dateOfBirth
    ) external view returns (bool exists, bool isValid, bool dataMatches) {
        BVNData memory data = bvnDatabase[bvn];
        
        exists = data.exists;
        isValid = data.isValid;
        
        // Check if provided data matches BVN database
        dataMatches = exists && isValid &&
            keccak256(abi.encodePacked(data.firstName)) == keccak256(abi.encodePacked(firstName)) &&
            keccak256(abi.encodePacked(data.lastName)) == keccak256(abi.encodePacked(lastName)) &&
            keccak256(abi.encodePacked(data.dateOfBirth)) == keccak256(abi.encodePacked(dateOfBirth));
    }
    
    function getBVNData(string calldata bvn) external view returns (BVNData memory) {
        require(bvnDatabase[bvn].exists, "BVN not found");
        return bvnDatabase[bvn];
    }
    
    function registerUserBVN(address user, string calldata bvn) external returns (bool) {
        require(bvnDatabase[bvn].exists, "BVN not found");
        require(bvnDatabase[bvn].isValid, "BVN is blacklisted");
        require(!usedBVNs[bvn], "BVN already used");
        require(bytes(userToBVN[user]).length == 0, "User already has BVN");
        
        usedBVNs[bvn] = true;
        userToBVN[user] = bvn;
        bvnToUser[bvn] = user;
        
        emit BVNRegistered(bvn, user);
        return true;
    }
    
    function isBVNUsed(string calldata bvn) external view returns (bool) {
        return usedBVNs[bvn];
    }
    
    function getUserBVN(address user) external view returns (string memory) {
        return userToBVN[user];
    }
    
    function getBVNUser(string calldata bvn) external view returns (address) {
        return bvnToUser[bvn];
    }
    
    // Admin functions for testing
    function addTestBVN(
        string calldata bvn,
        string calldata firstName,
        string calldata lastName,
        string calldata middleName,
        string calldata phoneNumber,
        string calldata dateOfBirth,
        string calldata gender,
        bool isValid
    ) external {
        bvnDatabase[bvn] = BVNData({
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            gender: gender,
            exists: true,
            isValid: isValid
        });
    }
    
    function resetBVN(string calldata bvn) external {
        address user = bvnToUser[bvn];
        if (user != address(0)) {
            delete userToBVN[user];
        }
        delete bvnToUser[bvn];
        usedBVNs[bvn] = false;
    }
    
    function resetUserBVN(address user) external {
        string memory bvn = userToBVN[user];
        if (bytes(bvn).length > 0) {
            delete bvnToUser[bvn];
            usedBVNs[bvn] = false;
        }
        delete userToBVN[user];
    }
    
    // Utility functions for testing scenarios
    function simulateVerificationDelay() external pure returns (bool) {
        // In real implementation, this might involve actual delays
        // For testing, we just return true
        return true;
    }
    
    function getTestBVNs() external pure returns (string[10] memory) {
        return [
            "12345678901",  // Adebayo Johnson
            "10987654321",  // Fatima Ibrahim  
            "11122233344",  // Chukwuemeka Okafor
            "55566677788",  // Amina Suleiman
            "77788899900",  // Emeka Okwu
            "66677788899",  // Kemi Adebayo
            "44455566677",  // Yusuf Musa
            "33344455566",  // Grace Eze
            "22233344455",  // Ibrahim Garba
            "99999999999"   // Invalid/Blacklisted
        ];
    }
    
    function isValidBVNFormat(string calldata bvn) external pure returns (bool) {
        bytes memory bvnBytes = bytes(bvn);
        
        // Check length
        if (bvnBytes.length != 11) {
            return false;
        }
        
        // Check all characters are digits
        for (uint256 i = 0; i < bvnBytes.length; i++) {
            if (bvnBytes[i] < 0x30 || bvnBytes[i] > 0x39) {
                return false;
            }
        }
        
        return true;
    }
    
    // Advanced verification functions for more realistic testing
    function verifyBVNWithPhoto(
        string calldata bvn,
        bytes calldata photoHash
    ) external view returns (bool) {
        BVNData memory data = bvnDatabase[bvn];
        
        // In a real implementation, this would compare with stored photo hash
        // For testing, we'll just check if BVN exists and is valid
        return data.exists && data.isValid && photoHash.length > 0;
    }
    
    function getBVNVerificationLevel(string calldata bvn) external view returns (uint8) {
        BVNData memory data = bvnDatabase[bvn];
        
        if (!data.exists) return 0; // Not found
        if (!data.isValid) return 1; // Found but blacklisted
        if (usedBVNs[bvn]) return 2; // Already used
        return 3; // Available for use
    }
    
    function performAdvancedVerification(
        string calldata bvn,
        string calldata firstName,
        string calldata lastName,
        string calldata phoneNumber,
        string calldata dateOfBirth
    ) external view returns (
        bool bvnExists,
        bool isValidBVN,
        bool nameMatch,
        bool phoneMatch,
        bool dobMatch,
        uint8 confidenceScore
    ) {
        BVNData memory data = bvnDatabase[bvn];
        
        bvnExists = data.exists;
        isValidBVN = data.isValid;
        
        if (!bvnExists || !isValidBVN) {
            return (bvnExists, isValidBVN, false, false, false, 0);
        }
        
        nameMatch = keccak256(abi.encodePacked(data.firstName)) == keccak256(abi.encodePacked(firstName)) &&
                   keccak256(abi.encodePacked(data.lastName)) == keccak256(abi.encodePacked(lastName));
        
        phoneMatch = keccak256(abi.encodePacked(data.phoneNumber)) == keccak256(abi.encodePacked(phoneNumber));
        
        dobMatch = keccak256(abi.encodePacked(data.dateOfBirth)) == keccak256(abi.encodePacked(dateOfBirth));
        
        // Calculate confidence score (0-100)
        confidenceScore = 0;
        if (nameMatch) confidenceScore += 40;
        if (phoneMatch) confidenceScore += 30;
        if (dobMatch) confidenceScore += 30;
    }
    
    // Batch verification for multiple BVNs
    function batchVerifyBVNs(string[] calldata bvns) external view returns (bool[] memory results) {
        results = new bool[](bvns.length);
        
        for (uint256 i = 0; i < bvns.length; i++) {
            BVNData memory data = bvnDatabase[bvns[i]];
            results[i] = data.exists && data.isValid;
        }
    }
    
    // Get BVN statistics for analytics
    function getBVNStats() external view returns (
        uint256 totalBVNs,
        uint256 validBVNs,
        uint256 totalUsedBVNs,
        uint256 blacklistedBVNs
    ) {
        // For the mock, we'll return fixed stats based on our test data
        totalBVNs = 10; // We have 10 test BVNs
        validBVNs = 9;  // 9 are valid
        totalUsedBVNs = 0;   // Will be updated as BVNs are used
        blacklistedBVNs = 1; // 1 is blacklisted
        
        // In reality, you'd iterate through all stored BVNs
    }
}