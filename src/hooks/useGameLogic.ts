import { useState, useEffect, useCallback, useRef } from 'react';

// Constantes module-scope pour garder des références stables (et éviter des deps qui changent à chaque render)
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
] as const;

const PROBABILITIES = {
  red: 18 / 37,
  black: 18 / 37,
  green: 1 / 37,
} as const;

const MULTIPLIERS = {
  red: 2,
  black: 2,
  green: 35,
} as const;

export interface GameState {
  isPlaying: boolean;
  currentRound: number;
  timeRemaining: number;
  results: GameResult[];
  bets: Bet[];
  balance: number;
  houseEdge: number;
  totalWagered: number;
  totalWon: number;
}

export interface GameResult {
  id: number;
  outcome: 'red' | 'green' | 'black';
  multiplier: number;
  timestamp: number;
  winningNumber: number;
  payout: number;
}

export interface Bet {
  id: string;
  type: 'red' | 'green' | 'black';
  amount: number;
  timestamp: number;
  roundId: number;
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentRound: 1,
    timeRemaining: 30,
    results: [],
    bets: [],
    balance: 10.0, // Balance de départ plus réaliste
    houseEdge: 0.027, // 2.7% d'avantage maison (standard casino)
    totalWagered: 0,
    totalWon: 0,
  });

  const [betAmount, setBetAmount] = useState(0);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const roundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Démarrer une nouvelle manche (déclaré tôt car utilisé par des useEffect)
  const startNewRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      currentRound: prev.currentRound + 1,
      timeRemaining: 30,
      bets: [],
    }));
  }, []);

  // Fonction de génération de nombre aléatoire cryptographiquement sécurisée
  const generateRandomNumber = useCallback(() => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 37; // 0-36
  }, []);

  // Déterminer le résultat basé sur le nombre généré
  const getOutcomeFromNumber = useCallback((number: number): 'red' | 'green' | 'black' => {
    if (number === 0) return 'green';
    
    // Nombres rouges sur une roulette européenne
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
  }, []);

  // Calculer les gains avec précision
  const calculateWinnings = useCallback((bets: Bet[], outcome: 'red' | 'green' | 'black') => {
    const winningBets = bets.filter(bet => bet.type === outcome);
    let totalWinnings = 0;

    winningBets.forEach(bet => {
      const multiplier = MULTIPLIERS[outcome];
      totalWinnings += bet.amount * multiplier;
    });

    return totalWinnings;
  }, [MULTIPLIERS]);

  // Calculer l'avantage maison
  const calculateHouseEdge = useCallback((totalWagered: number, totalPayout: number) => {
    return ((totalWagered - totalPayout) / totalWagered) * 100;
  }, []);

  // Terminer une manche avec logique précise
  const endRoundInternal = useCallback((currentState: GameState) => {
    const winningNumber = generateRandomNumber();
    const outcome = getOutcomeFromNumber(winningNumber);
    const winnings = calculateWinnings(currentState.bets, outcome);
    const totalWagered = currentState.bets.reduce((sum, bet) => sum + bet.amount, 0);
    
    const newResult: GameResult = {
      id: currentState.currentRound,
      outcome,
      multiplier: MULTIPLIERS[outcome],
      timestamp: Date.now(),
      winningNumber,
      payout: winnings,
    };

    const newBalance = currentState.balance + winnings;
    const newTotalWagered = currentState.totalWagered + totalWagered;
    const newTotalWon = currentState.totalWon + winnings;

    return { 
      ...newResult, 
      winnings,
      newBalance,
      newTotalWagered,
      newTotalWon,
      totalWagered
    };
  }, [generateRandomNumber, getOutcomeFromNumber, calculateWinnings]);

  // Démarrer automatiquement la première manche
  useEffect(() => {
    const timer = setTimeout(() => {
      startNewRound();
    }, 2000);

    return () => clearTimeout(timer);
  }, [startNewRound]);

  // Timer de jeu optimisé
  useEffect(() => {
    if (!gameState.isPlaying) return;

    gameIntervalRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
        
        if (newTimeRemaining === 0) {
          const result = endRoundInternal(prev);
          return {
            ...prev,
            timeRemaining: 0,
            isPlaying: false,
            results: [result, ...prev.results.slice(0, 49)], // Garder 50 derniers résultats
            balance: result.newBalance,
            totalWagered: result.newTotalWagered,
            totalWon: result.newTotalWon,
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [gameState.isPlaying, endRoundInternal]);

  // Démarrer automatiquement de nouvelles manches
  useEffect(() => {
    if (!gameState.isPlaying && gameState.timeRemaining === 0) {
      roundTimeoutRef.current = setTimeout(() => {
        startNewRound();
      }, 5000); // 5 secondes entre les manches
      
      return () => {
        if (roundTimeoutRef.current) {
          clearTimeout(roundTimeoutRef.current);
        }
      };
    }
  }, [gameState.isPlaying, gameState.timeRemaining, startNewRound]);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
      if (roundTimeoutRef.current) {
        clearTimeout(roundTimeoutRef.current);
      }
    };
  }, []);

  // Placer un pari avec validation stricte
  const placeBet = useCallback((type: 'red' | 'green' | 'black', amount: number) => {
    if (amount <= 0 || amount > gameState.balance || !gameState.isPlaying) {
      return false;
    }

    // Validation du montant minimum et maximum
    if (amount < 0.01 || amount > 1000) {
      return false;
    }

    const newBet: Bet = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount: Math.round(amount * 100) / 100, // Arrondir à 2 décimales
      timestamp: Date.now(),
      roundId: gameState.currentRound,
    };

    setGameState(prev => ({
      ...prev,
      bets: [...prev.bets, newBet],
      balance: prev.balance - newBet.amount,
    }));

    return true;
  }, [gameState.balance, gameState.isPlaying, gameState.currentRound]);

  // Obtenir les statistiques de jeu
  const getGameStats = useCallback(() => {
    const totalRounds = gameState.currentRound - 1;
    const winRate = totalRounds > 0 ? (gameState.results.filter(r => r.payout > 0).length / totalRounds) * 100 : 0;
    const averageBet = gameState.bets.length > 0 ? gameState.totalWagered / gameState.bets.length : 0;
    const houseEdgeActual = gameState.totalWagered > 0 ? calculateHouseEdge(gameState.totalWagered, gameState.totalWon) : 0;

    return {
      totalRounds,
      winRate: Math.round(winRate * 100) / 100,
      averageBet: Math.round(averageBet * 100) / 100,
      houseEdgeActual: Math.round(houseEdgeActual * 100) / 100,
      totalWagered: Math.round(gameState.totalWagered * 100) / 100,
      totalWon: Math.round(gameState.totalWon * 100) / 100,
    };
  }, [gameState, calculateHouseEdge]);

  // Fonction de fin de manche publique
  const endRound = useCallback(() => {
    const result = endRoundInternal(gameState);
    return { outcome: result.outcome, winnings: result.winnings, winningNumber: result.winningNumber };
  }, [gameState, endRoundInternal]);

  return {
    gameState,
    betAmount,
    setBetAmount,
    placeBet,
    startNewRound,
    endRound,
    getGameStats,
    PROBABILITIES,
    MULTIPLIERS,
    ROULETTE_NUMBERS,
  };
}
