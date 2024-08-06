import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useLatest = () => {
    const { data, error, isLoading } = useSWR("/api/latest", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return {
        data,
        error,
        isLoading
    }
}

export default useLatest;