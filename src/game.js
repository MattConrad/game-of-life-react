export const initGame = (seed, populateCenterOnly, rows, columns, fillFactorPercent) => {
    return { seed, populateCenterOnly, rows, columns, fillFactorPercent, 
        generation: 0, 
        board: initBoard(seed, populateCenterOnly, rows, columns, fillFactorPercent) 
    };
}

const initBoard = (seed, populateCenterOnly, rows, columns, fillFactorPercent) => {
    const fillFactorDecimal = fillFactorPercent * 1.0 / 100;
    const nextRand = mulberry32(seed);

    // if we're populating only the center of the board, figure out how much. populate either 15% of the h/w, or 10 cells, whichever is bigger (i.e. smallest margin).
    const rowMargin = Math.min(((rows - (rows * 0.20)) / 2), ((rows - 10) / 2));
    const colMargin = Math.min(((columns - (columns * 0.20)) / 2), ((columns - 10) / 2));

    const board = [];
    for(let i = 0; i < rows; i++) {
        const row = [];
        for(let j = 0; j < columns; j++) {

            // if we are populating center only, cells outside the center are never alive.
            if (populateCenterOnly 
                && (
                    (i <= rowMargin || i >= (rows - rowMargin))
                    ||
                    (j <= colMargin || j >= (columns - colMargin))
                )) {

                row.push(false);
                continue;
            } else {
                const isAlive = nextRand() < fillFactorDecimal;

                row.push(isAlive);
            }
        }
        board.push(row);
    }

    return board;
};

const wraparound = true;

const getAliveNeighborCount = (board, selfRowIndex, selfColIndex) => {
    let count = 0;

    for(let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for(let colOffset = -1; colOffset <= 1; colOffset++) {
            
            if (rowOffset === 0 && colOffset === 0) continue;
            
            let ri = selfRowIndex + rowOffset;
            let ci = selfColIndex + colOffset;

            if (wraparound) {
                if (ri < 0) ri = ri + board.length;
                if (ci < 0) ci = ci + board[0].length;

                if (ri > board.length - 1) ri = ri - board.length;
                if (ci > board[0].length - 1) ci = ci - board[0].length;
            } else {
                if (ri < 0 || ri > board.length - 1) continue;
                if (ci < 0 || ci > board[0].length - 1) continue;
            }

            if (board[ri][ci]) count++;
        }
    }

    return count;
};

const nextCellAlive = (board, isCellAlive, selfRowIndex, selfColIndex) => {
    const aliveNeighborCount = getAliveNeighborCount(board, selfRowIndex, selfColIndex);

    // see https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    return (aliveNeighborCount === 3 || (isCellAlive && aliveNeighborCount === 2));
};

export const nextGeneration = (game) => {
    return { ...game, generation: game.generation + 1, board: nextBoard(game.board) };
}

//const initBoard = (seed, populateCenterOnly, rows, columns, fillFactorPercent) => {

export const forceToGeneration = (game, targetGeneration) => {
    let newBoard = initBoard(game.seed, game.populateCenterOnly, game.rows, game.columns, game.fillFactorPercent);    
    for(let i = 0; i <= targetGeneration; i++) {
        newBoard = nextBoard(newBoard);
    }

    return { ...game, generation: targetGeneration, board: newBoard };
};

export const nextBoard = (board) => {
    return board.map((row, rowIndex) => {
        return row.map((isCellAlive, colIndex) => {
            return nextCellAlive(board, isCellAlive, rowIndex, colIndex);
        });
    });
};

/* eslint-disable no-mixed-operators  */

// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
const mulberry32 = (a) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/* eslint-enable no-mixed-operators */
