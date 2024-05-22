import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useMediaCount = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/count', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useMediaCount;