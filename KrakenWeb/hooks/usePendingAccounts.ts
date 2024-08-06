import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { isUndefined } from "lodash";

const usePendingAccounts = (q?: any) => {
    const { data, error, isLoading, mutate } = useSWR(["/api/pendingAccounts", q], ([url, query]) => fetcher(url, query), {
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