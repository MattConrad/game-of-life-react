import React, { useState } from 'react';
import { patternsPromise } from '../patternData';

const PatternSelect = ({loadPattern}) => {
    const [patterns, setPatterns] = useState();

    patternsPromise.then(pats => setPatterns(pats));

    const changePattern = (patternName) => {
        loadPattern(patterns[patternName]);
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
