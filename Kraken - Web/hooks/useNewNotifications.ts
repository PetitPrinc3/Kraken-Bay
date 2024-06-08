import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useNewNotifications = () => {
    const { data, error, isLoading, mutate } = useSWR("/api/newNotifications", fetcher, {
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

export default useNewNotifications;