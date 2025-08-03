'use client';

import { useState, useEffect, useCallback } from 'react';

type Tetromino = {
  shape: number[][];
  color: string;
  name: string;
};

type Position = {
  x: number;
  y: number;
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOS: Tetromino[] = [
  {
    name: 'I',
    shape: [[1, 1, 1, 1]],
    color: '#00f5ff'
  },
  {
    name: 'O',
    shape: [[1, 1], [1, 1]],
    color: '#ffff00'
  },
  {
    name: 'T',
    shape: [[1, 1, 1], [0, 1, 0]],
    color: '#a000f0'
  },
  {
    name: 'L',
    shape: [[1, 1, 1], [1, 0, 0]],
    color: '#f0a000'
  },
  {
    name: 'J',
    shape: [[1, 1, 1], [0, 0, 1]],
    color: '#0000f0'
  },
  {
    name: 'S',
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#00f000'
  },
  {
    name: 'Z',
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#f00000'
  }
];

const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
};

export default function TetrisGame() {
  const [board, setBoard] = useState<number[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(0);
  const [lastDropTime, setLastDropTime] = useState(0);

  const createNewPiece = useCallback((): Tetromino => {
    return TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  }, []);

  const isValidMove = useCallback((piece: Tetromino, position: Position): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }

    setBoard(newBoard);
    
    // Check for completed lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell === 1)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same line again
      }
    }

    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      // Classic Tetris scoring
      let lineScore = 0;
      switch (linesCleared) {
        case 1: lineScore = SCORING.SINGLE; break;
        case 2: lineScore = SCORING.DOUBLE; break;
        case 3: lineScore = SCORING.TRIPLE; break;
        case 4: lineScore = SCORING.TETRIS; break;
      }
      setScore(prev => prev + lineScore * level);
      setLevel(prev => Math.floor((prev + linesCleared) / 10) + 1);
    }

    // Create new piece from next piece
    const newPiece = nextPiece || createNewPiece();
    const newNextPiece = createNewPiece();
    const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 };
    
    if (!isValidMove(newPiece, newPosition)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setNextPiece(newNextPiece);
      setCurrentPosition(newPosition);
    }
  }, [currentPiece, currentPosition, board, isValidMove, createNewPiece, nextPiece, level]);

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
    
    if (isValidMove(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
      if (dy > 0) {
        setScore(prev => prev + SCORING.SOFT_DROP);
      }
    } else if (dy > 0) {
      placePiece();
    }
  }, [currentPiece, currentPosition, gameOver, isPaused, isValidMove, placePiece]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    let dropDistance = 0;
    const newPosition = { ...currentPosition };
    
    while (isValidMove(currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y++;
      dropDistance++;
    }
    
    setCurrentPosition(newPosition);
    setScore(prev => prev + dropDistance * SCORING.HARD_DROP);
    placePiece();
  }, [currentPiece, currentPosition, gameOver, isPaused, isValidMove, placePiece]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse())
    };

    if (isValidMove(rotated, currentPosition)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, currentPosition, gameOver, isPaused, isValidMove]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        event.preventDefault();
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        movePiece(0, 1);
        break;
      case 'ArrowUp':
      case ' ':
        event.preventDefault();
        rotatePiece();
        break;
      case ' ':
        event.preventDefault();
        hardDrop();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        setIsPaused(prev => !prev);
        break;
    }
  }, [gameStarted, movePiece, rotatePiece, hardDrop]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameStarted && !gameOver && !isPaused) {
      const now = Date.now();
      const timeSinceLastDrop = now - lastDropTime;
      const dropInterval = Math.max(50, 1000 - (level - 1) * 50); // Speed increases with level

      if (timeSinceLastDrop > dropInterval) {
        movePiece(0, 1);
        setLastDropTime(now);
      }
    }
  }, [gameStarted, gameOver, isPaused, lastDropTime, level, movePiece]);

  useEffect(() => {
    if (gameStarted && !currentPiece) {
      const newPiece = createNewPiece();
      const newNextPiece = createNewPiece();
      const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), y: 0 };
      setCurrentPiece(newPiece);
      setNextPiece(newNextPiece);
      setCurrentPosition(newPosition);
    }
  }, [gameStarted, currentPiece, createNewPiece]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(null);
    setNextPiece(null);
    setCurrentPosition({ x: 0, y: 0 });
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    setDropTime(0);
    setLastDropTime(0);
  }, []);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 1;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 15px)`,
        gap: '1px',
        background: '#e5e7eb',
        padding: '0.5rem',
        borderRadius: '4px',
        marginTop: '0.5rem'
      }}>
        {nextPiece.shape.flat().map((cell, index) => (
          <div
            key={index}
            style={{
              width: '15px',
              height: '15px',
              background: cell ? nextPiece.color : '#f3f4f6',
              border: '1px solid #d1d5db'
            }}
          />
        ))}
      </div>
    );
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
          color: gameOver ? '#dc2626' : '#1f2937'
        }}>
          {gameOver ? '💀 Game Over!' : isPaused ? '⏸️ Paused' : '🧩 Tetris Classic'}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6b7280' }}>Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6b7280' }}>Lines</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>{lines}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6b7280' }}>Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{level}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#6b7280' }}>Next</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6b7280' }}>
              {nextPiece?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Game Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '2rem'
      }}>
        {/* Game Board */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 20px)`,
            gap: '1px',
            background: '#e5e7eb',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            {renderBoard().flat().map((cell, index) => (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  background: cell ? '#3b82f6' : '#f3f4f6',
                  border: '1px solid #d1d5db'
                }}
              />
            ))}
          </div>
        </div>

        {/* Game Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '120px'
        }}>
          {/* Next Piece */}
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold' }}>
              Next Piece
            </h3>
            {renderNextPiece()}
          </div>

          {/* Controls */}
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold' }}>
              Controls
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
              <div>← → Move</div>
              <div>↓ Soft Drop</div>
              <div>↑ Rotate</div>
              <div>Space Hard Drop</div>
              <div>P Pause</div>
            </div>
          </div>
        </div>

        {/* Scoring Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '120px'
        }}>
          <div style={{
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 'bold' }}>
              Scoring
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: '1.4' }}>
              <div>1 Line: {SCORING.SINGLE}</div>
              <div>2 Lines: {SCORING.DOUBLE}</div>
              <div>3 Lines: {SCORING.TRIPLE}</div>
              <div>4 Lines: {SCORING.TETRIS}</div>
              <div>Soft Drop: +{SCORING.SOFT_DROP}</div>
              <div>Hard Drop: +{SCORING.HARD_DROP}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          How to Play
        </h3>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
          Complete horizontal lines to score points. Speed increases with level!
        </p>
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
          onClick={() => setIsPaused(prev => !prev)}
          disabled={gameOver || !gameStarted}
          style={{
            padding: '0.75rem 1.5rem',
            background: isPaused ? '#f59e0b' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: gameOver || !gameStarted ? 'default' : 'pointer',
            transition: 'background-color 0.2s',
            opacity: gameOver || !gameStarted ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!gameOver && gameStarted) {
              e.currentTarget.style.background = isPaused ? '#d97706' : '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (!gameOver && gameStarted) {
              e.currentTarget.style.background = isPaused ? '#f59e0b' : '#3b82f6';
            }
          }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
} 