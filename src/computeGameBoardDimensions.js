// usually the precisely calculated width is correct, but sometimes we get line wrap of one character. better to have a narrower effective width than get this wrap.
const BOARD_WIDTH_FUDGE_FACTOR = 0.98;

// in a more perfect world, we'd actually measure the width + height of a single "board" character rather than hardcoding.
// in this world, the game board is either font-size: 18px or font-size: 10px. we switch between these with media queries.
// we don'really want to duplicate the media query logic here. instead, we inspect to see which font-size we're using, 
// and then pick between two hardcoded options to convert pixels to cell dimensions. yes, an admittedly imperfect world.

const computeGameBoardDimensions = (boardRefX, boardPixelWidth, boardPixelHeight) => {
    const fontSize = window.getComputedStyle(boardRefX.current).getPropertyValue('font-size');

    let rows, columns;

    if (fontSize === '10px') {
      rows = Math.floor(boardPixelHeight / 11);
      columns = Math.floor(boardPixelWidth * BOARD_WIDTH_FUDGE_FACTOR / 6);
    } else {
      rows = Math.floor(boardPixelHeight / 20);
      columns = Math.floor(boardPixelWidth * BOARD_WIDTH_FUDGE_FACTOR / 10.8);
    }

    return { rows, columns };
}

export default computeGameBoardDimensions;
