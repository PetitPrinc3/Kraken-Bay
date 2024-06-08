import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useStatistics = () => {
    const { data, error, isLoading } = useSWR("/api/statistics", fetcher, {
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

export default useStatistics;