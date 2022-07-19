import axios from 'axios'
import { useEffect, useState } from 'react'

function useFetch(url) {
    //Only returns data and states you might want to use when you make the API call. Does not return any JSX
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);

        axios.get(url).then((response) => {
            setData(response.data);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [url]);

    const refetch = () => {
        setLoading(true);

        axios.get(url).then((response) => {
            setData(response.data);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    return {data, loading, error, refetch};
}

export default useFetch