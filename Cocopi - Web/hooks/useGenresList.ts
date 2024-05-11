import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useGenresList = () => {
    const { data, error, isLoading } = useSWR("/api/genresList", fetcher, {
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

export default useGenresList;