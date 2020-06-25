import { initGame, nextGeneration } from './game';

it('instantiates as truthy without crashing', () => {
    const game = initGame([[]], 3, 3, false);
    expect(game).toBeTruthy();
});

it('advances the r pentomino pattern 3 times with expected results', () => {
    const game_0 = initGame(R_PENTOMINO_0, 9, 9, false);
    const game_1 = nextGeneration(game_0);
    const game_2 = nextGeneration(game_1);
    const game_3 = nextGeneration(game_2);

    expect(JSON.stringify(game_1.board)).toEqual(JSON.stringify(R_PENTOMINO_1));
    expect(JSON.stringify(game_2.board)).toEqual(JSON.stringify(R_PENTOMINO_2));
    expect(JSON.stringify(game_3.board)).toEqual(JSON.stringify(R_PENTOMINO_3));
});

// all these are based on a 9x9 board.
const R_PENTOMINO_0 = [
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,true,true,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,false,false,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false]
];

const R_PENTOMINO_1 = [
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,true,true,true,false,false,false],
    [false,false,false,true,false,false,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false]
];

const R_PENTOMINO_2 = [
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,true,false,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,true,false,false,true,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false]
];

const R_PENTOMINO_3 = [
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,false,true,true,true,false,false,false],
    [false,false,true,false,false,true,false,false,false],
    [false,false,false,true,true,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false,false]
];
