import React, { useState, useCallback, useMemo } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import PauseMenu from './components/PauseMenu';
import GameOverScreen from './components/GameOverScreen';
import HUD from './components/HUD';
import { GameStatus } from './types';
import type { GameState } from './types';
import { CHEAT_SECRET } from './constants';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.StartScreen);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const calculateChecksum = (score: number, level: number): string => {
    return btoa(`${score}:${level}:${CHEAT_SECRET}`);
  };

  const handleStartGame = useCallback(() => {
    setGameStatus(GameStatus.Playing);
  }, []);

  const handlePauseGame = useCallback(() => {
    setGameStatus(gameStatus === GameStatus.Playing ? GameStatus.Paused : GameStatus.Playing);
  }, [gameStatus]);

  const handleGameOver = useCallback((finalState: GameState) => {
    const { score, level, checksum } = finalState;
    const expectedChecksum = calculateChecksum(score, level);
    if (checksum !== expectedChecksum) {
        console.warn("Checksum mismatch! Potential cheating detected.");
        finalState.score = 0; // Punish the cheater
    }
    setGameState(finalState);
    setGameStatus(GameStatus.GameOver);
  }, []);
  
  const handleRestart = useCallback(() => {
    setGameState(null);
    setGameStatus(GameStatus.Playing);
  }, []);

  const handleQuit = useCallback(() => {
    setGameState(null);
    setGameStatus(GameStatus.StartScreen);
  }, []);

  const memoizedGameState = useMemo(() => gameState, [gameState]);

  return (
    <div className="relative w-screen h-screen bg-slate-900 flex items-center justify-center font-sans overflow-hidden">
      {gameStatus === GameStatus.StartScreen && <StartScreen onStart={handleStartGame} />}
      
      {(gameStatus === GameStatus.Playing || gameStatus === GameStatus.Paused || gameStatus === GameStatus.GameOver) && (
        <>
          <HUD gameState={memoizedGameState} />
          <GameCanvas 
            gameStatus={gameStatus}
            onGameOver={handleGameOver} 
            onStateUpdate={setGameState}
            onPause={handlePauseGame}
            onRestart={handleRestart}
          />
        </>
      )}

      {gameStatus === GameStatus.Paused && <PauseMenu onResume={handlePauseGame} onQuit={handleQuit} />}

      {gameStatus === GameStatus.GameOver && memoizedGameState && (
        <GameOverScreen finalState={memoizedGameState} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default App;
