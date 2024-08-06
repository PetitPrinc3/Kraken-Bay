import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useServerProps = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/serverProps", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useServerProps;