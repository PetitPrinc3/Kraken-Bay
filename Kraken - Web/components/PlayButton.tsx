import React from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { useRouter } from "next/router";

interface PlayButtonProps {
    movieId: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ movieId }) => {
    const router = useRouter();

    return (
        <button onClick={() => router.push(`/watch/${movieId}`)} className="bg-white rounded-md py-2 px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
            <BsFillPlayFill size={25} className="mr-1" />
            <p className="md:mr-2">Play</p>
        </button>
    )
}

export default PlayButton