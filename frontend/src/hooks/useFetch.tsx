import axios from "axios";
import { useEffect, useState } from "react";


export default function useFetch(url: string) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchdata = async () => {
            try {
                setLoading(true);
                const resposne: any = await axios.get(API_BASE_URL + url);
                setData(resposne.data)
                setLoading(false);
            }
            catch (err) {
                setError(`Error fetching data from get call to ${url}`);
                console.log('Error : ', err);
                setLoading(false);
            }
        }
        fetchdata();
    }, [url])
    return { data, loading, error }
}
