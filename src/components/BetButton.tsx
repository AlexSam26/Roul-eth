'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface BetButtonProps {
  type: 'red' | 'green' | 'black';
  multiplier: number;
  totalBets: number;
  totalAmount: number;
  onPlaceBet: () => void;
  disabled?: boolean;
  probability?: number;
}

export default function BetButton({ 
  type, 
  multiplier, 
  totalBets, 
  totalAmount, 
  onPlaceBet, 
  disabled = false,
  probability
}: BetButtonProps) {
  const getButtonStyle = () => {
    switch (type) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'black':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'red':
        return 'text-red-400';
      case 'green':
        return 'text-green-400';
      case 'black':
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className="bg-gray-900 rounded-lg p-6 border border-gray-700"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className={`font-semibold mb-4 ${getTextColor()}`}>
        {type === 'red' ? 'Reds' : type === 'green' ? 'Green' : 'Blacks'} Win {multiplier}x
      </h3>
      
      {probability && (
        <div className="text-sm text-gray-400 mb-3">
          Probabilité: {(probability * 100).toFixed(2)}%
        </div>
      )}
      
      <motion.button
        onClick={onPlaceBet}
        disabled={disabled}
        className={`w-full py-3 rounded font-semibold mb-4 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${getButtonStyle()}`}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        Place Bet
      </motion.button>
      
      <div className="text-center">
        <div className="text-sm text-gray-400 mb-1">{totalBets} Bets</div>
        <div className="flex items-center justify-center space-x-1">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span>{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
