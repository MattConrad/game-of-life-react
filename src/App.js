import React, { useState, useEffect, useRef } from 'react';
import { initGame, nextGeneration, forceToGeneration, alterWraparound } from './game';
import { maxSpeedRange, initialDelay, initialSpeedRangeValue, getDelayFromSpeedRange } from './speed';
import computeGameBoardDimensions from './computeGameBoardDimensions';
import Board from './components/Board';
import PatternSelect from './components/PatternSelect';
import { useRefSize } from './hooks/useRefSize';
import './App.css';

// initializing a game has a couple of known error scenarios, we'll catch and handle these
// this function needs to be OUTSIDE the component, otherwise there's a cascade of dependency issues coming from useEffect().
const safelyInitializeGame = (pattern, rows, columns, wraparound) => {
  try {
    return initGame(pattern, rows, columns, wraparound);
  } catch (error) {
    alert(error);
    alert('Attempting to restart with an empty board. You may need to choose a different pattern or increase your browser\'s size.');
    return initGame([[]], rows, columns, wraparound);
  }
}

function App() {
  const [currentSpeedRange, setCurrentSpeedRange] = useState(initialSpeedRangeValue);
  const [boardPixelDimensions, setBoardPixelDimensions] = useState({ width: 0, height: 0 });
  const [game, setGame] = useState();
  const [delay, setDelay] = useState(initialDelay);
  const [isRunning, setIsRunning] = useState(false);
  const [wraparound, setWraparound] = useState(true);

  const boardRef = useRef();

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
    const gameSize = computeGameBoardDimensions(boardRef, boardPixelDimensions.width, boardPixelDimensions.height);
    setGame(safelyInitializeGame(patternData, gameSize.rows, gameSize.columns, wraparound));
  }

  const { width: currentBoardPixelWidth, height: currentBoardPixelHeight } = useRefSize(boardRef);

  // timer for game generation advancement: runs every update.
  useEffect(() => {
    if (isRunning) {
      const timeoutId = setTimeout(advanceOneGeneration, delay);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  });

  // reset screen for new dimensions: is supposed to run only when board pixel dimensions change (although React wants, and gets, a more extensive dependency list)
  // this doesn't work perfectly in every browser. 
  // most prominently, there are quirks in firefox when resizing width to a smaller size (but only sometimes!).
  // i don't want to spend a long time on edge-case browser quirks, so some things will remain quirky.
  useEffect(() => {
    if (boardPixelDimensions.width !== currentBoardPixelWidth || boardPixelDimensions.height !== currentBoardPixelHeight) {
      setBoardPixelDimensions({ width: currentBoardPixelWidth, height: currentBoardPixelHeight});
      const newBoardGameSize = computeGameBoardDimensions(boardRef, currentBoardPixelWidth, currentBoardPixelHeight);

      const gamePattern = game ? game.pattern : [[]];

      setGame(safelyInitializeGame(gamePattern, newBoardGameSize.rows, newBoardGameSize.columns, wraparound));
    }
  }, [boardPixelDimensions.width, boardPixelDimensions.height, currentBoardPixelWidth, currentBoardPixelHeight, game, wraparound]);

  return (
    <div id="main">
      <div id="sidebar">
        <div id="sidebar-group-1">
          <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" rel="noopener noreferrer" target="_blank">Conway's Game Of Life</a>
          <br />
          <br />
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
          <div>
            <label htmlFor="speed-slider">Speed &nbsp;</label>
            <input id="speed-slider" type="range" min="0" max={maxSpeedRange} value={currentSpeedRange} onChange={e => changeSpeed(e.target.value)} />
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
            <input type="button" onClick={advanceOneGeneration} disabled={isRunning} value="Advance 1 Generation" />
          </div>
          <br />
          <div>
            <input type="button" onClick={() => goToGeneration(game.generation - 10) } value="Rewind 10 Generations" />
          </div>
          <div>
            <input type="button" onClick={() => goToGeneration(game.generation - 100) } value="Rewind 100 Generations" />
          </div>
          <div>
            <input type="button" onClick={() => goToGeneration(0) } value="Reset to Generation 0" />
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
