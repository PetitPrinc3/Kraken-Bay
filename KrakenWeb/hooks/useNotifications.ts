import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useNotifications = (params?: any) => {
    const { data, error, isLoading, mutate } = useSWR(["/api/notifications", params], ([url, params]) => fetcher(url, params), {
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

export default useNotifications;