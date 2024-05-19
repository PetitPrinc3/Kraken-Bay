import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useUserUploads = () => {
    const { data, error, isLoading } = useSWR("/api/userUploads", fetcher, {
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

export default useUserUploads;