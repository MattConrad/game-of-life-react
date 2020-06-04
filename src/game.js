export const initGame = (pattern, rows, columns, wraparound) => {
    return { pattern, rows, columns, wraparound,
        generation: 0,
        board: initBoard(pattern, rows, columns)
    }
}

export const alterWraparound = (game, wraparound) => {
    return { ...game, wraparound };
}

const initBoard = (pattern, rows, columns) => {
    const isRect = pattern.every(row => row.length === pattern[0].length);
    if (!isRect) throw new Error ('Pattern array must be rectangular.');

    const patRows = pattern.length;
    const patCols = pattern[0].length;
    if (patRows > rows || patCols > columns) throw new Error('Pattern must be smaller in width and height than board.');

    const patRowStartIndex = Math.floor((rows - patRows) / 2);
    const patColStartIndex = Math.floor((columns - patCols) / 2);

    // we use .map() here to avoid multiple refs to the same array https://stackoverflow.com/questions/18163234/declare-an-empty-two-dimensional-array-in-javascript
    const board = Array(rows).fill(false).map(() => new Array(columns).fill(false));

    for(let i = 0; i < pattern.length; i++) {
        for(let j = 0; j < pattern[0].length; j++) {
            board[patRowStartIndex + i][patColStartIndex + j] = pattern[i][j];
        }
    }

    return board;
}

const getAliveNeighborCount = (board, selfRowIndex, selfColIndex, wraparound) => {
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

const nextCellAlive = (board, isCellAlive, selfRowIndex, selfColIndex, wraparound) => {
    const aliveNeighborCount = getAliveNeighborCount(board, selfRowIndex, selfColIndex, wraparound);

    // see https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    return (aliveNeighborCount === 3 || (isCellAlive && aliveNeighborCount === 2));
};

export const nextGeneration = (game) => {
    return { ...game, generation: game.generation + 1, board: nextBoard(game.board, game.wraparound) };
}

export const forceToGeneration = (game, targetGeneration) => {
    let newBoard = initBoard(game.pattern, game.rows, game.columns);    
    for(let i = 0; i < targetGeneration; i++) {
        newBoard = nextBoard(newBoard, game.wraparound);
    }

    return { ...game, generation: targetGeneration, board: newBoard };
};

export const nextBoard = (board, wraparound) => {
    return board.map((row, rowIndex) => {
        return row.map((isCellAlive, colIndex) => {
            return nextCellAlive(board, isCellAlive, rowIndex, colIndex, wraparound);
        });
    });
};

