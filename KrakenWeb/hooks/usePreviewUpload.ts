import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePendingUploads = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR(`/api/pendingUploads/preview/${id}`, fetcher, {
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