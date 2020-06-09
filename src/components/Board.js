import React from 'react';

const Board = ({boardRef, board}) => {
    return <div ref={boardRef} id="board">
        {board.map((row, rowIndex) => {
            return <div key={rowIndex}>{row.reduce((acc, col) => {
                return acc + (col ? '\u25CF' : '\u00A0');
                }, '')}
            </div>
        })}
    </div>;
};


export default Board;
