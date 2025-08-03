# 🎮 Mini Games Hub

A collection of classic mini games built with Next.js 15, featuring modern UI and responsive design. All games are playable on desktop and mobile devices.

## 🎯 Features

- **9 Classic Games**: Minesweeper, Tic Tac Toe, Snake, Memory Card, Snake & Ladder, College Game, Flappy Bird, Tetris Classic, and Pong
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **PWA Support**: Install as a web app on mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Offline Support**: Service worker for offline functionality
- **Touch Controls**: Optimized for touch devices
- **Keyboard Controls**: Full keyboard support for desktop

## 🎮 Available Games

### 💣 Minesweeper
- Multiple difficulty levels (Easy, Medium, Hard)
- Flag placement with right-click
- Mine counter and timer
- Classic mine detection gameplay

### ⭕ Tic Tac Toe
- Two-player gameplay
- Score tracking
- Game history
- Win detection

### 🐍 Snake
- Classic snake eating mechanics
- Growing snake length
- Score and high score tracking
- Increasing speed

### 🎴 Memory Card
- Card matching gameplay
- Move counter
- Best score tracking
- Card flip animations

### 🎲 Snake & Ladder
- Two-player board game
- Dice rolling with animation
- Snakes and ladders mechanics
- Win condition tracking

### 🎓 College Game (Lulus Kuliah)
- Resource management gameplay
- Energy, money, and study point management
- GPA progression system
- Win/lose conditions

### 🐦 Flappy Bird
- Physics-based gameplay
- Pipe generation and collision detection
- Score tracking
- High score persistence

### 🧩 Tetris Classic
- **Next piece preview**
- **Classic Tetris scoring system**
- **Hard drop and soft drop mechanics**
- **Pause functionality**
- **Level progression with increasing speed**
- **All 7 classic tetromino pieces (I, O, T, L, J, S, Z)**
- **Line clearing with proper scoring (Single: 100, Double: 300, Triple: 500, Tetris: 800)**

### 🏓 Pong
- Two-player paddle game
- Real-time physics
- Score tracking
- Win condition

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minesweeper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3002](http://localhost:3002)

## 📱 PWA Features

This application is a Progressive Web App (PWA) with the following features:

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen mode and native feel
- **Fast Loading**: Cached resources for quick access
- **Background Sync**: Handles offline actions when connection returns

### Installing as PWA

1. **Chrome/Edge**: Click the install icon in the address bar
2. **Safari**: Use "Add to Home Screen" from the share menu
3. **Firefox**: Click the install icon in the address bar

## 🎮 How to Play

### Tetris Classic Controls
- **Arrow Keys**: Move piece left/right
- **Down Arrow**: Soft drop (move down faster)
- **Up Arrow**: Rotate piece
- **Spacebar**: Hard drop (instant drop)
- **P Key**: Pause/Resume game

### General Game Controls
- **Mouse/Touch**: Click/tap to interact
- **Keyboard**: Arrow keys for movement
- **Right-click**: Flag placement (Minesweeper)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with PWA metadata
│   └── page.tsx           # Main page with game selector
├── games/                 # All game components
│   ├── minesweeper/       # Minesweeper game
│   │   ├── components/    # Game-specific components
│   │   ├── index.ts       # Exports
│   │   └── MinesweeperGame.tsx
│   ├── tictactoe/         # Tic Tac Toe game
│   ├── snake/             # Snake game
│   ├── memory/            # Memory Card game
│   ├── snakeladder/       # Snake & Ladder game
│   ├── college/           # College Game
│   ├── flappybird/        # Flappy Bird game
│   ├── tetris/            # Tetris Classic game
│   ├── pong/              # Pong game
│   └── index.ts           # Central game exports
├── components/            # Shared components
│   └── ServiceWorkerRegistration.tsx
└── public/               # Static assets
    ├── manifest.json     # PWA manifest
    ├── sw.js            # Service worker
    └── icons/           # PWA icons
```

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Custom CSS with inline styles
- **PWA**: Service Worker + Web App Manifest
- **Canvas API**: Used for Snake, Flappy Bird, and Pong
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Build Tool**: Turbopack

## 📱 Responsive Design

All games are fully responsive and optimized for:
- **Desktop**: Full keyboard and mouse support
- **Tablet**: Touch controls with keyboard fallback
- **Mobile**: Touch-optimized interface

## 🎯 Game Features

### Tetris Classic Enhancements
- **Next Piece Preview**: See the upcoming piece
- **Classic Scoring**: Authentic Tetris scoring system
- **Hard Drop**: Instant piece placement with bonus points
- **Soft Drop**: Faster downward movement with points
- **Pause System**: Pause and resume functionality
- **Level Progression**: Speed increases with level
- **All Tetrominoes**: Complete set of 7 classic pieces

### PWA Capabilities
- **Offline Play**: Games work without internet
- **Install Prompt**: Easy installation on mobile devices
- **App Shortcuts**: Quick access to popular games
- **Background Sync**: Handles offline actions
- **Caching**: Fast loading and reduced data usage

## 🔧 Development

### Adding a New Game

1. Create a new folder in `src/games/[game-name]/`
2. Create the main game component
3. Add a `components/` folder for sub-components
4. Create `index.ts` files for exports
5. Update the main games index
6. Add to the game selector in `page.tsx`

### PWA Configuration

- **Manifest**: `public/manifest.json`
- **Service Worker**: `public/sw.js`
- **Icons**: Place in `public/` directory
- **Metadata**: Configured in `layout.tsx`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎮 Enjoy Playing!

Visit the Mini Games Hub and enjoy hours of classic gaming fun! 🎮✨
