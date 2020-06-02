import data from './patternData.txt';
// patterns.txt is pieces taken from http://www.radicaleye.com/lifepage/glossary.html

// resulting promise returns an array of objects with { name, cells } properties. name is the pattern name, cells are an array of t/f just like the gameboard.
const parsePatternsPromise = async () => {
    const dataString = await fetch(data).then(response => response.text());
    
    const blocks = dataString.split('\r\n\r\n');

    const patterns = {};

    blocks.forEach(block => {
        const lines = block.split('\r\n');
        const name = lines[0];
        const cells = lines.slice(1).map(line => 
            line.split('').map(c => c === '*')
        );

        patterns[name] = cells;
        // patterns.push({ name, cells });
    });

    return patterns;
};

export const patternsPromise = parsePatternsPromise();
