// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ITimeboostExpressLane {
    function submitBid(uint256 bidAmount) external payable;
}
interface IAaveFlashLoan {
    function flashLoanSimple(address receiver, address asset, uint256 amount, bytes calldata params, uint16 ref) external;
}

/// @title ApexTradingBot — Timeboost MEV arbitrage on Arbitrum One
contract ApexTradingBot is Ownable, ReentrancyGuard {
    ITimeboostExpressLane public immutable expressLane;
    IAaveFlashLoan        public immutable aaveLender;
    IERC20                public immutable usdc;

    uint256 public totalProfitUSDC;
    uint256 public executedTrades;
    uint256 public lastTradeAt;
    bool    public isRunning    = true;
    uint256 public minSpreadBps = 15;

    mapping(address => bool) public approvedDEXes;

    event TradeExecuted(address indexed dex, uint256 profit, bool timeboostUsed);
    event RunningToggled(bool newState);

    modifier onlyRunning() { require(isRunning, "Bot paused"); _; }

    constructor(
        address _expressLane, address _aave, address _usdc
    ) Ownable(msg.sender) {
        require(_expressLane != address(0) && _aave != address(0) && _usdc != address(0), "Zero address");
        expressLane = ITimeboostExpressLane(_expressLane);
        aaveLender  = IAaveFlashLoan(_aave);
        usdc        = IERC20(_usdc);
    }

    function executeArbitrage(
        address dexA, address dexB,
        uint256 amountIn, uint256 minAmountOut,
        bool    useTimeboost
    ) external onlyOwner onlyRunning nonReentrant {
        require(approvedDEXes[dexA] && approvedDEXes[dexB], "Unapproved DEX");
        require(amountIn > 0 && minAmountOut > amountIn, "Invalid amounts");
        if (useTimeboost) expressLane.submitBid{value: 2e14}(2e14);
        uint256 snapshot = usdc.balanceOf(address(this));
        aaveLender.flashLoanSimple(address(this), address(usdc), amountIn, abi.encode(dexA, dexB, minAmountOut), 0);
        uint256 profit = usdc.balanceOf(address(this)) - snapshot;
        require((profit * 10000) / amountIn >= minSpreadBps, "Spread too thin");
        totalProfitUSDC += profit;
        executedTrades++;
        lastTradeAt = block.timestamp;
        emit TradeExecuted(dexA, profit, useTimeboost);
    }

    function executeOperation(
        address asset, uint256 amount, uint256 premium, address, bytes calldata
    ) external nonReentrant returns (bool) {
        require(msg.sender == address(aaveLender), "Only Aave");
        IERC20(asset).approve(address(aaveLender), amount + premium);
        return true;
    }

    function setRunning(bool v)                  external onlyOwner { isRunning = v; emit RunningToggled(v); }
    function approveDEX(address dex, bool ok)    external onlyOwner { require(dex != address(0), "Zero address"); approvedDEXes[dex] = ok; }
    function setMinSpreadBps(uint256 bps)        external onlyOwner { require(bps >= 5, "Too low"); minSpreadBps = bps; }
    function withdrawProfit(address to, uint256 a) external onlyOwner nonReentrant {
        require(to != address(0), "Zero address");
        require(usdc.balanceOf(address(this)) >= a, "Low balance");
        usdc.transfer(to, a);
    }
    receive() external payable {}
}
