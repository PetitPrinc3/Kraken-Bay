import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePendingUploads = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR(id ? `/api/pendingUploads/${id}` : "/api/pendingUploads", fetcher, {
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