'use client';

import { useState, useCallback } from 'react';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];

export default function TicTacToeGame() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [gameHistory, setGameHistory] = useState<{ x: number; o: number }>({ x: 0, o: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = useCallback((boardState: BoardState): Player | 'Draw' | null => {
    // Check for winner
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    
    // Check for draw
    if (boardState.every(cell => cell !== null)) {
      return 'Draw';
    }
    
    return null;
  }, []);

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        setGameHistory(prev => ({
          ...prev,
          [gameWinner.toLowerCase()]: prev[gameWinner.toLowerCase() as keyof typeof prev] + 1
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, winner, checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  }, []);

  const resetScore = useCallback(() => {
    setGameHistory({ x: 0, o: 0 });
  }, []);

  const getStatusMessage = () => {
    if (winner === 'Draw') return "It's a Draw!";
    if (winner) return `Player ${winner} Wins!`;
    return `Player ${currentPlayer}'s Turn`;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {/* Game Status */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: winner ? 
          (winner === 'Draw' ? '#fef3c7' : '#dcfce7') : 
          '#dbeafe',
        borderRadius: '8px',
        color: winner ? 
          (winner === 'Draw' ? '#92400e' : '#166534') : 
          '#1e40af'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          {getStatusMessage()}
        </h2>
      </div>

      {/* Score Board */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>X</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{gameHistory.x}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>O</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{gameHistory.o}</div>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '2rem',
        background: '#e5e7eb',
        padding: '8px',
        borderRadius: '8px'
      }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!winner}
            style={{
              width: '100%',
              height: '80px',
              border: 'none',
              background: 'white',
              borderRadius: '8px',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              cursor: cell || winner ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              color: cell === 'X' ? '#ef4444' : '#3b82f6'
            }}
            onMouseEnter={(e) => {
              if (!cell && !winner) {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cell && !winner) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Game Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button
          onClick={resetGame}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#10b981';
          }}
        >
          New Game
        </button>
        <button
          onClick={resetScore}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#6b7280';
          }}
        >
          Reset Score
        </button>
      </div>
    </div>
  );
} 