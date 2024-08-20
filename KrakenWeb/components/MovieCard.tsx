import React from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { BsChevronDown } from "react-icons/bs";
import FavoriteButton from "./FavoriteButton";
import { useRouter } from "next/router";
import useInfoModal from "@/hooks/useInfoModal";
import DownloadButton from "./DownloadButton";
import CopyButton from "./CopyButton";
import { AiOutlineInfoCircle } from "react-icons/ai"
interface MovieCardProps {
    data: Record<string, any>;
}

const MovieCard: React.FC<MovieCardProps> = ({
    data
}) => {

    const router = useRouter();
    const { openModal } = useInfoModal();

    const uploadDate = new Date(data?.createdAt)
    const todayDate = new Date()
    const isNew: boolean = (todayDate.getFullYear() - uploadDate.getFullYear()) * 12 + (todayDate.getMonth() - uploadDate.getMonth()) < 2

    return (
        <div className="group bg-transparent col-span relative h-[30vw] md:h-[12vw]">
            <div className="w-full h-full md:h-[12vw] flex flex-col items-center p-0 m-0 cursor-pointer object-cover transition duration delay-300 shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0">
                <img className="hidden md:block rounded-md w-full h-full" src={data.posterUrl} alt="Thumbnail" />
                <div className="relative w-full h-full flex md:hidden flex-col rounded-lg object-fill">
                    <div className="w-full h-full rounded-lg">
                        <img onClick={() => openModal(data?.id)} className="w-full h-full rounded-md border-2 border-neutral-800" src={data.thumbUrl} alt="Thumbnail" />
                    </div>
                </div>
                <p className="hidden lg:block absolute bottom-5 left-5 text-white text-xl font-bold max-h-[10vw] overflow-hidden">
                    {data.title}
                </p>
            </div>

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
                    onClick={() => openModal(data?.id)}
                    className="
                cursor-pointer
                object-cover
                transition
                duration
                shadow-xl
                rounded-t-md
                w-full
                h-[12vw]"
                    src={data.posterUrl} alt="Thumbnail" />
                <div
                    className="
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
                    <div className="flex-row items-center gap-3 hidden sm:flex pointer-events-auto">
                        <div
                            className={`cursor-pointer w-10 h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300 flex-none`}
                            onClick={() => { router.push(`/watch/${data?.id}`) }}>
                            <BsFillPlayFill size={30} />
                        </div>
                        <FavoriteButton mediaId={data?.id} />
                        <div className={`${data?.type == "Movies" ? "visible" : "hidden"} hidden lg:block`}>
                            <DownloadButton data={data} />
                        </div>
                        <div className="hidden lg:block">
                            <CopyButton data={data} />
                        </div>
                        <div onClick={() => openModal(data?.id)} className="cursor-pointer ml-auto group/item w-10 h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300 flex-none">
                            <BsChevronDown size={20} className="text-white group-hover/item:text-neutral-300 w-4 font-bold" />
                        </div>
                    </div>
                    <p className="text-white font-semibold mt-4">
                        <span className="inline-block text-green-400 font-semibold text-lg">{isNew ? "New" : ""}</span> {isNew ? "-" : ""} {data?.title}
                    </p>
                    <div className="flex flex-row mt-4 gap-2 items-center">
                        <p className="text-white text-[10px] lg:text-sm">{(data?.type == "Movies") ? data.duration : (data?.seasons.split(",")).length > 1 ? `${(data?.seasons.split(",")).length} Seasons` : `${(data?.seasons.split(",")).length} Season`}</p>
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