import React from 'react';
import { FORM_FACTOR_UPPER_BOUNDS } from '../Constants/FormFactorMapping';


// Globally accessible context that contains the method that adds notifications to the queue
const isXSContext = React.createContext(() => { /* Noop */ });
const isSMContext = React.createContext(() => { /* Noop */ });
const isMDContext = React.createContext(() => { /* Noop */ });

// Custom hook to get an object containing all supported form factors and their boolean values
// usage will look something like this ->   const isXS = useFormFactor().XS
export function useFormFactor() {
    return {
        XS: React.useContext(isXSContext),
        SM: React.useContext(isSMContext),
        MD: React.useContext(isMDContext)
    };
}

const checkIfXS = () => window.innerWidth < FORM_FACTOR_UPPER_BOUNDS.XS;
const checkIfSM = () => window.innerWidth < FORM_FACTOR_UPPER_BOUNDS.SM;
const checkIfMD = () => window.innerWidth < FORM_FACTOR_UPPER_BOUNDS.MD;

export default function FormFactorContext({ children }) {
    const [isXS, setIsXS] = React.useState(checkIfXS());
    const [isSM, setIsSM] = React.useState(checkIfSM());
    const [isMD, setIsMD] = React.useState(checkIfMD());

    // Window resize event listener
    React.useEffect(() => {
        // Handler for resize event
        const resizeHandler = () => {
            setIsXS(checkIfXS());
            setIsSM(checkIfSM());
            setIsMD(checkIfMD());
        };

        window.addEventListener('resize', resizeHandler);

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return (
        <isXSContext.Provider value={isXS}>
            <isSMContext.Provider value={isSM}>
                <isMDContext.Provider value={isMD}>
                    {children}
                </isMDContext.Provider>
            </isSMContext.Provider>
        </isXSContext.Provider>
    );
}