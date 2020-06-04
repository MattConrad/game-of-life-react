import React, { useState, useEffect } from 'react';
import { patternsPromise } from '../patternData';

const PatternSelect = ({reloadGame}) => {
    const [patterns, setPatterns] = useState();

    // load patterns from patternsPromise on first render only.
    useEffect(() => {
        patternsPromise.then(loadedPatterns => { 
            setPatterns(loadedPatterns);
        });
    }, []);

    // MWCTODO: this is emitting a dependency warning, which you're going to need to study to resolve.
    // patterns should only change once (when first initialized). when this happens, trigger the change event using the first pattern in the patterns object.
    useEffect(() => {
        if (!patterns) return;

        const firstPatternName = Object.keys(patterns)[0];
        changePattern(firstPatternName);
    }, [patterns]);

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
