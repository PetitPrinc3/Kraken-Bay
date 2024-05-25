import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useMedia = (id?: string) => {
    const { data, error, isLoading } = useSWR(id ? `/api/media/${id}` : null, fetcher, {
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

export default useMedia;