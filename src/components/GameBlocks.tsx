'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GameBlock {
  id: number;
  active: boolean;
  color: 'red' | 'gray' | 'green';
  glow?: boolean;
}

interface GameBlocksProps {
  blocks: GameBlock[];
  isSpinning?: boolean;
  result?: 'red' | 'green' | 'black';
}

export default function GameBlocks({ blocks, isSpinning = false, result }: GameBlocksProps) {
  const [ballPosition, setBallPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(100);

  // Configuration exacte de la roulette européenne (37 positions)
  const ROULETTE_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  // Nombres rouges sur une vraie roulette européenne
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  // Démarrer l'animation quand isSpinning change
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      startAnimation();
    }
  }, [isSpinning]);

  const startAnimation = () => {
    setIsAnimating(true);
    setBallPosition(0);
    setSpinSpeed(100);
    
    let pos = 0;
    let speed = 100;
    let acceleration = 1.1;
    
    const interval = setInterval(() => {
      pos = (pos + 1) % ROULETTE_NUMBERS.length;
      setBallPosition(pos);
      
      // Ralentir progressivement pour un effet réaliste
      speed = Math.min(speed * acceleration, 800);
      setSpinSpeed(speed);
      
      if (pos >= ROULETTE_NUMBERS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnimating(false);
          setSpinSpeed(100);
        }, 500);
      }
    }, speed);
  };

  const getNumberColor = (number: number): 'red' | 'green' | 'black' => {
    if (number === 0) return 'green';
    return RED_NUMBERS.includes(number) ? 'red' : 'black';
  };

  const getNumberClass = (number: number) => {
    const color = getNumberColor(number);
    return `w-8 h-8 rounded-full border-2 relative flex items-center justify-center text-xs font-bold ${
      color === 'red' ? 'bg-red-600 border-red-500' : 
      color === 'green' ? 'bg-green-600 border-green-500' : 
      'bg-gray-700 border-gray-600'
    }`;
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      {/* Roulette Container */}
      <div className="relative mb-6">
        {/* Roulette européenne avec effet 3D */}
        <div className="flex justify-center w-full">
          <div className="relative">
            {/* Roulette track */}
            <div className="flex space-x-1 bg-gray-800 p-4 rounded-2xl border-2 border-gray-600 shadow-2xl">
              {ROULETTE_NUMBERS.map((number, index) => (
                <motion.div
                  key={index}
                  className={getNumberClass(number)}
                  animate={isAnimating ? { 
                    scale: [1, 1.05, 1],
                    filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                  } : {}}
                  transition={{ duration: 0.3, repeat: isAnimating ? Infinity : 0 }}
                >
                  <span className="text-white drop-shadow-lg">
                    {number}
                  </span>
                  
                  {/* Boule de la roulette */}
                  {ballPosition === index && (
                    <motion.div 
                      className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-black shadow-lg z-10"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.7)",
                          "0 0 0 8px rgba(255,255,255,0)",
                          "0 0 0 0 rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Indicateur de position */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-yellow-400 rounded-full z-20 shadow-lg" />
          </div>
        </div>
      </div>

      {/* Statut du jeu */}
      <div className="text-center mb-4">
        {isAnimating ? (
          <motion.div 
            className="text-2xl font-bold text-yellow-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🎲 SPINNING... {ROULETTE_NUMBERS[ballPosition]}
          </motion.div>
        ) : result ? (
          <motion.div 
            className={`text-3xl font-bold px-8 py-4 rounded-2xl shadow-lg ${
              result === 'red' ? 'bg-red-600 text-white' :
              result === 'green' ? 'bg-green-600 text-white' :
              'bg-gray-700 text-white'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {result.toUpperCase()}
          </motion.div>
        ) : (
          <div className="text-xl text-gray-400">
            Placez vos paris !
          </div>
        )}
      </div>

      {/* Informations de la roulette européenne */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-red-400 font-semibold">Rouge</div>
          <div className="text-xs">18/37 (48.65%)</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-green-400 font-semibold">Vert</div>
          <div className="text-xs">1/37 (2.70%)</div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <div className="text-gray-400 font-semibold">Noir</div>
          <div className="text-xs">18/37 (48.65%)</div>
        </div>
      </div>

      {/* Multiplicateurs */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Multiplicateurs: Rouge/Noir 2x • Vert 35x
      </div>
    </div>
  );
}
