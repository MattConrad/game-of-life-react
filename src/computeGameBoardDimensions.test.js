import computeGameBoardDimensions from './computeGameBoardDimensions';

it('runs without crashing', () => {
    computeGameBoardDimensions(null, 100, 100);
});

it('gives expected dimensions at 10px (400/800)', () => {
    const { rows, columns } = computeGameBoardDimensions('10px', 400, 800);
    expect(rows).toEqual(36);
    expect(columns).toEqual(130);
});

it('gives expected dimensions at 18px (400/800)', () => {
    const { rows, columns } = computeGameBoardDimensions('18px', 400, 800);
    expect(rows).toEqual(20);
    expect(columns).toEqual(72);
});
