import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useUsers = (params?: any) => {
    const { data, error, isLoading, mutate } = useSWR(["/api/users/", params], ([url, params]) => fetcher(url, params), {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: true,
    })

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useUsers;