'use client';

import { useState, useCallback } from 'react';

type Player = {
  id: number;
  name: string;
  position: number;
  color: string;
};

type SnakeLadder = {
  from: number;
  to: number;
  type: 'snake' | 'ladder';
};

const BOARD_SIZE = 100;
const SNAKES_AND_LADDERS: SnakeLadder[] = [
  // Ladders (going up)
  { from: 4, to: 14, type: 'ladder' },
  { from: 9, to: 31, type: 'ladder' },
  { from: 21, to: 42, type: 'ladder' },
  { from: 28, to: 84, type: 'ladder' },
  { from: 36, to: 44, type: 'ladder' },
  { from: 51, to: 67, type: 'ladder' },
  { from: 71, to: 91, type: 'ladder' },
  { from: 80, to: 100, type: 'ladder' },
  
  // Snakes (going down)
  { from: 17, to: 7, type: 'snake' },
  { from: 54, to: 34, type: 'snake' },
  { from: 62, to: 19, type: 'snake' },
  { from: 64, to: 60, type: 'snake' },
  { from: 87, to: 24, type: 'snake' },
  { from: 93, to: 73, type: 'snake' },
  { from: 95, to: 75, type: 'snake' },
  { from: 98, to: 79, type: 'snake' }
];

export default function SnakeLadderGame() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', position: 1, color: '#ef4444' },
    { id: 2, name: 'Player 2', position: 1, color: '#3b82f6' }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [diceRolling, setDiceRolling] = useState(false);

  const rollDice = useCallback(() => {
    if (gameOver || diceRolling) return;
    
    setDiceRolling(true);
    
    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      setDiceRolling(false);
      
      const newDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newDiceValue);
      
      // Move player
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        const player = newPlayers[currentPlayer];
        let newPosition = player.position + newDiceValue;
        
        // Check if player won
        if (newPosition >= BOARD_SIZE) {
          newPosition = BOARD_SIZE;
          setGameOver(true);
          setWinner(player);
        }
        
        // Check for snakes and ladders
        const snakeOrLadder = SNAKES_AND_LADDERS.find(sl => sl.from === newPosition);
        if (snakeOrLadder) {
          newPosition = snakeOrLadder.to;
        }
        
        player.position = newPosition;
        return newPlayers;
      });
      
      // Switch to next player if game is not over
      if (!gameOver) {
        setCurrentPlayer((prev) => (prev + 1) % players.length);
      }
    }, 1000);
  }, [currentPlayer, gameOver, diceRolling, players.length]);

  const resetGame = useCallback(() => {
    setPlayers([
      { id: 1, name: 'Player 1', position: 1, color: '#ef4444' },
      { id: 2, name: 'Player 2', position: 1, color: '#3b82f6' }
    ]);
    setCurrentPlayer(0);
    setDiceValue(1);
    setGameOver(false);
    setWinner(null);
  }, []);

  const renderBoard = () => {
    const board = [];
    for (let row = 10; row >= 1; row--) {
      const rowCells = [];
      for (let col = 1; col <= 10; col++) {
        const cellNumber = row % 2 === 0 ? 
          (row - 1) * 10 + col : 
          row * 10 - col + 1;
        
        const player = players.find(p => p.position === cellNumber);
        const snakeOrLadder = SNAKES_AND_LADDERS.find(sl => sl.from === cellNumber);
        
        rowCells.push(
          <div
            key={cellNumber}
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid #d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              background: snakeOrLadder ? 
                (snakeOrLadder.type === 'ladder' ? '#dcfce7' : '#fef2f2') : 
                '#f9fafb',
              position: 'relative'
            }}
          >
            <span style={{ color: '#6b7280' }}>{cellNumber}</span>
            {player && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: player.color,
                  border: '1px solid white'
                }}
              />
            )}
            {snakeOrLadder && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '2px',
                  fontSize: '0.5rem',
                  color: snakeOrLadder.type === 'ladder' ? '#16a34a' : '#dc2626'
                }}
              >
                {snakeOrLadder.type === 'ladder' ? '🪜' : '🐍'}
              </div>
            )}
          </div>
        );
      }
      board.push(
        <div key={row} style={{ display: 'flex' }}>
          {rowCells}
        </div>
      );
    }
    return board;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Game Status */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: gameOver ? '#10b981' : '#1f2937'
        }}>
          {gameOver ? `🎉 ${winner?.name} Wins!` : 'Snake and Ladder Game'}
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '1rem'
        }}>
          {players.map((player) => (
            <div key={player.id} style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: currentPlayer === player.id - 1 && !gameOver ? player.color : '#6b7280'
              }}>
                {player.name}
              </div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: player.color 
              }}>
                {player.position}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Board and Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Game Board */}
        <div style={{
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
          background: 'white'
        }}>
          {renderBoard()}
        </div>

        {/* Game Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '200px'
        }}>
          {/* Dice */}
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Dice
            </h3>
            <div style={{
              width: '60px',
              height: '60px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              background: 'white',
              margin: '0 auto',
              animation: diceRolling ? 'shake 0.5s infinite' : 'none'
            }}>
              {diceValue}
            </div>
            <button
              onClick={rollDice}
              disabled={gameOver || diceRolling}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: diceRolling || gameOver ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: diceRolling || gameOver ? 'default' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!diceRolling && !gameOver) {
                  e.currentTarget.style.background = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!diceRolling && !gameOver) {
                  e.currentTarget.style.background = '#10b981';
                }
              }}
            >
              {diceRolling ? 'Rolling...' : gameOver ? 'Game Over' : 'Roll Dice'}
            </button>
          </div>

          {/* Instructions */}
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              How to Play
            </h3>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '1rem', 
              fontSize: '0.9rem', 
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              <li>Roll dice to move</li>
              <li>🪜 Ladders go up</li>
              <li>🐍 Snakes go down</li>
              <li>First to 100 wins!</li>
            </ul>
          </div>

          {/* Game Controls */}
          <button
            onClick={resetGame}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
            }}
          >
            New Game
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
} 