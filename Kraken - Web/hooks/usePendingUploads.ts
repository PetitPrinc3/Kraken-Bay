import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePendingUploads = (q?: any) => {
    const { data, error, isLoading, mutate } = useSWR(["/api/pendingUploads", q], ([url, query]) => fetcher(url, query), {
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

export default usePendingUploads;