import React from 'react';
import axios from 'axios';

// Typescript conversion for this is rough as it will soon be deprecated
export default function useFetch(url: string, fireImmediately = false, fireSilently = false) {
    const [response, setResponse] = React.useState<null | Record<any, any>>(null);
    const [loading, setLoading] = React.useState(fireImmediately && !fireSilently);
    const [silentLoadingStatus, setSilentLoadingStatus] = React.useState(fireImmediately && !fireSilently);
    const [error, setError] = React.useState<Error | null>(null);
    const [canFire, setCanFire] = React.useState(fireImmediately);
    const [silentMode, setSilentMode] = React.useState(fireSilently);

    React.useEffect(() => {
        if(!canFire) {
            return;
        }

        const source = axios.CancelToken.source();
        !silentMode && setLoading(true);
        setSilentLoadingStatus(true);
        axios.get(url, { cancelToken: source.token })
            .then(serviceResponse => {
                // @ts-expect-error
                if(!serviceResponse && !serviceResponse.data) {
                    setError(new Error(`Invalid response form provided - ${url}`));
                }

                setResponse(serviceResponse.data);
                setError(null);
            })
            .catch((error) => {
                setResponse(null);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
                setSilentLoadingStatus(false);
                setCanFire(false);
            });

    }, [silentMode, canFire, url]);

    // Calling the fire method silently means the loading flag will not be set.
    // Use this when you want to load something without triggering loading UI
    function fire(fireSilently = false) {
        if(fireSilently) {
            setSilentMode(true);
        }

        setCanFire(true);
    }

    return React.useMemo(() => ({
        response,
        loading,
        silentLoadingStatus,
        error,
        fire
    }), [response, loading, error, silentLoadingStatus]);
}
