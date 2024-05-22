import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useNotifications = () => {
    const { data, error, isLoading } = useSWR("/api/notifications", fetcher, {
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

export default useNotifications;