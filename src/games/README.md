# 🎮 Games Structure

This directory contains all the mini games organized in separate folders for better maintainability and scalability.

## 📁 Folder Structure

```
src/games/
├── minesweeper/          # 💣 Minesweeper Game
│   ├── index.ts
│   ├── MinesweeperGame.tsx
│   └── components/
│       ├── index.ts
│       ├── Cell.tsx
│       ├── GameControls.tsx
│       └── GameStats.tsx
├── tictactoe/           # ⭕ Tic Tac Toe Game
│   ├── index.ts
│   ├── TicTacToeGame.tsx
│   └── components/
│       └── index.ts
├── snake/               # 🐍 Snake Game
│   ├── index.ts
│   ├── SnakeGame.tsx
│   └── components/
│       └── index.ts
├── memory/              # 🎴 Memory Card Game
│   ├── index.ts
│   ├── MemoryGame.tsx
│   └── components/
│       └── index.ts
├── snakeladder/         # 🎲 Snake & Ladder Game
│   ├── index.ts
│   ├── SnakeLadderGame.tsx
│   └── components/
│       └── index.ts
├── college/             # 🎓 College Graduation Game
│   ├── index.ts
│   ├── CollegeGame.tsx
│   └── components/
│       └── index.ts
├── flappybird/          # 🐦 Flappy Bird Game
│   ├── index.ts
│   ├── FlappyBirdGame.tsx
│   └── components/
│       └── index.ts
├── tetris/              # 🧩 Tetris Game
│   ├── index.ts
│   ├── TetrisGame.tsx
│   └── components/
│       └── index.ts
├── pong/                # 🏓 Pong Game
│   ├── index.ts
│   ├── PongGame.tsx
│   └── components/
│       └── index.ts
├── index.ts             # Main export file
└── README.md            # This file
```

## 🎯 Benefits of This Structure

1. **Modularity**: Each game is self-contained in its own folder
2. **Scalability**: Easy to add new games without cluttering the main components folder
3. **Maintainability**: Game-specific components are co-located with their main game file
4. **Clean Imports**: Centralized exports through index.ts files
5. **Team Development**: Multiple developers can work on different games simultaneously
6. **Component Organization**: Each game has its own components folder for sub-components

## 📦 Adding a New Game

To add a new game:

1. Create a new folder in `src/games/` with the game name
2. Create the main game component (e.g., `NewGame.tsx`)
3. Create a `components/` folder with an `index.ts` file
4. Create an `index.ts` file to export the game and components
5. Add the export to the main `src/games/index.ts` file
6. Update the main page (`src/app/page.tsx`) to include the new game

## 🔧 Usage

All games are imported from the main games index:

```typescript
import { 
  MinesweeperGame,
  TicTacToeGame,
  SnakeGame,
  // ... other games
} from '../games';
```

## 🎮 Available Games

- **Minesweeper**: Classic mine detection with multiple difficulty levels
- **Tic Tac Toe**: Two-player X and O game with score tracking
- **Snake**: Classic snake eating game with growing mechanics
- **Memory Card**: Card matching game with move counter
- **Snake & Ladder**: Board game with dice rolling
- **College**: Resource management game about graduating
- **Flappy Bird**: Physics-based pipe navigation game
- **Tetris**: Classic block stacking with line clearing
- **Pong**: Two-player paddle game with real-time physics 