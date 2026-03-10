// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * Roulette simplifiée pour testnet (Sepolia).
 *
 * IMPORTANT: ce contrat n'utilise PAS une source d'aléa sûre.
 * Pour une version production: utiliser Chainlink VRF / commit-reveal.
 */
contract RoulEthRoulette {
    enum BetType {
        Red,
        Black,
        Green
    }

    address public owner;

    // Multiplicateurs (payout total) : Red/Black = 2x, Green = 14x (modifiable)
    uint256 public redBlackMultiplier = 2;
    uint256 public greenMultiplier = 14;

    uint256 public minBetWei = 0.001 ether;
    uint256 public maxBetWei = 1 ether;

    event BetResolved(
        address indexed player,
        BetType betType,
        uint256 amountWei,
        uint8 winningNumber,
        uint256 payoutWei
    );

    error NotOwner();
    error BetOutOfRange();
    error InsufficientBankroll();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    receive() external payable {}

    function bankroll() external view returns (uint256) {
        return address(this).balance;
    }

    function setLimits(uint256 _minBetWei, uint256 _maxBetWei) external onlyOwner {
        minBetWei = _minBetWei;
        maxBetWei = _maxBetWei;
    }

    function setMultipliers(uint256 _redBlack, uint256 _green) external onlyOwner {
        redBlackMultiplier = _redBlack;
        greenMultiplier = _green;
    }

    function withdraw(address payable to, uint256 amountWei) external onlyOwner {
        if (amountWei > address(this).balance) amountWei = address(this).balance;
        (bool ok, ) = to.call{value: amountWei}("");
        require(ok, "WITHDRAW_FAILED");
    }

    function placeBet(BetType betType) external payable returns (uint8 winningNumber, uint256 payoutWei) {
        uint256 amount = msg.value;
        if (amount < minBetWei || amount > maxBetWei) revert BetOutOfRange();

        // Tirage pseudo-aléatoire (testnet only)
        winningNumber = _drawNumber(msg.sender);

        // Outcome
        BetType outcome = _outcomeFromNumber(winningNumber);

        if (betType == outcome) {
            uint256 multiplier = (betType == BetType.Green) ? greenMultiplier : redBlackMultiplier;
            payoutWei = amount * multiplier;
        } else {
            payoutWei = 0;
        }

        // Assurer la solvabilité avant paiement
        if (payoutWei > 0 && payoutWei > address(this).balance) revert InsufficientBankroll();

        if (payoutWei > 0) {
            (bool ok, ) = payable(msg.sender).call{value: payoutWei}("");
            require(ok, "PAYOUT_FAILED");
        }

        emit BetResolved(msg.sender, betType, amount, winningNumber, payoutWei);
    }

    function _drawNumber(address player) internal view returns (uint8) {
        // 0..36
        uint256 r = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    blockhash(block.number - 1),
                    block.timestamp,
                    player,
                    address(this).balance
                )
            )
        );
        return uint8(r % 37);
    }

    function _outcomeFromNumber(uint8 n) internal pure returns (BetType) {
        if (n == 0) return BetType.Green;
        if (_isRed(n)) return BetType.Red;
        return BetType.Black;
    }

    function _isRed(uint8 n) internal pure returns (bool) {
        // roulette européenne: 18 rouges
        return
            n == 1 || n == 3 || n == 5 || n == 7 || n == 9 || n == 12 || n == 14 || n == 16 || n == 18 ||
            n == 19 || n == 21 || n == 23 || n == 25 || n == 27 || n == 30 || n == 32 || n == 34 || n == 36;
    }
}

