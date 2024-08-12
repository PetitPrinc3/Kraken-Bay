import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    mediaId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ mediaId }) => {
    const { mutate: mutateFavorites } = useFavorites();
    const { data: currentUser, mutate } = useCurrentUser();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || "";

        return list.includes(mediaId);
    }, [currentUser, mediaId])

    const toggleFavorites = useCallback(async () => {
        let response;

        if (isFavorite) {
            response = await axios.delete('/api/favorites', { data: { mediaId } });
        } else {
            response = await axios.post('/api/favorites', { mediaId });
        }

        const updatedFavoriteIds = response?.data?.favoriteIds;

        mutate({
            ...currentUser,
            favoriteIds: updatedFavoriteIds
        })

        mutateFavorites();
    }, [mediaId, isFavorite, currentUser, mutate, mutateFavorites]);

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus

    return (
        <div onClick={toggleFavorites} className={`${isFavorite ? "bg-white" : "hover:border-neutral-300"} cursor-pointer group-item w-10 h-10 border-white border-2 rounded-full flex justify-center items-center transition flex-none`}>
            <Icon className={`${isFavorite ? "text-zinc-800" : "text-white"}`} size={25} />
        </div>
    )
}

export default FavoriteButton;