import React from 'react';

const Board = ({boardRef, board}) => {
    return <div ref={boardRef} id="board">
        {board.map((row, rowIndex) => {
            return row.reduce((acc, col) => {
                return acc + (col ? '\u25CF' : ' ');
                }, '') + '\n';
        })}
    </div>;
};


export default Board;
