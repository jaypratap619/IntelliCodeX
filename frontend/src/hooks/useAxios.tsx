import axios, { type AxiosRequestConfig } from "axios";
import { useState } from "react";

export default function useAxios(config: AxiosRequestConfig) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [responseData, setResponseData] = useState<any | null>(null);
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string>('');
    async function callApi(newConfig?: AxiosRequestConfig) {
        try {
            const finalConfig = {
                ...config,
                ...newConfig,
                baseURL: API_BASE_URL
            }
            const response = await axios(finalConfig)
            setResponseData(response.data)
        }
        catch (err) {
            console.log(err)
            setError(`Error fetching data from get call to ${config.url}`);
        }
        finally {
            setLoading(false)
        }
    }

    return { responseData, loading, error, callApi }
}