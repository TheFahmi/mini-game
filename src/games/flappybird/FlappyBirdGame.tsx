'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Bird = {
  y: number;
  velocity: number;
};

type Pipe = {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
};

const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const BIRD_SIZE = 20;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

export default function FlappyBirdGame() {
  const [bird, setBird] = useState<Bird>({ y: GAME_HEIGHT / 2, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const resetGame = useCallback(() => {
    setBird({ y: GAME_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, []);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, [gameStarted, gameOver]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      jump();
    }
  }, [jump]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const updateGame = useCallback(() => {
    if (gameOver) return;

    // Update bird
    setBird(prev => ({
      y: prev.y + prev.velocity,
      velocity: prev.velocity + GRAVITY
    }));

    // Update pipes
    setPipes(prev => {
      let newPipes = prev.map(pipe => ({
        ...pipe,
        x: pipe.x - 2
      })).filter(pipe => pipe.x > -PIPE_WIDTH);

      // Add new pipe
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
        const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
        newPipes.push({
          x: GAME_WIDTH,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
          passed: false
        });
      }

      // Check collision and score
      newPipes = newPipes.map(pipe => {
        if (!pipe.passed && pipe.x < GAME_WIDTH / 2) {
          setScore(s => s + 1);
          return { ...pipe, passed: true };
        }
        return pipe;
      });

      return newPipes;
    });
  }, [gameOver]);

  const checkCollision = useCallback(() => {
    // Check bird boundaries
    if (bird.y < 0 || bird.y + BIRD_SIZE > GAME_HEIGHT) {
      return true;
    }

    // Check pipe collisions
    return pipes.some(pipe => {
      const birdRight = GAME_WIDTH / 2 + BIRD_SIZE;
      const birdLeft = GAME_WIDTH / 2;
      const birdTop = bird.y;
      const birdBottom = bird.y + BIRD_SIZE;

      return (
        birdRight > pipe.x &&
        birdLeft < pipe.x + PIPE_WIDTH &&
        (birdTop < pipe.topHeight || birdBottom > pipe.bottomY)
      );
    });
  }, [bird.y, pipes]);

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

  useEffect(() => {
    if (checkCollision() && gameStarted) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [bird.y, pipes, checkCollision, gameStarted, score, highScore]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(GAME_WIDTH / 2 - BIRD_SIZE / 2, bird.y, BIRD_SIZE, BIRD_SIZE);

    // Draw pipes
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, GAME_HEIGHT - pipe.bottomY);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

    if (!gameStarted) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE to start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.fillText('or click to jump', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);
    }

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
      ctx.fillText(`Final Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
      ctx.font = '16px Arial';
      ctx.fillText('Click New Game to restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
    }
  }, [bird.y, pipes, score, highScore, gameStarted, gameOver]);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem',
      maxWidth: '600px',
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
          {gameOver ? '💀 Game Over!' : '🐦 Flappy Bird'}
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
          onClick={jump}
          style={{
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#87CEEB'
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
          Press SPACE or click to make the bird jump. Avoid the pipes and don't hit the ground!
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
          onClick={() => setHighScore(0)}
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
          Reset High Score
        </button>
      </div>
    </div>
  );
} 