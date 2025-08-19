// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts-upgradeable/contracts/security/ReentrancyGuardUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import "openzeppelin-contracts-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/**
 * @title PaySlab Trade Platform
 * @dev Core smart contract for Nigerian trade finance with USDC escrow and milestone payments
 */
contract PaySlab is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    IERC20 public usdc;
    
    // Platform fee in basis points (100 = 1%)
    uint256 public platformFeeRate;
    address public feeCollector;
    
    // Trade statuses
    enum TradeStatus { 
        CREATED, 
        FUNDED, 
        SHIPPED, 
        DELIVERED, 
        COMPLETED, 
        DISPUTED, 
        CANCELLED 
    }
    
    // Quality inspection statuses
    enum InspectionStatus { 
        PENDING, 
        PASSED, 
        FAILED, 
        NOT_REQUIRED 
    }
    
    struct Trade {
        uint256 id;
        address buyer;
        address seller;
        uint256 totalAmount;
        uint256 depositAmount; // 20% upfront
        uint256 shipmentAmount; // 30% on shipping
        uint256 deliveryAmount; // 50% on delivery
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
        uint256 reputationScore; // Out of 1000
        uint256 joinedAt;
    }
    
    // State variables
    mapping(uint256 => Trade) public trades;
    mapping(address => UserProfile) public userProfiles;
    mapping(string => bool) public usedBVNs;
    mapping(address => bool) public authorizedInspectors;
    
    uint256 public nextTradeId;
    uint256 public constant REPUTATION_BASE = 1000;
    
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
    
    // Custom errors
    error TradeNotFound();
    error UnauthorizedAccess();
    error InvalidTradeStatus();
    error InsufficientFunds();
    error BVNAlreadyUsed();
    error UserNotVerified();
    error InvalidMilestone();
    error DeliveryDeadlineExceeded();
    
    /**
     * @dev Initialize the contract
     */
    function initialize(
        address _usdc,
        uint256 _platformFeeRate,
        address _feeCollector
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        
        usdc = IERC20(_usdc);
        platformFeeRate = _platformFeeRate;
        feeCollector = _feeCollector;
        nextTradeId = 1;
    }
    
    /**
     * @dev Verify user with BVN (simplified for MVP)
     */
    function verifyUser(string calldata _bvn) external {
        require(bytes(_bvn).length == 11, "Invalid BVN length");
        require(!usedBVNs[_bvn], "BVN already registered");
        
        usedBVNs[_bvn] = true;
        userProfiles[msg.sender] = UserProfile({
            bvn: _bvn,
            isVerified: true,
            totalTrades: 0,
            successfulTrades: 0,
            reputationScore: REPUTATION_BASE / 2, // Start with 500/1000
            joinedAt: block.timestamp
        });
        
        emit UserVerified(msg.sender, _bvn);
    }
    
    /**
     * @dev Create a new trade
     */
    function createTrade(
        address _seller,
        uint256 _totalAmount,
        uint256 _deliveryDeadline,
        string calldata _qualityStandards,
        bool _qualityInspectionRequired
    ) external returns (uint256) {
        if (!userProfiles[msg.sender].isVerified) revert UserNotVerified();
        if (!userProfiles[_seller].isVerified) revert UserNotVerified();
        
        uint256 tradeId = nextTradeId++;
        
        // Calculate milestone amounts
        uint256 depositAmount = (_totalAmount * 20) / 100;
        uint256 shipmentAmount = (_totalAmount * 30) / 100;
        uint256 deliveryAmount = _totalAmount - depositAmount - shipmentAmount;
        
        trades[tradeId] = Trade({
            id: tradeId,
            buyer: msg.sender,
            seller: _seller,
            totalAmount: _totalAmount,
            depositAmount: depositAmount,
            shipmentAmount: shipmentAmount,
            deliveryAmount: deliveryAmount,
            status: TradeStatus.CREATED,
            inspectionStatus: _qualityInspectionRequired ? InspectionStatus.PENDING : InspectionStatus.NOT_REQUIRED,
            trackingNumber: "",
            qualityStandards: _qualityStandards,
            createdAt: block.timestamp,
            deliveryDeadline: _deliveryDeadline,
            qualityInspectionRequired: _qualityInspectionRequired,
            inspector: address(0)
        });
        
        emit TradeCreated(tradeId, msg.sender, _seller, _totalAmount);
        return tradeId;
    }
    
    /**
     * @dev Fund the trade (buyer deposits full amount)
     */
    function fundTrade(uint256 _tradeId) external nonReentrant {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (trade.buyer != msg.sender) revert UnauthorizedAccess();
        if (trade.status != TradeStatus.CREATED) revert InvalidTradeStatus();
        
        // Transfer USDC from buyer to contract
        require(
            usdc.transferFrom(msg.sender, address(this), trade.totalAmount),
            "USDC transfer failed"
        );
        
        trade.status = TradeStatus.FUNDED;
        
        // Release 20% deposit to seller immediately
        uint256 depositAmount = trade.depositAmount;
        uint256 fee = (depositAmount * platformFeeRate) / 10000;
        uint256 payment = depositAmount - fee;
        
        require(usdc.transfer(trade.seller, payment), "Deposit transfer failed");
        require(usdc.transfer(feeCollector, fee), "Fee transfer failed");
        
        // Update user stats
        userProfiles[msg.sender].totalTrades++;
        userProfiles[trade.seller].totalTrades++;
        
        emit TradeFunded(_tradeId, trade.totalAmount);
        emit PaymentReleased(_tradeId, trade.seller, payment, "DEPOSIT");
    }
    
    /**
     * @dev Mark trade as shipped with tracking number
     */
    function markShipped(uint256 _tradeId, string calldata _trackingNumber) external {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (trade.seller != msg.sender) revert UnauthorizedAccess();
        if (trade.status != TradeStatus.FUNDED) revert InvalidTradeStatus();
        
        trade.status = TradeStatus.SHIPPED;
        trade.trackingNumber = _trackingNumber;
        
        // Calculate and release 30% shipment payment
        uint256 shipmentAmount = trade.shipmentAmount;
        uint256 fee = (shipmentAmount * platformFeeRate) / 10000;
        uint256 payment = shipmentAmount - fee;
        
        require(usdc.transfer(trade.seller, payment), "Shipment payment failed");
        require(usdc.transfer(feeCollector, fee), "Fee transfer failed");
        
        emit TradeShipped(_tradeId, _trackingNumber);
        emit PaymentReleased(_tradeId, trade.seller, payment, "SHIPMENT");
    }
    
    /**
     * @dev Confirm delivery (can be called by buyer or oracle)
     */
    function confirmDelivery(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (trade.buyer != msg.sender && owner() != msg.sender) revert UnauthorizedAccess();
        if (trade.status != TradeStatus.SHIPPED) revert InvalidTradeStatus();
        
        trade.status = TradeStatus.DELIVERED;
        
        // If quality inspection required, wait for inspection
        if (trade.qualityInspectionRequired && trade.inspectionStatus == InspectionStatus.PENDING) {
            emit TradeDelivered(_tradeId);
            return;
        }
        
        // Release final 50% payment
        _releaseFinalPayment(_tradeId);
    }
    
    /**
     * @dev Complete quality inspection
     */
    function completeQualityInspection(
        uint256 _tradeId, 
        InspectionStatus _status
    ) external {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (!authorizedInspectors[msg.sender]) revert UnauthorizedAccess();
        if (!trade.qualityInspectionRequired) revert InvalidMilestone();
        
        trade.inspectionStatus = _status;
        trade.inspector = msg.sender;
        
        emit QualityInspectionCompleted(_tradeId, _status, msg.sender);
        
        // If delivered and inspection passed, release final payment
        if (trade.status == TradeStatus.DELIVERED && _status == InspectionStatus.PASSED) {
            _releaseFinalPayment(_tradeId);
        }
    }
    
    /**
     * @dev Internal function to release final payment
     */
    function _releaseFinalPayment(uint256 _tradeId) internal {
        Trade storage trade = trades[_tradeId];
        trade.status = TradeStatus.COMPLETED;
        
        uint256 deliveryAmount = trade.deliveryAmount;
        uint256 platformFee = (deliveryAmount * platformFeeRate) / 10000;
        uint256 sellerAmount = deliveryAmount - platformFee;
        
        require(usdc.transfer(trade.seller, sellerAmount), "Final payment failed");
        require(usdc.transfer(feeCollector, platformFee), "Fee transfer failed");
        
        // Update reputation scores
        _updateReputationScores(trade.buyer, trade.seller, true);
        
        emit PaymentReleased(_tradeId, trade.seller, sellerAmount, "DELIVERY");
        emit TradeCompleted(_tradeId);
    }
    
    /**
     * @dev Dispute a trade
     */
    function disputeTrade(uint256 _tradeId, string calldata _reason) external {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (trade.buyer != msg.sender && trade.seller != msg.sender) revert UnauthorizedAccess();
        if (trade.status == TradeStatus.COMPLETED || trade.status == TradeStatus.CANCELLED) {
            revert InvalidTradeStatus();
        }
        
        trade.status = TradeStatus.DISPUTED;
        emit TradeDisputed(_tradeId, _reason);
    }
    
    /**
     * @dev Cancel trade (only if not shipped)
     */
    function cancelTrade(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];
        if (trade.id == 0) revert TradeNotFound();
        if (trade.buyer != msg.sender && owner() != msg.sender) revert UnauthorizedAccess();
        if (trade.status != TradeStatus.CREATED && trade.status != TradeStatus.FUNDED) {
            revert InvalidTradeStatus();
        }
        
        trade.status = TradeStatus.CANCELLED;
        
        // Refund buyer if trade was funded
        if (trade.status == TradeStatus.FUNDED) {
            uint256 refundAmount = trade.totalAmount - trade.depositAmount;
            require(usdc.transfer(trade.buyer, refundAmount), "Refund failed");
        }
        
        emit TradeCancelled(_tradeId);
    }
    
    /**
     * @dev Update reputation scores
     */
    function _updateReputationScores(address _buyer, address _seller, bool _success) internal {
        UserProfile storage buyerProfile = userProfiles[_buyer];
        UserProfile storage sellerProfile = userProfiles[_seller];
        
        if (_success) {
            buyerProfile.successfulTrades++;
            sellerProfile.successfulTrades++;
            
            // Increase reputation (max 1000)
            if (buyerProfile.reputationScore < 1000) {
                buyerProfile.reputationScore += 10;
            }
            if (sellerProfile.reputationScore < 1000) {
                sellerProfile.reputationScore += 10;
            }
        } else {
            // Decrease reputation for failed trades
            if (buyerProfile.reputationScore > 10) {
                buyerProfile.reputationScore -= 10;
            }
            if (sellerProfile.reputationScore > 10) {
                sellerProfile.reputationScore -= 10;
            }
        }
    }
    
    /**
     * @dev Admin functions
     */
    function addInspector(address _inspector) external onlyOwner {
        authorizedInspectors[_inspector] = true;
    }
    
    function removeInspector(address _inspector) external onlyOwner {
        authorizedInspectors[_inspector] = false;
    }
    
    function updatePlatformFee(uint256 _newFeeRate) external onlyOwner {
        require(_newFeeRate <= 500, "Fee too high"); // Max 5%
        platformFeeRate = _newFeeRate;
    }
    
    function updateFeeCollector(address _newCollector) external onlyOwner {
        feeCollector = _newCollector;
    }
    
    /**
     * @dev View functions
     */
    function getTrade(uint256 _tradeId) external view returns (Trade memory) {
        return trades[_tradeId];
    }
    
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    function getUserReputationScore(address _user) external view returns (uint256) {
        return userProfiles[_user].reputationScore;
    }
    
    function isUserVerified(address _user) external view returns (bool) {
        return userProfiles[_user].isVerified;
    }
    
    /**
     * @dev Authorize upgrade (only owner can upgrade)
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}