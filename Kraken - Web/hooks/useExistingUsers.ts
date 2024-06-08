import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useExistingUsers = (id?: string) => {
    const { data, error, isLoading, mutate } = useSWR("/api/existingUsers", fetcher, {
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

export default useExistingUsers;