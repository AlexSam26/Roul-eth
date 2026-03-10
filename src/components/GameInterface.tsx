'use client';

import React, { useState, useEffect } from 'react';
import { Star, X, Coins, TrendingUp, BarChart3, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GameBlocks from './GameBlocks';
import GameTimer from './GameTimer';
import BetButton from './BetButton';
import { useGameLogic } from '@/hooks/useGameLogic';

interface GameBlock {
  id: number;
  active: boolean;
  color: 'red' | 'gray' | 'green';
  glow?: boolean;
}

export default function GameInterface() {
  const {
    gameState,
    betAmount,
    setBetAmount,
    placeBet,
    getGameStats,
    PROBABILITIES,
    MULTIPLIERS,
  } = useGameLogic();

  const [gameBlocks, setGameBlocks] = useState<GameBlock[]>(
    Array(10).fill(null).map((_, i) => ({
      id: i,
      active: i < 5,
      color: i < 3 ? 'red' : i < 5 ? 'gray' : i < 8 ? 'red' : 'gray',
      glow: i < 3,
    }))
  );

  const [recentResults, setRecentResults] = useState([
    { id: Date.now() - 4, outcome: 'red', multiplier: 2 },
    { id: Date.now() - 3, outcome: 'red', multiplier: 2 },
    { id: Date.now() - 2, outcome: 'red', multiplier: 2 },
    { id: Date.now() - 1, outcome: 'red', multiplier: 2 },
  ]);

  // Update recent results when game results change
  useEffect(() => {
    if (gameState.results.length > 0) {
      const latestResult = gameState.results[0];
      setRecentResults(prev => [
        { id: Date.now(), outcome: latestResult.outcome, multiplier: latestResult.multiplier },
        ...prev.slice(0, 3)
      ]);
    }
  }, [gameState.results]);

  // Update game blocks based on current game state
  useEffect(() => {
    if (!gameState.isPlaying && gameState.results.length > 0) {
      const latestResult = gameState.results[0];
      updateGameBlocks(latestResult.outcome);
    } else if (gameState.isPlaying) {
      // Reset blocks to default state during play
      setGameBlocks(Array(10).fill(null).map((_, i) => ({
        id: i,
        active: i < 5,
        color: i < 3 ? 'red' : i < 5 ? 'gray' : i < 8 ? 'red' : 'gray',
        glow: i < 3,
      })));
    }
  }, [gameState.isPlaying, gameState.results]);

  const updateGameBlocks = (outcome: 'red' | 'green' | 'black') => {
    const newBlocks: GameBlock[] = Array(10).fill(null).map((_, i) => ({
      id: i,
      active: i < 5,
      color: (i < 5 ? outcome : 'gray') as 'red' | 'gray' | 'green',
      glow: i < 5,
    }));
    setGameBlocks(newBlocks);
  };

  // Get current result for roulette display
  const getCurrentResult = () => {
    if (gameState.results.length > 0) {
      return gameState.results[0].outcome;
    }
    return undefined;
  };

  // Check if roulette should be spinning (last 5 seconds)
  const isRouletteSpinning = () => {
    const shouldSpin = gameState.isPlaying && gameState.timeRemaining <= 5;
    return shouldSpin;
  };

  const handleBetAmountChange = (value: number) => {
    setBetAmount(Math.max(0, value));
  };

  const handlePlaceBet = (type: 'red' | 'green' | 'black') => {
    if (betAmount <= 0 || betAmount > gameState.balance) return;
    
    const success = placeBet(type, betAmount);
    if (success) {
      setBetAmount(0);
    }
  };

  const clearBet = () => setBetAmount(0);
  const setLastBet = () => setBetAmount(0.1);
  const addToBet = (amount: number) => setBetAmount(prev => prev + amount);
  const multiplyBet = (multiplier: number) => setBetAmount(prev => prev * multiplier);
  const setMaxBet = () => setBetAmount(gameState.balance);

  const getBetStats = (type: 'red' | 'green' | 'black') => {
    const bets = gameState.bets.filter(bet => bet.type === type);
    return {
      count: bets.length,
      total: bets.reduce((sum, bet) => sum + bet.amount, 0),
    };
  };

  const stats = getGameStats();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header 
        className="flex items-center justify-between px-6 py-4 border-b border-gray-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-6">
          <a href="#" className="text-white hover:text-gray-300 transition-colors">FAQ</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Support</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Docs</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">Referrals</a>
          <X className="w-5 h-5 text-white hover:text-gray-300 cursor-pointer transition-colors" />
        </div>
        
        <motion.h1 
          className="text-3xl font-bold text-white"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ROUL&apos;ETH
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign in
          </motion.button>
          <motion.button 
            className="border border-gray-500 hover:bg-gray-700 hover:text-white px-6 py-2 rounded font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Wallet Connect
          </motion.button>
        </div>
      </motion.header>

      {/* Main Game Area - Compact */}
      <div className="p-6 max-w-5xl mx-auto">
        {/* Game Stats Bar - Compact */}
        <motion.div 
          className="mb-4 grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-xs text-gray-400">Manche</div>
            <div className="text-sm font-bold text-white">#{gameState.currentRound}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-xs text-gray-400">Taux</div>
            <div className="text-sm font-bold text-green-400">{stats.winRate}%</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-xs text-gray-400">Mise moy.</div>
            <div className="text-sm font-bold text-yellow-400">{stats.averageBet} ETH</div>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <div className="text-xs text-gray-400">Maison</div>
            <div className="text-sm font-bold text-red-400">{stats.houseEdgeActual}%</div>
          </div>
        </motion.div>

        {/* Recent Results - Compact */}
        <motion.div 
          className="mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-center space-x-1">
            {recentResults.map((result) => (
              <motion.div
                key={result.id}
                className={`w-3 h-3 rounded-full ${
                  result.outcome === 'red' ? 'bg-red-500' : 
                  result.outcome === 'green' ? 'bg-green-500' : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Game Timer - Compact */}
        <GameTimer
          timeRemaining={gameState.timeRemaining}
          totalTime={30}
          isActive={gameState.isPlaying}
        />

        {/* Game Outcome Display */}
        <div className="mb-6 flex justify-center">
          <GameBlocks 
            blocks={gameBlocks} 
            isSpinning={isRouletteSpinning()}
            result={getCurrentResult()}
          />
        </div>

        {/* Balance Display - Compact */}
        <motion.div 
          className="flex items-center justify-between mb-4 bg-gray-800 p-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm">Balance</span>
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">{gameState.balance.toFixed(2)} ETH</span>
          </div>
          <div className="text-xs text-gray-400">
            Parié: {stats.totalWagered} ETH | Gagné: {stats.totalWon} ETH
          </div>
        </motion.div>

        {/* Bet Amount Input - Compact */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm">Bet amount</span>
            <Coins className="w-4 h-4 text-yellow-400" />
            <input
              type="number"
              value={betAmount}
              onChange={(e) => handleBetAmountChange(parseFloat(e.target.value) || 0)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-gray-500 transition-colors"
              placeholder="0"
              min="0.01"
              max={gameState.balance}
              step="0.01"
            />
          </div>
        </div>

        {/* Betting Controls - Compact */}
        <div className="grid grid-cols-9 gap-1 mb-4">
          {[
            { label: 'Clear', action: clearBet },
            { label: 'Last', action: setLastBet },
            { label: '+1', action: () => addToBet(1) },
            { label: '+10', action: () => addToBet(10) },
            { label: '+100', action: () => addToBet(100) },
            { label: '1/2', action: () => multiplyBet(0.5) },
            { label: 'x2', action: () => multiplyBet(2) },
            { label: 'x4', action: () => multiplyBet(4) },
            { label: 'Max', action: setMaxBet },
          ].map((button, index) => (
            <motion.button
              key={button.label}
              onClick={button.action}
              className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-xs transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              {button.label}
            </motion.button>
          ))}
        </div>

        {/* Betting Sections - Main attraction */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { type: 'red' as const, multiplier: MULTIPLIERS.red, color: 'text-red-400', probability: PROBABILITIES.red },
            { type: 'green' as const, multiplier: MULTIPLIERS.green, color: 'text-green-400', probability: PROBABILITIES.green },
            { type: 'black' as const, multiplier: MULTIPLIERS.black, color: 'text-gray-400', probability: PROBABILITIES.black },
          ].map((betType, index) => {
            const stats = getBetStats(betType.type);
            return (
              <motion.div
                key={betType.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <BetButton
                  type={betType.type}
                  multiplier={betType.multiplier}
                  totalBets={stats.count}
                  totalAmount={stats.total}
                  onPlaceBet={() => handlePlaceBet(betType.type)}
                  disabled={!gameState.isPlaying || betAmount <= 0 || betAmount > gameState.balance}
                  probability={betType.probability}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Login/Demo Section - Compact */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-block border border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <motion.button 
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-semibold transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.button>
              <span className="text-gray-400 text-sm">or</span>
              <motion.button 
                className="border border-gray-600 hover:bg-gray-700 hover:text-white px-4 py-2 rounded font-semibold transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Demo
              </motion.button>
            </div>
            <div className="text-gray-400 text-xs">How does this work?</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
