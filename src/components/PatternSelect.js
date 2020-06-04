import React, { useState } from 'react';
import { patternsPromise } from '../patternData';

const PatternSelect = ({reloadGame}) => {
    const [patterns, setPatterns] = useState();

    const calculatePattern = (patternName) => {
        // for now, we can be clever and compute the fillfactor from the pattern name.
        const percentString = patternName.replace(/\D/g, '');
        const fillFactorDecimal = parseFloat(percentString) / 100.0;

        // for now, random patterns are always a 10x10 square.
        const pattern = [];
        for(let i = 0; i < 10; i++) {
            const row = [];
            for(let j = 0; j < 10; j++) {
                const isAlive = Math.random() < fillFactorDecimal;
    
                row.push(isAlive);
            }
            pattern.push(row);
        }
    
        return pattern;
    };

    patternsPromise.then(loadedPatterns => { 
        setPatterns(loadedPatterns);

        // const firstPatternName = Object.keys(loadedPatterns)[0];
        // console.log('woops');
        // changePattern(firstPatternName);
    });

    const changePattern = (patternName) => {
        if (patternName[0] === '(') {
            reloadGame(calculatePattern(patternName));
        } else {
            reloadGame(patterns[patternName]);
        }
    }

    const conditionalRender = () => {
        if (patterns) {
            return (<div>
                Pattern: &nbsp; <select onChange={(event) => changePattern(event.target.value)}>
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
