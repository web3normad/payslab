// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IPaySlab Interface
 * @dev Interface for the PaySlab trade platform contract
 */
interface IPaySlab {
    // Enums
    enum TradeStatus { 
        CREATED, 
        FUNDED, 
        SHIPPED, 
        DELIVERED, 
        COMPLETED, 
        DISPUTED, 
        CANCELLED 
    }
    
    enum InspectionStatus { 
        PENDING, 
        PASSED, 
        FAILED, 
        NOT_REQUIRED 
    }
    
    // Structs
    struct Trade {
        uint256 id;
        address buyer;
        address seller;
        uint256 totalAmount;
        uint256 depositAmount;
        uint256 shipmentAmount;
        uint256 deliveryAmount;
        TradeStatus status;
        InspectionStatus inspectionStatus;
        string trackingNumber;
        string qualityStandards;
        uint256 createdAt;
        uint256 deliveryDeadline;
        bool qualityInspectionRequired;
        address inspector;
    }
    
    struct UserProfile {
        string bvn;
        bool isVerified;
        uint256 totalTrades;
        uint256 successfulTrades;
        uint256 reputationScore;
        uint256 joinedAt;
    }
    
    // Events
    event TradeCreated(
        uint256 indexed tradeId, 
        address indexed buyer, 
        address indexed seller, 
        uint256 amount
    );
    
    event TradeFunded(uint256 indexed tradeId, uint256 amount);
    event TradeShipped(uint256 indexed tradeId, string trackingNumber);
    event TradeDelivered(uint256 indexed tradeId);
    event TradeCompleted(uint256 indexed tradeId);
    event TradeDisputed(uint256 indexed tradeId, string reason);
    event TradeCancelled(uint256 indexed tradeId);
    
    event PaymentReleased(
        uint256 indexed tradeId, 
        address indexed recipient, 
        uint256 amount, 
        string milestone
    );
    
    event UserVerified(address indexed user, string bvn);
    event QualityInspectionCompleted(
        uint256 indexed tradeId, 
        InspectionStatus status, 
        address inspector
    );
    
    // View Functions
    function getTrade(uint256 _tradeId) external view returns (Trade memory);
    function getUserProfile(address _user) external view returns (UserProfile memory);
    function getUserReputationScore(address _user) external view returns (uint256);
    function isUserVerified(address _user) external view returns (bool);
    function nextTradeId() external view returns (uint256);
    function platformFeeRate() external view returns (uint256);
    function usdc() external view returns (address);
    function authorizedInspectors(address _inspector) external view returns (bool);
    
    // User Functions
    function verifyUser(string calldata _bvn) external;
    
    // Trade Functions
    function createTrade(
        address _seller,
        uint256 _totalAmount,
        uint256 _deliveryDeadline,
        string calldata _qualityStandards,
        bool _qualityInspectionRequired
    ) external returns (uint256);
    
    function fundTrade(uint256 _tradeId) external;
    function markShipped(uint256 _tradeId, string calldata _trackingNumber) external;
    function confirmDelivery(uint256 _tradeId) external;
    function disputeTrade(uint256 _tradeId, string calldata _reason) external;
    function cancelTrade(uint256 _tradeId) external;
    
    // Inspector Functions
    function completeQualityInspection(uint256 _tradeId, InspectionStatus _status) external;
    
    // Admin Functions
    function addInspector(address _inspector) external;
    function removeInspector(address _inspector) external;
    function updatePlatformFee(uint256 _newFeeRate) external;
    function updateFeeCollector(address _newCollector) external;
}

/**
 * @title IERC20 Interface
 * @dev Standard ERC20 interface for token interactions
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}