import useSwr from 'swr';
import fetcher from '@/lib/fetcher';

const useMovieList = (type?: string) => {
    const { data, error, isLoading } = useSwr(type ? `api/moviesList/${type}` : "api/moviesList/Any", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data, error, isLoading
    }
};

export default useMovieList;