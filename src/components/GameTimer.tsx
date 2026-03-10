'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
}

export default function GameTimer({ timeRemaining, totalTime, isActive }: GameTimerProps) {
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Next Round</span>
        <span className={`text-lg font-bold ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
          {timeRemaining}s
        </span>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>
    </div>
  );
}
