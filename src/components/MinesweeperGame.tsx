'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cell } from './Cell';
import { GameControls } from './GameControls';
import { GameStats } from './GameStats';

export type CellType = {
  id: string;
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type GameState = 'playing' | 'won' | 'lost';

export type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_SETTINGS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

export default function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [board, setBoard] = useState<CellType[][]>([]);
  const [firstClick, setFirstClick] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [flagCount, setFlagCount] = useState(0);

  const { rows, cols, mines } = DIFFICULTY_SETTINGS[difficulty];

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: CellType[][] = [];
    for (let i = 0; i < rows; i++) {
      newBoard[i] = [];
      for (let j = 0; j < cols; j++) {
        newBoard[i][j] = {
          id: `${i}-${j}`,
          row: i,
          col: j,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return newBoard;
  }, [rows, cols]);

  // Place mines after first click
  const placeMines = useCallback((board: CellType[][], firstRow: number, firstCol: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;
    
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Don't place mine on first click or if mine already exists
      if ((row === firstRow && col === firstCol) || newBoard[row][col].isMine) {
        continue;
      }
      
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
    
    // Calculate neighbor mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newBoard[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newBoard[ni][nj].isMine) {
                count++;
              }
            }
          }
          newBoard[i][j].neighborMines = count;
        }
      }
    }
    
    return newBoard;
  }, [rows, cols, mines]);

  // Reveal cell and adjacent cells - FIXED VERSION
  const revealCell = useCallback((board: CellType[][], row: number, col: number): CellType[][] => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    if (row < 0 || row >= rows || col < 0 || col >= cols || 
        newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) {
      return newBoard;
    }
    
    newBoard[row][col].isRevealed = true;
    
    if (newBoard[row][col].isMine) {
      return newBoard;
    }
    
    // If no neighbor mines, reveal adjacent cells
    if (newBoard[row][col].neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di !== 0 || dj !== 0) {
            const ni = row + di;
            const nj = col + dj;
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && 
                !newBoard[ni][nj].isRevealed && !newBoard[ni][nj].isFlagged) {
              // Recursively reveal adjacent cells
              const updatedBoard = revealCell(newBoard, ni, nj);
              // Update our board with the changes
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                  newBoard[i][j] = updatedBoard[i][j];
                }
              }
            }
          }
        }
      }
    }
    
    return newBoard;
  }, [rows, cols]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== 'playing') return;
    
    if (firstClick) {
      setFirstClick(false);
      setStartTime(Date.now());
      const newBoard = placeMines(board, row, col);
      const revealedBoard = revealCell(newBoard, row, col);
      setBoard(revealedBoard);
      
      if (revealedBoard[row][col].isMine) {
        setGameState('lost');
        setEndTime(Date.now());
      }
    } else {
      const newBoard = revealCell(board, row, col);
      setBoard(newBoard);
      
      if (newBoard[row][col].isMine) {
        setGameState('lost');
        setEndTime(Date.now());
      }
    }
  }, [board, firstClick, gameState, placeMines, revealCell]);

  // Handle right click (flag)
  const handleRightClick = useCallback((row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isRevealed) return;
    
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagCount(prev => newBoard[row][col].isFlagged ? prev + 1 : prev - 1);
  }, [board, gameState]);

  // Check win condition
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const revealedCount = board.flat().filter(cell => cell.isRevealed).length;
    const totalCells = rows * cols;
    
    if (revealedCount === totalCells - mines) {
      setGameState('won');
      setEndTime(Date.now());
    }
  }, [board, gameState, rows, cols, mines]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(initializeBoard());
    setGameState('playing');
    setFirstClick(true);
    setStartTime(null);
    setEndTime(null);
    setFlagCount(0);
  }, [initializeBoard]);

  // Change difficulty - FIXED VERSION
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // Reset game state immediately
    setGameState('playing');
    setFirstClick(true);
    setStartTime(null);
    setEndTime(null);
    setFlagCount(0);
  }, []);

  // Initialize board on mount and difficulty change
  useEffect(() => {
    setBoard(initializeBoard());
  }, [initializeBoard]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '1.5rem',
      maxWidth: '1024px',
      margin: '0 auto'
    }}>
      <GameControls 
        difficulty={difficulty}
        onDifficultyChange={changeDifficulty}
        onReset={resetGame}
        gameState={gameState}
      />
      
      <GameStats 
        flagCount={flagCount}
        totalMines={mines}
        startTime={startTime}
        endTime={endTime}
        gameState={gameState}
      />
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <div 
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {board.map((row) =>
            row.map((cell) => (
              <Cell
                key={cell.id}
                cell={cell}
                onClick={() => handleCellClick(cell.row, cell.col)}
                onRightClick={() => handleRightClick(cell.row, cell.col)}
                gameState={gameState}
              />
            ))
          )}
        </div>
      </div>
      
      {gameState === 'won' && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
            🎉 Congratulations! You won! 🎉
          </div>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
      
      {gameState === 'lost' && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
            💥 Game Over! 💥
          </div>
          <button
            onClick={resetGame}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 