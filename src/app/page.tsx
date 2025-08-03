'use client';

import { useState } from 'react';
import { 
  MinesweeperGame,
  TicTacToeGame,
  SnakeGame,
  MemoryGame,
  SnakeLadderGame,
  CollegeGame,
  FlappyBirdGame,
  TetrisGame,
  PongGame
} from '../games';

type GameType = 'minesweeper' | 'tictactoe' | 'snake' | 'memory' | 'snakeladder' | 'college' | 'flappybird' | 'tetris' | 'pong';

const GAMES = {
  minesweeper: {
    name: 'Minesweeper',
    description: 'Classic mine detection game',
    icon: '💣',
    color1: '#2563eb',
    color2: '#7c3aed'
  },
  tictactoe: {
    name: 'Tic Tac Toe',
    description: 'Classic X and O game',
    icon: '⭕',
    color1: '#16a34a',
    color2: '#0d9488'
  },
  snake: {
    name: 'Snake',
    description: 'Classic snake eating game',
    icon: '🐍',
    color1: '#ca8a04',
    color2: '#ea580c'
  },
  memory: {
    name: 'Memory Card',
    description: 'Find matching card pairs',
    icon: '🎴',
    color1: '#ec4899',
    color2: '#dc2626'
  },
  snakeladder: {
    name: 'Snake & Ladder',
    description: 'Classic board game with dice',
    icon: '🎲',
    color1: '#4f46e5',
    color2: '#7c3aed'
  },
  college: {
    name: 'Lulus Kuliah',
    description: 'Resource management game',
    icon: '🎓',
    color1: '#0891b2',
    color2: '#0e7490'
  },
  flappybird: {
    name: 'Flappy Bird',
    description: 'Navigate through pipes',
    icon: '🐦',
    color1: '#f59e0b',
    color2: '#d97706'
  },
  tetris: {
    name: 'Tetris',
    description: 'Classic block stacking game',
    icon: '🧩',
    color1: '#8b5cf6',
    color2: '#7c3aed'
  },
  pong: {
    name: 'Pong',
    description: 'Classic paddle game',
    icon: '🏓',
    color1: '#06b6d4',
    color2: '#0891b2'
  }
};

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'minesweeper':
        return <MinesweeperGame />;
      case 'tictactoe':
        return <TicTacToeGame />;
      case 'snake':
        return <SnakeGame />;
      case 'memory':
        return <MemoryGame />;
      case 'snakeladder':
        return <SnakeLadderGame />;
      case 'college':
        return <CollegeGame />;
      case 'flappybird':
        return <FlappyBirdGame />;
      case 'tetris':
        return <TetrisGame />;
      case 'pong':
        return <PongGame />;
      default:
        return null;
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {!selectedGame ? (
          // Game Selection Screen
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              🎮 Mini Games Hub
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'white',
              marginBottom: '3rem',
              opacity: 0.9
            }}>
              Choose your favorite game to play!
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              maxWidth: '1400px',
              margin: '0 auto'
            }}>
              {Object.entries(GAMES).map(([key, game]) => (
                <button
                  key={key}
                  onClick={() => setSelectedGame(key as GameType)}
                  style={{
                    background: `linear-gradient(135deg, ${game.color1} 0%, ${game.color2} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    color: 'white',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {game.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    {game.name}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    opacity: 0.9
                  }}>
                    {game.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Game Screen
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                {GAMES[selectedGame].icon} {GAMES[selectedGame].name}
              </h1>
              <button
                onClick={() => setSelectedGame(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                ← Back to Games
              </button>
            </div>
            {renderGame()}
          </div>
        )}
      </div>
    </main>
  );
}
