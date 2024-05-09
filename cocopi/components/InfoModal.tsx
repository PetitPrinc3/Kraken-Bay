import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import PlayButton from "./PlayButton";
import FavoriteButton from "./FavoriteButton";
import DownloadButton from "./DownloadButton";
import useInfoModal from "@/hooks/useInfoModal";
import useMovie from "@/hooks/useMovie";
import SeasonList from "./SeasonList";

interface InfoModalProps {
    visible?: boolean;
    onClose: any;
};


const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
    const [isVisible, setIsVisible] = useState(!!visible);
    const { movieId } = useInfoModal();
    const { data = {} } = useMovie(movieId);

    useEffect(() => {
        setIsVisible(!!visible);
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

    return (
        <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-scroll fixed inset-0 py-5">
            <div className="relative w-auto max-w-3xl rounded-md overflow-hidden mt-auto">
                <div className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md`}>
                    <div className="relative h-auto min-h-96 mt-10">
                        <video className="w-full brightness-[60%] object-cover h-full" autoPlay muted loop src={data?.videoUrl} poster={data?.thumbUrl}></video>
                        <div className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center" onClick={() => { handleClose() }}>
                            <AiOutlineClose className="text-white" size={20} />
                        </div>
                        <div className="absolute bottom-[10%] left-10">
                            <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-8">
                                {data?.title}
                            </p>
                            <div className="flex flex-row gap-4 items-center">
                                <div className={`${data?.type == "Movies" ? "visible" : "hidden"}`}>
                                    <PlayButton movieId={data.id} />
                                </div>
                                <div>
                                    <FavoriteButton movieId={data.id} />
                                </div>
                                <div className={`${data?.type == "Movies" ? "visible" : "hidden"}`}>
                                    <DownloadButton movieId={data.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-12 py-8">
                        <p className="text-green-400 font-semibold text-lg">
                            New
                        </p>
                        <p className="text-white text-s">
                            {data?.duration ? data?.duration : data?.seasonCount + " Seasons"}
                        </p>
                        <p className="text-white text-s">
                            Genres : {data?.genre}
                        </p>
                        <p className="text-white text-lg my-4">
                            {data?.description}
                        </p>
                    </div>
                    <div className={`${(data?.type == "Series") ? "visible" : "hidden"} relative px-12 py-8 mb-10 rounded-md`}>
                        <SeasonList serieId={data?.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoModal;