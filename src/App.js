import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { initGame, nextGeneration, forceToGeneration, alterWraparound } from './game';
import { maxSpeedRange, initialDelay, initialSpeedRangeValue, getDelayFromSpeedRange } from './speed';
import Board from './components/Board';
import PatternSelect from './components/PatternSelect';

function App() {

  const [currentSpeedRange, setCurrentSpeedRange] = useState(initialSpeedRangeValue);
  const [game, setGame] = useState();
  const [delay, setDelay] = useState(initialDelay);
  const [isRunning, setIsRunning] = useState(false);
  const [wraparound, setWraparound] = useState(true);

  const advanceOneGeneration = () => {
    setGame(nextGeneration(game));
  };

  const changeWraparound = (event) => {
    setWraparound(event.target.checked);
    setGame(alterWraparound(game, event.target.checked));
  }

  const changeSpeed = (newSpeedRangeValue) => {
    setCurrentSpeedRange(newSpeedRangeValue);
    setDelay(getDelayFromSpeedRange(newSpeedRangeValue));
  }

  const goToGeneration = (generationNumber) => {
    setIsRunning(false);
    setGame(forceToGeneration(game, Math.max(generationNumber, 0)));
  }

  const reloadGame = (patternData) => {
    setGame(initGame(patternData, 40, 100, wraparound));
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
        <br />
        <div>
          Generation: {game ? game.generation : 0}
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
          <input type="checkbox" onChange={changeWraparound} checked={wraparound} /> Wraparound Edges
        </div>
        <br />
        <br />
        <br />
        <PatternSelect reloadGame={reloadGame} />
      </div>
      <div id="board-container">
        <Board board={game ? game.board : []} />
      </div>
    </div>
  );
}

export default App;
