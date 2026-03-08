// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title BrainBlastGame — On-chain tournament + NFT character progression
contract BrainBlastGame is ERC721, Ownable, ReentrancyGuard {
    IERC20 public immutable usdt;

    struct Character  { uint8 power; uint8 speed; uint8 shield; uint32 xp; uint16 wins; }
    struct Tournament { uint256 prizePool; uint256 startAt; uint256 endAt; address winner; bool settled; }

    mapping(uint256 => Character)  public characters;
    mapping(uint256 => Tournament) public tournaments;

    uint256 public nextTokenId;
    uint256 public nextTournamentId;
    uint256 public mintPrice      = 5e6;
    uint256 public tournamentFee  = 1e6;
    uint256 public platformFeeBps = 150;
    address public gameOracle;

    event CharacterMinted(address indexed owner, uint256 tokenId, uint8 power, uint8 speed);
    event TournamentCreated(uint256 indexed id, uint256 endAt);
    event TournamentSettled(uint256 indexed id, address winner, uint256 payout);

    modifier onlyOracle() { require(msg.sender == gameOracle, "Only oracle"); _; }

    constructor(address _usdt, address _oracle) ERC721("BrainBlast", "BRAIN") Ownable(msg.sender) {
        require(_usdt != address(0) && _oracle != address(0), "Zero address");
        usdt       = IERC20(_usdt);
        gameOracle = _oracle;
    }

    function mintCharacter() external nonReentrant {
        require(usdt.balanceOf(msg.sender) >= mintPrice, "Insufficient funds");
        usdt.transferFrom(msg.sender, address(this), mintPrice);
        uint256 seed   = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nextTokenId)));
        uint8   power  = uint8(50 + (seed % 50));
        uint8   speed  = uint8(50 + ((seed >> 8) % 50));
        uint8   shield = uint8(30 + ((seed >> 16) % 70));
        characters[nextTokenId] = Character(power, speed, shield, 0, 0);
        _safeMint(msg.sender, nextTokenId);
        emit CharacterMinted(msg.sender, nextTokenId, power, speed);
        nextTokenId++;
    }

    function createTournament(uint256 duration) external onlyOwner {
        require(duration >= 1 hours, "Too short");
        uint256 id    = nextTournamentId++;
        uint256 endAt = block.timestamp + duration;
        tournaments[id] = Tournament(0, block.timestamp, endAt, address(0), false);
        emit TournamentCreated(id, endAt);
    }

    function enterTournament(uint256 tId, uint256 charId) external nonReentrant {
        Tournament storage t = tournaments[tId];
        require(!t.settled && block.timestamp < t.endAt, "Inactive");
        require(ownerOf(charId) == msg.sender, "Not your character");
        usdt.transferFrom(msg.sender, address(this), tournamentFee);
        t.prizePool += tournamentFee;
    }

    function settleTournament(uint256 tId, address winner) external onlyOracle nonReentrant {
        Tournament storage t = tournaments[tId];
        require(!t.settled, "Already settled");
        require(block.timestamp >= t.endAt, "Not ended");
        require(winner != address(0), "Zero address");
        t.settled = true;
        t.winner  = winner;
        uint256 fee    = (t.prizePool * platformFeeBps) / 10000;
        uint256 payout = t.prizePool - fee;
        usdt.transfer(owner(), fee);
        usdt.transfer(winner, payout);
        emit TournamentSettled(tId, winner, payout);
    }

    function setMintPrice(uint256 p)    external onlyOwner { require(p > 0, "Zero"); mintPrice = p; }
    function setTournamentFee(uint256 f) external onlyOwner { require(f > 0, "Zero"); tournamentFee = f; }
    function setGameOracle(address o)   external onlyOwner { require(o != address(0), "Zero address"); gameOracle = o; }
}
