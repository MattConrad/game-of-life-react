import React, { useState } from 'react';
import { patternsPromise } from '../patternData';


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

const PatternSelect = ({seed, loadPattern}) => {
    const [patterns, setPatterns] = useState();

    const calculatePattern = (patternName) => {
        // for now, we can be clever and compute the fillfactor from the pattern name.
        const percentString = patternName.replace(/\D/g,'');
        const fillFactorDecimal = parseFloat(percentString) / 100.0;

        const nextRand = mulberry32(seed);

        // for now, random patterns are always a 10x10 square.
        const pattern = [];
        for(let i = 0; i < 10; i++) {
            const row = [];
            for(let j = 0; j < 10; j++) {
                const isAlive = nextRand() < fillFactorDecimal;
    
                row.push(isAlive);
            }
            pattern.push(row);
        }
    
        return pattern;
    };

    patternsPromise.then(pats => setPatterns(pats));

    const changePattern = (patternName) => {
        if (patternName[0] === '(') {
            loadPattern(calculatePattern(patternName));
        } else {
            loadPattern(patterns[patternName]);
        }
    }

    const conditionalRender = () => {
        if (patterns) {
            return (<div>
                Pattern: &nbsp; <select onChange={(event) => changePattern(event.target.value)}>
                    <option></option>
                    {Object.keys(patterns).map(p => <option key={p}>{p}</option>)}
                </select>
            </div>);
        } else {
            return <div>loading . . .</div>;
        }
    };
    
    return conditionalRender();
};

export default PatternSelect;
