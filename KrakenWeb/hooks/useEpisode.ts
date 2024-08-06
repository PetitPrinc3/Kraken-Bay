import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useEpisode = (params?: any) => {
    const { data, error, isLoading, mutate } = useSWR(["/api/episode", params], ([url, params]) => fetcher(url, params), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useEpisode;