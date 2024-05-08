import React from "react";
import { GoMute, GoUnmute } from "react-icons/go";
import { useRouter } from "next/router";

interface MuteButtonProps {
    movieId: string;
}

const MuteButton: React.FC<MuteButtonProps> = ({ movieId }) => {
    const router = useRouter();

    const Icon = isMuted ? GoMute : GoUnmute


    return (
        <button onClick={() => router.push(`/watch/${movieId}`)} className="bg-white rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
            <Icon size={25} className="mr-1" />
        </button>
    )
}

export default MuteButton