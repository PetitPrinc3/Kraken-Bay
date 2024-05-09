import useSwr from 'swr';
import fetcher from '@/lib/fetcher';

const useEpisodeList = (seasonId?: string) => {
    const { data, error, isLoading } = useSwr(seasonId ? `api/episodeList/${seasonId}` : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        data, error, isLoading
    }
};

export default useEpisodeList;