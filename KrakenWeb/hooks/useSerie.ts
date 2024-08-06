import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useSerie = (id?: string) => {
    const { data, error, isLoading } = useSWR(id ? `/api/seriesList/${id}` : null, fetcher, {
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

export default useSerie;