import Axios from "axios";
import { useEffect, useState } from "react";

const useHttpRequest = ({ url, method, data = null, config = null }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                Axios[method](url, JSON.parse(config), JSON.parse(data))
                    .then((res) => {
                        setResponse(res.data);
                    })
                    .catch((e) => {
                        console.log(e);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, [method, url, data, config]);
    return { response, error, isLoading };
};
export default useHttpRequest;
