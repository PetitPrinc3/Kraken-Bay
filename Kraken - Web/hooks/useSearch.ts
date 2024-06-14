import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useSearch = (text?: string) => {
    const { data, error, isLoading } = useSWR(text ? `/api/search/${text}` : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
    })

    return {
        data,
        error,
        isLoading
    }
}

export default useSearch;