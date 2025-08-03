'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

type Paddle = {
  y: number;
  score: number;
};

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;

export default function PongGame() {
  const [ball, setBall] = useState<Ball>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 4, dy: 2 });
  const [leftPaddle, setLeftPaddle] = useState<Paddle>({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 });
  const [rightPaddle, setRightPaddle] = useState<Paddle>({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const resetGame = useCallback(() => {
    setBall({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 4, dy: 2 });
    setLeftPaddle({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 });
    setRightPaddle({ y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2, score: 0 });
    setGameOver(false);
    setWinner('');
    setGameStarted(false);
  }, []);

  const movePaddle = useCallback((paddle: 'left' | 'right', direction: 'up' | 'down') => {
    if (gameOver) return;

    if (paddle === 'left') {
      setLeftPaddle(prev => ({
        ...prev,
        y: Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prev.y + (direction === 'up' ? -PADDLE_SPEED : PADDLE_SPEED)))
      }));
    } else {
      setRightPaddle(prev => ({
        ...prev,
        y: Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prev.y + (direction === 'up' ? -PADDLE_SPEED : PADDLE_SPEED)))
      }));
    }
  }, [gameOver]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    switch (event.key) {
      case 'w':
      case 'W':
        event.preventDefault();
        movePaddle('left', 'up');
        break;
      case 's':
      case 'S':
        event.preventDefault();
        movePaddle('left', 'down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        movePaddle('right', 'up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        movePaddle('right', 'down');
        break;
    }
  }, [gameStarted, movePaddle]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const updateGame = useCallback(() => {
    if (gameOver) return;

    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;

      // Ball hits top or bottom
      if (newY <= 0 || newY >= GAME_HEIGHT - BALL_SIZE) {
        newDy = -newDy;
      }

      // Ball hits left paddle
      if (newX <= PADDLE_WIDTH && newY >= leftPaddle.y && newY <= leftPaddle.y + PADDLE_HEIGHT) {
        newDx = -newDx;
        newX = PADDLE_WIDTH;
      }

      // Ball hits right paddle
      if (newX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && newY >= rightPaddle.y && newY <= rightPaddle.y + PADDLE_HEIGHT) {
        newDx = -newDx;
        newX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE;
      }

      // Ball goes out of bounds
      if (newX < 0) {
        setRightPaddle(prev => ({ ...prev, score: prev.score + 1 }));
        if (rightPaddle.score + 1 >= 5) {
          setGameOver(true);
          setWinner('Right Player');
        }
        return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: 4, dy: 2 };
      }

      if (newX > GAME_WIDTH) {
        setLeftPaddle(prev => ({ ...prev, score: prev.score + 1 }));
        if (leftPaddle.score + 1 >= 5) {
          setGameOver(true);
          setWinner('Left Player');
        }
        return { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, dx: -4, dy: 2 };
      }

      return { x: newX, y: newY, dx: newDx, dy: newDy };
    });
  }, [gameOver, leftPaddle.y, rightPaddle.y, leftPaddle.score, rightPaddle.score]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = () => {
        updateGame();
        animationRef.current = requestAnimationFrame(gameLoop);
      };
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, updateGame]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(leftPaddle.score.toString(), GAME_WIDTH / 4, 50);
    ctx.fillText(rightPaddle.score.toString(), (GAME_WIDTH / 4) * 3, 50);

    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press any key to start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.font = '16px Arial';
      ctx.fillText('W/S: Left Paddle, Arrow Keys: Right Paddle', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${winner} Wins!`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
      ctx.fillText(`Final Score: ${leftPaddle.score} - ${rightPaddle.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
      ctx.font = '16px Arial';
      ctx.fillText('Click New Game to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
    }
  }, [ball, leftPaddle, rightPaddle, gameStarted, gameOver, winner]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '700px',
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
          {gameOver ? '🏆 Game Over!' : '🏓 Pong'}
        </h2>
      </div>

      {/* Game Canvas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: '#000000'
          }}
        />
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
          Left Player: W/S keys | Right Player: Arrow Keys | First to 5 points wins!
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
      </div>
    </div>
  );
} 