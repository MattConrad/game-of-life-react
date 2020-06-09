// i got this from https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element.
import { useState, useEffect } from 'react';

export const useRefSize = myRef => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
        const getDimensions = () => ({
            width: myRef.current.offsetWidth,
            height: myRef.current.offsetHeight
        });

        const handleResize = () => {
            setDimensions(getDimensions());
        }

        if (myRef.current) {
            setDimensions(getDimensions());
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [myRef]);
  
    return dimensions;
};
