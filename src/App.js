import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { initGame, initGameFromPattern, nextGeneration, forceToGeneration } from './game';
import { maxSpeedRange, initialDelay, initialSpeedRangeValue, getDelayFromSpeedRange } from './speed';
import Board from './components/Board';
import PatternSelect from './components/PatternSelect';

const getSeedFromNow = () => Date.now();
const initialGame = initGame(getSeedFromNow(), true, 40, 100, 40);

function App() {

  const [currentSpeedRange, setCurrentSpeedRange] = useState(initialSpeedRangeValue);
  const [game, setGame] = useState(initialGame);
  const [delay, setDelay] = useState(initialDelay);
  const [isRunning, setIsRunning] = useState(true);

  const advanceOneGeneration = () => {
    setGame(nextGeneration(game));
  };

  const changeSpeed = (newSpeedRangeValue) => {
    setCurrentSpeedRange(newSpeedRangeValue);
    setDelay(getDelayFromSpeedRange(newSpeedRangeValue));
  }

  const goToGeneration = (generationNumber) => {
    setIsRunning(false);
    setGame(forceToGeneration(game, Math.max(generationNumber, 0)));
  }

  const loadPattern = (patternData) => {
    setGame(initGameFromPattern(patternData, 40, 100));
  }

  useEffect(() => {
    if (isRunning) {
      const timeoutId = setTimeout(advanceOneGeneration, delay);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  });

  return (
    <div id="main">
      <div id="sidebar">
        {/* <div>
          Seed: {game.seed}
        </div> */}
        <br />
        <div>
          Generation: {game.generation}
        </div>
        <br />
        <div>
          Speed: <input type="range" min="0" max={maxSpeedRange} value={currentSpeedRange} onChange={e => changeSpeed(e.target.value)} />
        </div>
        <br />
        <div>
          <input type="button" onClick={() => setIsRunning(!isRunning) } value={(isRunning ? "Pause" : "Resume")} />
        </div>
        <br />
        <div>
          <input type="button" onClick={advanceOneGeneration} disabled={isRunning} value="Advance 1 Generation" />
        </div>
        <br />
        <div>
          <input type="button" onClick={() => goToGeneration(game.generation - 10) } value="Rewind 10 Generations" />
        </div>
        <div>
          <input type="button" onClick={() => goToGeneration(game.generation - 100) } value="Rewind 100 Generations" />
        </div>
        <br />
        <div>
          <input type="checkbox" /> Populate Only Center Of Board
        </div>
        <div>
          <input type="checkbox" /> Wraparound Edges
        </div>
        <br />
        <br />
        <br />
        <PatternSelect seed={game.seed} loadPattern={loadPattern} />
      </div>
      <div id="board-container">
        <Board board={game.board} />
      </div>
    </div>
  );
}

export default App;
