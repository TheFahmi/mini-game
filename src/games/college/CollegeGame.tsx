'use client';

import { useState, useEffect, useCallback } from 'react';

type Resource = {
  energy: number;
  money: number;
  studyPoints: number;
  gpa: number;
  semester: number;
  daysLeft: number;
};

type Action = {
  name: string;
  energyCost: number;
  moneyCost: number;
  studyGain: number;
  moneyGain: number;
  description: string;
  icon: string;
};

const ACTIONS: Action[] = [
  {
    name: 'Belajar',
    energyCost: 30,
    moneyCost: 0,
    studyGain: 15,
    moneyGain: 0,
    description: 'Belajar untuk meningkatkan IPK',
    icon: '📚'
  },
  {
    name: 'Kerja Part-time',
    energyCost: 25,
    moneyCost: 0,
    studyGain: 0,
    moneyGain: 50,
    description: 'Bekerja untuk mendapatkan uang',
    icon: '💼'
  },
  {
    name: 'Makan',
    energyCost: 0,
    moneyCost: 20,
    studyGain: 0,
    moneyGain: 0,
    description: 'Makan untuk mengembalikan energi',
    icon: '🍕'
  },
  {
    name: 'Minum Kopi',
    energyCost: 0,
    moneyCost: 15,
    studyGain: 0,
    moneyGain: 0,
    description: 'Kopi memberikan energi ekstra',
    icon: '☕'
  },
  {
    name: 'Tidur',
    energyCost: 0,
    moneyCost: 0,
    studyGain: 0,
    moneyGain: 0,
    description: 'Tidur untuk mengembalikan energi',
    icon: '😴'
  }
];

const MAX_ENERGY = 100;
const MAX_STUDY_POINTS = 100;
const GRADUATION_GPA = 3.5;
const TOTAL_SEMESTERS = 8;

export default function CollegeGame() {
  const [resources, setResources] = useState<Resource>({
    energy: 100,
    money: 100,
    studyPoints: 0,
    gpa: 0,
    semester: 1,
    daysLeft: 30
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState('');
  const [actionHistory, setActionHistory] = useState<string[]>([]);

  const performAction = useCallback((action: Action) => {
    if (gameOver || gameWon) return;

    // Check if player has enough resources
    if (resources.energy < action.energyCost) {
      setMessage('❌ Tidak cukup energi!');
      return;
    }
    if (resources.money < action.moneyCost) {
      setMessage('❌ Tidak cukup uang!');
      return;
    }

    setResources(prev => {
      let newEnergy = prev.energy - action.energyCost;
      let newMoney = prev.money - action.moneyCost + action.moneyGain;
      let newStudyPoints = prev.studyPoints + action.studyGain;
      let newGpa = prev.gpa;
      let newSemester = prev.semester;
      let newDaysLeft = prev.daysLeft - 1;

      // Special effects
      if (action.name === 'Makan') {
        newEnergy = Math.min(MAX_ENERGY, newEnergy + 40);
      } else if (action.name === 'Minum Kopi') {
        newEnergy = Math.min(MAX_ENERGY, newEnergy + 25);
      } else if (action.name === 'Tidur') {
        newEnergy = Math.min(MAX_ENERGY, newEnergy + 60);
        newDaysLeft = prev.daysLeft; // Tidur tidak menghabiskan hari
      }

      // Calculate GPA based on study points
      if (newStudyPoints >= MAX_STUDY_POINTS) {
        newGpa = Math.min(4.0, prev.gpa + 0.5);
        newStudyPoints = 0;
        newSemester = Math.min(TOTAL_SEMESTERS, prev.semester + 1);
      }

      // Check win/lose conditions
      if (newGpa >= GRADUATION_GPA && newSemester >= TOTAL_SEMESTERS) {
        setGameWon(true);
        setMessage('🎉 Selamat! Anda berhasil lulus dengan IPK ' + newGpa.toFixed(2) + '!');
      } else if (newDaysLeft <= 0) {
        setGameOver(true);
        setMessage('⏰ Waktu habis! Anda tidak berhasil lulus tepat waktu.');
      } else if (newEnergy <= 0) {
        setGameOver(true);
        setMessage('💀 Anda kelelahan! Jaga kesehatan Anda.');
      } else if (newMoney < 0) {
        setGameOver(true);
        setMessage('💰 Anda bangkrut! Kelola keuangan dengan lebih baik.');
      }

      return {
        energy: newEnergy,
        money: newMoney,
        studyPoints: newStudyPoints,
        gpa: newGpa,
        semester: newSemester,
        daysLeft: newDaysLeft
      };
    });

    // Add to action history
    setActionHistory(prev => [...prev.slice(-4), `${action.icon} ${action.name}`]);
    
    // Clear message after 2 seconds
    setTimeout(() => setMessage(''), 2000);
  }, [resources, gameOver, gameWon]);

  const resetGame = useCallback(() => {
    setResources({
      energy: 100,
      money: 100,
      studyPoints: 0,
      gpa: 0,
      semester: 1,
      daysLeft: 30
    });
    setGameOver(false);
    setGameWon(false);
    setMessage('');
    setActionHistory([]);
  }, []);

  const getProgressPercentage = () => {
    const gpaProgress = (resources.gpa / GRADUATION_GPA) * 50;
    const semesterProgress = (resources.semester / TOTAL_SEMESTERS) * 50;
    return Math.min(100, gpaProgress + semesterProgress);
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
          color: gameWon ? '#10b981' : gameOver ? '#dc2626' : '#1f2937'
        }}>
          {gameWon ? '🎓 Lulus Kuliah!' : gameOver ? '❌ Game Over' : '🎓 Lulus Kuliah'}
        </h2>

        {/* Progress Bar */}
        <div style={{
          background: '#f3f4f6',
          borderRadius: '8px',
          height: '20px',
          marginBottom: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #10b981, #059669)',
            height: '100%',
            width: `${getProgressPercentage()}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
          Progress: {getProgressPercentage().toFixed(1)}% (IPK: {resources.gpa.toFixed(2)}/4.0, Semester: {resources.semester}/{TOTAL_SEMESTERS})
        </div>

        {/* Resources */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>⚡ Energi</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{resources.energy}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>💰 Uang</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>${resources.money}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>📚 Study Points</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{resources.studyPoints}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6b7280' }}>⏰ Hari Tersisa</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{resources.daysLeft}</div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '1rem',
            background: gameWon ? '#dcfce7' : gameOver ? '#fef2f2' : '#dbeafe',
            color: gameWon ? '#166534' : gameOver ? '#dc2626' : '#1e40af',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {ACTIONS.map((action) => (
          <button
            key={action.name}
            onClick={() => performAction(action)}
            disabled={gameOver || gameWon || resources.energy < action.energyCost || resources.money < action.moneyCost}
            style={{
              padding: '1.5rem',
              border: 'none',
              borderRadius: '12px',
              background: (gameOver || gameWon || resources.energy < action.energyCost || resources.money < action.moneyCost) 
                ? '#f3f4f6' : '#f8fafc',
              cursor: (gameOver || gameWon || resources.energy < action.energyCost || resources.money < action.moneyCost) 
                ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (!gameOver && !gameWon && resources.energy >= action.energyCost && resources.money >= action.moneyCost) {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!gameOver && !gameWon && resources.energy >= action.energyCost && resources.money >= action.moneyCost) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{action.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {action.name}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
              {action.description}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              {action.energyCost > 0 && `⚡ -${action.energyCost} `}
              {action.moneyCost > 0 && `💰 -${action.moneyCost} `}
              {action.studyGain > 0 && `📚 +${action.studyGain} `}
              {action.moneyGain > 0 && `💰 +${action.moneyGain} `}
            </div>
          </button>
        ))}
      </div>

      {/* Action History */}
      <div style={{
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Aktivitas Terakhir
        </h3>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          {actionHistory.length > 0 ? actionHistory.join(' → ') : 'Belum ada aktivitas'}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Cara Bermain
        </h3>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '1rem', 
          fontSize: '0.9rem', 
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          <li>🎯 Tujuan: Lulus dengan IPK 3.5+ dalam 8 semester</li>
          <li>⚡ Setiap aktivitas menghabiskan energi</li>
          <li>💰 Belajar gratis, kerja menghasilkan uang</li>
          <li>🍕 Makan dan kopi mengembalikan energi</li>
          <li>😴 Tidur mengembalikan energi tanpa menghabiskan hari</li>
        </ul>
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
  );
} 