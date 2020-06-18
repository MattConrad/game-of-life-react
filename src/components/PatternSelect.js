import React, { useState, useEffect } from 'react';
import { patternsPromise } from '../patternData';

const PatternSelect = ({setGameIsRunning, reloadGame}) => {
    const [patterns, setPatterns] = useState();

    // load patterns from patternsPromise on first render only.
    useEffect(() => {
        patternsPromise.then(loadedPatterns => { 
            setPatterns(loadedPatterns);
        });
    }, []);

    // patterns should only change once (when first initialized). when this happens, trigger the change event using the first pattern in the patterns object.
    useEffect(() => {
        if (!patterns) return;

        // firstPatternName should also be the name of the first (default) value in the <select> widget. 
        const firstPatternName = Object.keys(patterns)[0];
        changePattern(firstPatternName);

        // react wants to warn us about the "changePattern" function as an undeclared dependency. 
        // but as long as we are properly check "patterns" we do not need to worry about "changePattern". 
        // i wish we could turn off the warning for only this one dependency, and check all others, but this doesn't appear to be possible. so, silencing all.
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setGameIsRunning(false);
        
        if (patternName[0] === '(') {
            reloadGame(calculatePattern(patternName));
        } else {
            reloadGame(patterns[patternName]);
        }
    }

    const conditionalRender = () => {
        if (patterns) {
            return (<div>
                Pattern: <select onChange={(event) => changePattern(event.target.value)}>
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
