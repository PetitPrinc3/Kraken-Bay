import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useServerProps = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/serverProps", fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useServerProps;