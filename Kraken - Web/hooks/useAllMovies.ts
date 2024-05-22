import useSwr from 'swr';
import fetcher from '@/lib/fetcher';

const useAllMovies = () => {
    const { data, error, isLoading } = useSwr("/api/allMovies", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data, error, isLoading
    }
};

export default useAllMovies;