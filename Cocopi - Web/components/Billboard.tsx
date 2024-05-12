import React, { useCallback, useEffect, useState } from "react";
import useBillboard from "@/hooks/useBillboard"
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { GoMute, GoUnmute } from "react-icons/go";
import PlayButton from "./PlayButton";
import useInfoModal from "@/hooks/useInfoModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import axios from "axios";
import { isUndefined } from "lodash";

const Billboard = () => {
    const { data } = useBillboard();
    const { openModal } = useInfoModal();
    const { data: user } = useCurrentUser();
    const [isMuted, setMuted] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)

    const handleOpenModal = useCallback(() => {
        openModal(data?.id);
    }, [openModal, data?.id])

    useEffect(() => {
        if (firstLoad && !isUndefined(user)) {
            setMuted(isMuted => user?.isMuted)
            setFirstLoad(firstLoad => false)
            console.log('firs', isMuted)
        }
    }, [setMuted, isMuted, user, firstLoad, setFirstLoad])

    if (isUndefined(user)) {
        return null
    }

    const muteVideo = async () => {
        await axios.get("/api/muteUser", { params: { userId: user.id, muteValue: !isMuted } })
        setMuted(isMuted => !isMuted)
        console.log(isMuted)
    }

    const Icon = isMuted ? GoMute : GoUnmute

    return (
        <div className="relative h-[56.25vw] max-h-[90vh] overflow-hidden">
            <video
                className="
                    w-full
                    h-[56.25vw]
                    object-cover
                    brightness-[60%]
                "
                autoPlay
                loop
                poster={data?.posterUrl}
                src={data?.videoUrl}
                muted={isMuted ? true : false}
            >
            </video>
            <div className="absolute top-[30%] md:top-[20%] ml-4 md:ml-16 w-[100%]">
                <div className="flex flex-row items-center w-full">
                    <div className="flex flex-col ml-0 mr-auto w-[50%]">
                        <p className="text-white text-1xl md:text-5xl h-full w-full lg:text-6xl font-bold drop-shadow-xl">{data?.title}</p>
                        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-full md:w-full lg:w-full max-h-[30vh] drop-shadow-xl line-clamp-6 text-ellipsis">
                            {data?.description}
                        </p>
                        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
                            <PlayButton movieId={data?.id} />
                            <button onClick={handleOpenModal} className="bg-white text-white bg-opacity-30 rounded-md py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
                                <AiOutlineInfoCircle className="mr-1" />
                                More Info
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block m-auto w-[50%]">
                        <a className="flex flex-col items-center " href={`/watch/${data?.id}`}>
                            <img className="h-[55vh] rounded-xl transition duration-300 brightness-110 cursor-pointer hover:brightness-[115%]" src={data?.thumbUrl} alt="" />
                        </a>
                    </div>
                </div>
            </div>
            <div onClick={muteVideo} className={`absolute bottom-10 right-10 rounded-full p-2 border-2 border-white cursor-pointer ${isMuted ? "bg-white text-zinc-800" : "text-white"}`}>
                <Icon size={25} />
            </div>
        </div>
    )
}

export default Billboard;