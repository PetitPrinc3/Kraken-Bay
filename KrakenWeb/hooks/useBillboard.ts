import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const useBillboard = (mediaType?: string) => {
    const { data, error, isLoading } = useSWR(['/api/random', mediaType], ([url, mediaType]) => fetcher(url, { mediaType: mediaType || undefined }), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data,
        error,
        isLoading
    }
}

export default useBillboard;