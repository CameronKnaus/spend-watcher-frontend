import React from 'react';
import axios from 'axios';

export default function useFetch(url, fireImmediately = false) {
    const [response, setResponse] = React.useState(null);
    const [loading, setLoading] = React.useState(fireImmediately);
    const [error, setError] = React.useState(false);
    const [canFire, setCanFire] = React.useState(fireImmediately);

    React.useEffect(() => {
        if(!canFire) {
            return;
        }

        const source = axios.CancelToken.source();
        setLoading(true);
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

    }, [canFire, url]);

    return {
        response,
        loading,
        error,
        fire: () => { setCanFire(true) }
    };
}
