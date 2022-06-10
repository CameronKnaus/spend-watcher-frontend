import React from 'react';
import axios from 'axios';

export default function useFetch(url, fireImmediately = false, fireSilently = false) {
    const [response, setResponse] = React.useState(null);
    const [loading, setLoading] = React.useState(fireImmediately && !fireSilently);
    const [error, setError] = React.useState(false);
    const [canFire, setCanFire] = React.useState(fireImmediately);
    const [silentMode, setSilentMode] = React.useState(fireSilently);

    React.useEffect(() => {
        if(!canFire) {
            return;
        }

        const source = axios.CancelToken.source();
        !silentMode && setLoading(true);
        axios.get(url, { cancelToken: source.token })
            .then(response => {
                setResponse(response);
                setError(null);
            })
            .catch((error) => {
                setResponse(null);
                setError(error);
            })
            .finally(() => {
                setLoading(false);
                setCanFire(false);
            });

    }, [silentMode, canFire, url]);

    // Calling the fire method silently means the loading flag will not be set.  This ensures the
    function fire(fireSilently) {
        if(fireSilently) {
            setSilentMode(true);
        }

        setCanFire(true);
    }

    return React.useMemo(() => ({
        response,
        loading,
        error,
        fire
    }), [response, loading, error]);
}
