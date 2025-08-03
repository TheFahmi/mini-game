'use client';

import { useState, useEffect } from 'react';
import { GameState } from './MinesweeperGame';

interface GameStatsProps {
  flagCount: number;
  totalMines: number;
  startTime: number | null;
  endTime: number | null;
  gameState: GameState;
}

export function GameStats({ 
  flagCount, 
  totalMines, 
  startTime, 
  endTime, 
  gameState 
}: GameStatsProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, startTime]);

  const getElapsedTime = () => {
    if (!startTime) return 0;
    const end = endTime || currentTime;
    return Math.floor((end - startTime) / 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingMines = totalMines - flagCount;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>⏱️ Time:</span>
        <span style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#111827' }}>
          {formatTime(getElapsedTime())}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>🚩 Flags:</span>
        <span style={{ 
          fontSize: '1.125rem', 
          fontFamily: 'monospace', 
          fontWeight: 'bold',
          color: remainingMines < 0 ? '#dc2626' : '#111827'
        }}>
          {remainingMines}
        </span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>/ {totalMines}</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Status:</span>
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          backgroundColor: gameState === 'playing' 
            ? '#dbeafe' 
            : gameState === 'won' 
            ? '#dcfce7' 
            : '#fee2e2',
          color: gameState === 'playing' 
            ? '#1e40af' 
            : gameState === 'won' 
            ? '#166534' 
            : '#991b1b'
        }}>
          {gameState === 'playing' ? 'Playing' : gameState === 'won' ? 'Won!' : 'Lost!'}
        </span>
      </div>
    </div>
  );
} 