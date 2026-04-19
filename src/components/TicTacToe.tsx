import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy } from 'lucide-react';

type Player = 'X' | 'O' | null;

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<{ player: Player; line: number[] | null } | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every(s => s !== null)) {
      return { player: 'Draw' as any, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
        setWinner(result);
        if (result.player === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
        if (result.player === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Header Info */}
      <div className="flex justify-between w-full max-w-md">
        <div className="text-center">
          <p className={`text-xs uppercase tracking-widest font-black ${isXNext && !winner ? 'text-blue-400' : 'text-white/40'}`}>Player (X)</p>
          <p className="text-4xl font-black">{scores.X.toString().padStart(2, '0')}</p>
        </div>

        <div className="bg-white/10 px-8 py-3 rounded-2xl flex flex-col items-center border border-white/20 frosted-glass">
            {winner ? (
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">GameOver</span>
                    <span className="text-xl font-black">
                        {winner.player === 'Draw' ? 'DRAW' : winner.player === 'X' ? 'P1 WIN' : 'P2 WIN'}
                    </span>
                </motion.div>
            ) : (
                <>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{isXNext ? 'Your Turn' : 'Waiting...'}</span>
                    <span className="text-2xl font-black uppercase tracking-tighter">
                        {isXNext ? 'P1' : 'P2'}
                    </span>
                </>
            )}
        </div>

        <div className="text-center">
          <p className={`text-xs uppercase tracking-widest font-black ${!isXNext && !winner ? 'text-blue-400' : 'text-white/40'}`}>Player (O)</p>
          <p className="text-4xl font-black">{scores.O.toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md p-6 frosted-glass relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zy4=')] opacity-50 pointer-events-none"></div>
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: cell ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(i)}
            className={`cell ${winner?.line?.includes(i) ? 'bg-blue-500/20 border-blue-400/50' : ''}`}
          >
            <AnimatePresence mode="wait">
              {cell === 'X' && (
                <motion.div
                  key="X"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="cell-x"
                >
                  X
                </motion.div>
              )}
              {cell === 'O' && (
                <motion.div
                  key="O"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="cell-o"
                >
                  O
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetGame}
        className="button-primary flex items-center gap-2 uppercase tracking-widest text-xs"
      >
        <RotateCcw size={16} />
        Restart Game
      </motion.button>
    </div>
  );
};

export default TicTacToe;
