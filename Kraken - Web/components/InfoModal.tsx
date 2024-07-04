import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import PlayButton from "./PlayButton";
import FavoriteButton from "./FavoriteButton";
import DownloadButton from "./DownloadButton";
import useInfoModal from "@/hooks/useInfoModal";
import useMedia from "@/hooks/useMedia";
import SeasonList from "./SeasonList";
import CopyButton from "./CopyButton";

interface InfoModalProps {
    visible?: boolean;
    onClose: any;
};


const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
    const [isVisible, setIsVisible] = useState(!!visible);
    const { mediaId } = useInfoModal();
    const { data } = useMedia({ mediaId: mediaId });

    useEffect(() => {
        setIsVisible(!!visible);
    }, [visible])

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = '1%'
        } else {
            document.body.style.overflow = 'unset'
            document.body.style.paddingRight = '0'
        }
    }, [visible])

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    if (!visible) {
        return null;
    }

    const uploadDate = new Date(data?.createdAt)
    const todayDate = new Date()
    const isNew: boolean = (todayDate.getFullYear() - uploadDate.getFullYear()) * 12 + (todayDate.getMonth() - uploadDate.getMonth()) < 2

    return (
        <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-scroll fixed inset-0 py-5">
            <div className="fixed h-full w-full" onClick={() => handleClose()} />
            <div className="relative w-auto max-w-[90vw] md:max-w-3xl rounded-md overflow-hidden top-0 bottom-0 my-auto">
                <div className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto rounded-t-md bg-zinc-900 drop-shadow-md rounded-md`}>
                    <div className="my-10">
                        <div className="relative h-[30vh] md:h-96 mt-10">
                            <video className="w-full brightness-[60%] rounded-t-md object-cover h-full" autoPlay muted loop src={data?.videoUrl} poster={data?.posterUrl}></video>
                            <div className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center" onClick={() => { handleClose() }}>
                                <AiOutlineClose className="text-white" size={20} />
                            </div>
                            <div className="absolute bottom-[10%] left-10 w-[90%]">
                                <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-8">
                                    {data?.title}
                                </p>
                                <div className="flex flex-row gap-4 items-center md:w-full">
                                    <div>
                                        <PlayButton mediaId={data.id} />
                                    </div>
                                    <div>
                                        <FavoriteButton mediaId={data.id} />
                                    </div>
                                    <div className={`${data?.type == "Movies" ? "visible" : "hidden"}`}>
                                        <DownloadButton data={data} />
                                    </div>
                                    <div className="md:ml-auto">
                                        <CopyButton data={data} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-12 py-8">
                            <p className="text-green-400 font-semibold text-lg">
                                {isNew ? "New" : ""}
                            </p>
                            <p className="text-white text-s">
                                {data?.type == "Movies" && data?.duration}
                                {data?.type == "Series" && (data?.seasons.split(",")).length + " Seasons"}
                            </p>
                            <p className="text-white text-s">
                                Genres : {data?.genre}
                            </p>
                            <p className="text-white text-sm md:text-lg my-4">
                                {data?.description}
                            </p>
                            {data?.languages != "" && (<p className="text-zinc-400 text-xs mb-2">
                                Languages : {data.languages}
                            </p>)}
                            {data?.subtitles != "" && (<p className="text-zinc-400 text-xs">
                                Subtitles : {data.subtitles}
                            </p>)}
                        </div>
                        {data?.type == "Series" && (
                            <div className="relative px-12 py-8 rounded-md">
                                <SeasonList serieId={data?.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoModal;