import React from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/router";
import useInfoModal from "@/hooks/useInfoModal";
import DownloadButton from "./DownloadButton";

interface MovieCardProps {
    data: Record<string, any>;
}

const MovieCard: React.FC<MovieCardProps> = ({
    data
}) => {

    const router = useRouter();
    const { openModal } = useInfoModal();

    return (
        <div className="group bg-zinc-900 col-span relative h-[12vw]">
            <img
                className="
            cursor-pointer
            object-cover
            transition
            duration
            shadow-xl
            rounded-md
            group-hover:opacity-90
            sm:group-hover:opacity-0
            delay-300
            w-full
            h-[12vw]
            "
                src={data.thumbUrl} alt="Thumbnail" />

            <div className="
            opacity-0
            absolute
            top-0
            transition
            duration-200
            z-10
            invisible
            sm:visible
            delay-300
            w-full
            scale-0
            group-hover:scale-110
            group-hover:-translate-y-[6vw]
            group-hover:opacity-100
            ">
                <img
                    className="
                cursor-pointer
                object-cover
                transition
                duration
                shadow-xl
                rounded-t-md
                w-full
                h-[12vw]"
                    src={data.thumbUrl} alt="Thumbnail" />
                <div className="
                z-10
                bg-zinc-800
                p-2
                lg:p-4
                absolute
                w-full
                transition
                shadow-md
                rounded-b-md
                ">
                    <div className="flex flex-row items-center gap-3">
                        <div
                            className={`${data?.type == "Movies" ? "visible" : "hidden"} cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300`}
                            onClick={() => { router.push(`/watch/${data?.id}`) }}>
                            <BsFillPlayFill size={30} />
                        </div>
                        <FavoriteButton movieId={data?.id} />
                        <div className={`${data?.type == "Movies" ? "visible" : "hidden"}`}>
                            <DownloadButton movieId={data?.id} />
                        </div>
                        <div onClick={() => openModal(data?.id)} className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
                            <BsChevronDown size={20} className="text-white group-hover/item:text-neutral-300 w-4 font-bold" />
                        </div>
                    </div>
                    <p className="text-white font-semibold mt-4">
                        {data?.title}
                    </p>
                    <div className="flex flex-row mt-4 gap-2 items-center">
                        <p className="text-white text-[10px] lg:text-sm">{(data?.type == "Movies") ? data.duration : data.seasonCount + " Seasons"}</p>
                    </div>
                    <div className="flex flex-row mt-4 gap-2 items-center">
                        <p className="text-white text-[10px] lg:text-sm">Genres : {data.genre}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MovieCard;