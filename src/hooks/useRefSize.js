// i got this from https://stackoverflow.com/questions/43817118/how-to-get-the-width-of-a-react-element.
import { useState, useEffect } from 'react';

export const useRefSize = elementRef => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
        const getDimensions = () => ({
            width: elementRef.current.offsetWidth,
            height: elementRef.current.offsetHeight
        });

        const handleResize = () => {
            setDimensions(getDimensions());
        }

        if (elementRef.current) {
            setDimensions(getDimensions());
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [elementRef]);
  
    return dimensions;
};
