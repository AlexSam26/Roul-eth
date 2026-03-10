export const roulEthRouletteAbi = [
  { "inputs": [], "stateMutability": "payable", "type": "constructor" },
  { "inputs": [], "name": "BetOutOfRange", "type": "error" },
  { "inputs": [], "name": "InsufficientBankroll", "type": "error" },
  { "inputs": [], "name": "NotOwner", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum RoulEthRoulette.BetType", "name": "betType", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "amountWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "winningNumber", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "payoutWei", "type": "uint256" }
    ],
    "name": "BetResolved",
    "type": "event"
  },
  { "inputs": [], "name": "bankroll", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "greenMultiplier", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "maxBetWei", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "minBetWei", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [{ "internalType": "enum RoulEthRoulette.BetType", "name": "betType", "type": "uint8" }],
    "name": "placeBet",
    "outputs": [
      { "internalType": "uint8", "name": "winningNumber", "type": "uint8" },
      { "internalType": "uint256", "name": "payoutWei", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "redBlackMultiplier", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_minBetWei", "type": "uint256" }, { "internalType": "uint256", "name": "_maxBetWei", "type": "uint256" }], "name": "setLimits", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_redBlack", "type": "uint256" }, { "internalType": "uint256", "name": "_green", "type": "uint256" }], "name": "setMultipliers", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address payable", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amountWei", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "stateMutability": "payable", "type": "receive" }
] as const;

