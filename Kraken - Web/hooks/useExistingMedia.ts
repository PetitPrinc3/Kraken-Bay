import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useExistingMedia = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR("/api/existingMedia", fetcher, {
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

export default useExistingMedia;