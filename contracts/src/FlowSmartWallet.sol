// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILayerZeroEndpoint {
    function send(
        uint16 dstChainId, bytes calldata destination, bytes calldata payload,
        address payable refundAddr, address zroPayment, bytes calldata adapterParams
    ) external payable;
}
interface IEntryPoint {
    function depositTo(address account) external payable;
}

/// @title FlowSmartWallet — ERC-4337 Account Abstraction + LayerZero omnichain
contract FlowSmartWallet is Ownable, ReentrancyGuard {
    ILayerZeroEndpoint public immutable lzEndpoint;
    IEntryPoint        public immutable entryPoint;
    IERC20             public immutable usdc;

    uint16  public constant ARB_CHAIN_ID = 110;
    uint256 public constant DAILY_LIMIT  = 10_000e6;

    mapping(bytes32 => bool) public processedMsgHashes;
    mapping(address => uint256) public dailySent;
    mapping(address => uint256) public dailyResetAt;
    mapping(address => bool)    public guardians;

    event Transfer(address indexed to, uint256 amount, uint16 dstChain, bool crossChain);
    event GuardianUpdated(address indexed guardian, bool active);

    constructor(address _lz, address _entry, address _usdc) Ownable(msg.sender) {
        require(_lz != address(0) && _entry != address(0) && _usdc != address(0), "Zero address");
        lzEndpoint = ILayerZeroEndpoint(_lz);
        entryPoint = IEntryPoint(_entry);
        usdc       = IERC20(_usdc);
    }

    function send(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Zero address");
        require(amount > 0, "Zero amount");
        _checkDailyLimit(amount);
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient funds");
        usdc.transfer(to, amount);
        emit Transfer(to, amount, ARB_CHAIN_ID, false);
    }

    function sendCrossChain(
        uint16 dstChainId, bytes calldata destination,
        uint256 amount, uint256 deadline
    ) external payable onlyOwner nonReentrant {
        require(block.timestamp <= deadline, "Expired");
        require(amount > 0, "Zero amount");
        _checkDailyLimit(amount);
        require(usdc.balanceOf(address(this)) >= amount, "Insufficient funds");
        usdc.approve(address(lzEndpoint), amount);
        lzEndpoint.send{value: msg.value}(
            dstChainId, destination,
            abi.encode(destination, amount),
            payable(owner()), address(0), bytes("")
        );
        emit Transfer(address(0), amount, dstChainId, true);
    }

    function lzReceive(
        uint16, bytes calldata, uint64, bytes calldata payload
    ) external nonReentrant {
        require(msg.sender == address(lzEndpoint), "Not LZ endpoint");
        bytes32 h = keccak256(payload);
        require(!processedMsgHashes[h], "Already processed");
        processedMsgHashes[h] = true;
        (address recipient, uint256 amount) = abi.decode(payload, (address, uint256));
        require(recipient != address(0), "Zero address");
        usdc.transfer(recipient, amount);
    }

    function _checkDailyLimit(uint256 amount) internal {
        if (block.timestamp > dailyResetAt[msg.sender] + 1 days) {
            dailySent[msg.sender]    = 0;
            dailyResetAt[msg.sender] = block.timestamp;
        }
        require(dailySent[msg.sender] + amount <= DAILY_LIMIT, "Daily limit exceeded");
        dailySent[msg.sender] += amount;
    }

    function setGuardian(address g, bool active) external onlyOwner {
        require(g != address(0), "Zero address");
        guardians[g] = active;
        emit GuardianUpdated(g, active);
    }
    function depositGas() external payable { entryPoint.depositTo{value: msg.value}(address(this)); }
    receive() external payable {}
}
