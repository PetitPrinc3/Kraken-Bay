import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const usePendingAccounts = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR("/api/pendingAccounts", fetcher, {
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

export default usePendingAccounts;