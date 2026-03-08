// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title TradeportEscrow — P2P marketplace with USDC escrow and dispute resolution
contract TradeportEscrow is Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;

    enum EscrowState { Active, Released, Refunded, Disputed }
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        uint256 expiresAt;
        EscrowState state;
        string  itemId;
    }

    mapping(uint256 => Escrow)                   public escrows;
    mapping(address => bool)                     public arbitrators;
    mapping(uint256 => mapping(address => bool)) public arbitratorVotes;
    mapping(uint256 => uint8)                    public voteCount;

    uint256 public nextEscrowId;
    uint256 public platformFeeBps = 150;
    uint256 public deliveryWindow = 7 days;
    uint8   public constant VOTE_THRESHOLD = 3;

    event EscrowCreated(uint256 indexed id, address buyer, address seller, uint256 amount);
    event EscrowReleased(uint256 indexed id, address seller, uint256 payout);
    event EscrowRefunded(uint256 indexed id, address buyer, uint256 amount);
    event DisputeRaised(uint256 indexed id);

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Zero address");
        usdc = IERC20(_usdc);
    }

    function createEscrow(
        address seller, uint256 amount, string calldata itemId
    ) external nonReentrant returns (uint256 id) {
        require(seller != address(0) && seller != msg.sender, "Invalid seller");
        require(amount > 0, "Zero amount");
        usdc.transferFrom(msg.sender, address(this), amount);
        id = nextEscrowId++;
        escrows[id] = Escrow(
            msg.sender, seller, amount,
            block.timestamp + deliveryWindow,
            EscrowState.Active, itemId
        );
        emit EscrowCreated(id, msg.sender, seller, amount);
    }

    function confirmDelivery(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        require(msg.sender == e.buyer, "Only buyer");
        require(e.state == EscrowState.Active, "Not active");
        _release(id, e);
    }

    function autoRelease(uint256 id) external nonReentrant {
        Escrow storage e = escrows[id];
        require(e.state == EscrowState.Active, "Not active");
        require(block.timestamp > e.expiresAt, "Window still open");
        _release(id, e);
    }

    function _release(uint256 id, Escrow storage e) internal {
        e.state = EscrowState.Released;
        uint256 fee    = (e.amount * platformFeeBps) / 10000;
        uint256 payout = e.amount - fee;
        usdc.transfer(owner(), fee);
        usdc.transfer(e.seller, payout);
        emit EscrowReleased(id, e.seller, payout);
    }

    function raiseDispute(uint256 id) external {
        Escrow storage e = escrows[id];
        require(msg.sender == e.buyer || msg.sender == e.seller, "Not party");
        require(e.state == EscrowState.Active, "Not active");
        e.state = EscrowState.Disputed;
        emit DisputeRaised(id);
    }

    function voteOnDispute(uint256 id, bool refundBuyer) external nonReentrant {
        require(arbitrators[msg.sender], "Not arbitrator");
        require(!arbitratorVotes[id][msg.sender], "Already voted");
        arbitratorVotes[id][msg.sender] = true;
        voteCount[id]++;
        if (voteCount[id] >= VOTE_THRESHOLD) {
            Escrow storage e = escrows[id];
            require(e.state == EscrowState.Disputed, "Not disputed");
            if (refundBuyer) {
                e.state = EscrowState.Refunded;
                usdc.transfer(e.buyer, e.amount);
                emit EscrowRefunded(id, e.buyer, e.amount);
            } else {
                _release(id, e);
            }
        }
    }

    function setArbitrator(address arb, bool active) external onlyOwner {
        require(arb != address(0), "Zero address");
        arbitrators[arb] = active;
    }
    function setDeliveryWindow(uint256 w) external onlyOwner { require(w >= 1 days, "Too short"); deliveryWindow = w; }
    function setPlatformFee(uint256 bps)  external onlyOwner { require(bps <= 500, "Too high"); platformFeeBps = bps; }
}
