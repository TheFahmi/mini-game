'use client';

import { CellType, GameState } from './MinesweeperGame';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: () => void;
  gameState: GameState;
}

const getCellContent = (cell: CellType) => {
  if (cell.isFlagged) {
    return '🚩';
  }
  
  if (!cell.isRevealed) {
    return '';
  }
  
  if (cell.isMine) {
    return '💣';
  }
  
  if (cell.neighborMines === 0) {
    return '';
  }
  
  return cell.neighborMines.toString();
};

const getCellClasses = (cell: CellType) => {
  const classes = ['game-cell'];
  
  if (cell.isFlagged) {
    classes.push('cell-flagged');
  } else if (!cell.isRevealed) {
    classes.push('cell-hidden');
  } else if (cell.isMine) {
    classes.push('cell-mine');
  } else {
    classes.push('cell-revealed');
    if (cell.neighborMines > 0) {
      classes.push(`cell-${cell.neighborMines}`);
    }
  }
  
  return classes.join(' ');
};

export function Cell({ cell, onClick, onRightClick, gameState }: CellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };
  
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRightClick();
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRightClick();
  };
  
  const content = getCellContent(cell);
  const cellClasses = getCellClasses(cell);
  const isClickable = gameState === 'playing' && !cell.isRevealed;
  
  return (
    <button
      className={cellClasses}
      onClick={handleClick}
      onMouseDown={handleRightClick}
      onContextMenu={handleContextMenu}
      disabled={!isClickable}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {content}
    </button>
  );
} 