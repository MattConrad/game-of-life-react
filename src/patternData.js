import data from './patternData.txt';
// patterns.txt is pieces taken from http://www.radicaleye.com/lifepage/glossary.html

// the use of ./patternData.txt in this way doesn't work neatly in a testing context, yielding HTTP Error 401.2 - Unauthorized
// so, testing is difficult. decided to set testing of this feature aside.

// resulting promise returns an object with the pattern name as the key and a rectangular array of cells as the value.
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
    });

    return patterns;
};

export const patternsPromise = parsePatternsPromise();
