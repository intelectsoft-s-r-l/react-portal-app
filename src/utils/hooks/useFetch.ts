import { useEffect, useState } from "react";
import { EnErrorCode } from "../../api";

export type UseFetch<T> = {
  loading: boolean;
  data?: T;
};

const useFetch = (httpService: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(undefined);
  const request = () => {
    return httpService
      .then((data: any) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          setData(data);
          return data;
        }
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    request();
  }, []);
  return { loading, data, request, setData };
};
export default useFetch;
