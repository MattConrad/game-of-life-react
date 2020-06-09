import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { initGame, nextGeneration, forceToGeneration, alterWraparound } from './game';
import { maxSpeedRange, initialDelay, initialSpeedRangeValue, getDelayFromSpeedRange } from './speed';
import Board from './components/Board';
import PatternSelect from './components/PatternSelect';
import { useRefSize } from './hooks/useRefSize';

function App() {
  const [currentSpeedRange, setCurrentSpeedRange] = useState(initialSpeedRangeValue);
  const [game, setGame] = useState();
  const [delay, setDelay] = useState(initialDelay);
  const [isRunning, setIsRunning] = useState(false);
  const [wraparound, setWraparound] = useState(true);

  const boardRef = useRef();
  const { width: boardWidth, height: boardHeight } = useRefSize(boardRef);

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
    console.log({ boardWidth, boardHeight });
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
        <div id="sidebar-group-1">
          <PatternSelect setGameIsRunning={setIsRunning} reloadGame={reloadGame} />
          <br />
          <div>
            <input type="checkbox" onChange={changeWraparound} checked={wraparound} /> Wraparound Edges
          </div>
          <br />
          <div>
            <input type="button" onClick={() => setIsRunning(!isRunning) } value={(isRunning ? "Stop" : "Start")} />
          </div>
          <br />
          <br />
        </div>
        <div id="sidebar-group-2">
          <div>
            Generation: {game ? game.generation : 0}
          </div>
          <br />
          <div>
            <label htmlFor="speed-slider">Speed &nbsp;</label>
            <input id="speed-slider" type="range" min="0" max={maxSpeedRange} value={currentSpeedRange} onChange={e => changeSpeed(e.target.value)} />
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
          <br />
        </div>
      </div>
      <div id="board-container">
        <Board boardRef={boardRef} board={game ? game.board : []} />
      </div>
    </div>
  );
}

export default App;
