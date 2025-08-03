'use client';

import { useState, useEffect, useCallback } from 'react';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  const initializeGame = useCallback(() => {
    const selectedEmojis = EMOJIS.slice(0, 8); // Use 8 emojis for 16 cards (8 pairs)
    const gameCards: Card[] = [];
    
    // Create pairs of cards
    selectedEmojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameCompleted(false);
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update cards to show flipped state
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setScore(prev => prev + 10);
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          )
        );
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [cards, flippedCards]);

  // Check if game is completed
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameCompleted(true);
      if (score > bestScore) {
        setBestScore(score);
      }
    }
  }, [cards, score, bestScore]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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
          color: gameCompleted ? '#10b981' : '#1f2937'
        }}>
          {gameCompleted ? '🎉 Congratulations! You completed the game!' : 'Memory Card Game'}
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>Moves</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{moves}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>Best Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{bestScore}</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '2rem',
        background: '#f3f4f6',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched}
            style={{
              width: '100%',
              height: '80px',
              border: 'none',
              background: card.isMatched ? '#dcfce7' : card.isFlipped ? 'white' : '#e5e7eb',
              borderRadius: '8px',
              fontSize: '2rem',
              cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: card.isMatched ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!card.isFlipped && !card.isMatched) {
                e.currentTarget.style.background = '#d1d5db';
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!card.isFlipped && !card.isMatched) {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
          </button>
        ))}
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
          Click on cards to flip them and find matching pairs. Try to complete the game with the fewest moves!
        </p>
      </div>

      {/* Game Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button
          onClick={initializeGame}
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
          onClick={() => setBestScore(0)}
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
          Reset Best Score
        </button>
      </div>
    </div>
  );
} 