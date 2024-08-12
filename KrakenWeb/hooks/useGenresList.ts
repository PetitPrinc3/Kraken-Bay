import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useGenresList = () => {
    const { data, error, isLoading } = useSWR("/api/genresList", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: true,
        revalidateOnReconnect: true
    })

    return {
        data,
        error,
        isLoading
    }
}

export default useGenresList;