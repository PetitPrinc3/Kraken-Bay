import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useBestUploaders = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR("/api/bestUploaders", fetcher, {
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

export default useBestUploaders;