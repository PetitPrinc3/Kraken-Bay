import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePending = (id?: string) => {
    const { data, error, isLoading } = useSWR(id ? `/api/uploader/watch/${id}` : null, fetcher, {
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

export default usePending;