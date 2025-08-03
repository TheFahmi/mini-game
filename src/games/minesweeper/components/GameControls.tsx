'use client';

import { Difficulty, GameState } from './MinesweeperGame';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onReset: () => void;
  gameState: GameState;
}

const DIFFICULTY_LABELS = {
  easy: 'Easy (9x9, 10 mines)',
  medium: 'Medium (16x16, 40 mines)',
  hard: 'Hard (16x30, 99 mines)',
};

export function GameControls({ 
  difficulty, 
  onDifficultyChange, 
  onReset, 
  gameState 
}: GameControlsProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
          Difficulty:
        </label>
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '0.875rem',
            outline: 'none',
            cursor: 'pointer'
          }}
          // Allow difficulty change anytime
        >
          <option value="easy">{DIFFICULTY_LABELS.easy}</option>
          <option value="medium">{DIFFICULTY_LABELS.medium}</option>
          <option value="hard">{DIFFICULTY_LABELS.hard}</option>
        </select>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={onReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: '500',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          {gameState === 'playing' ? 'New Game' : 'Play Again'}
        </button>
        
        {gameState === 'playing' && (
          <button
            onClick={onReset}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              fontWeight: '500',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
} 