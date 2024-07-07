import React, { useCallback, useEffect, useState } from "react";
import useBillboard from "@/hooks/useBillboard"
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { GoMute, GoUnmute } from "react-icons/go";
import PlayButton from "./PlayButton";
import useInfoModal from "@/hooks/useInfoModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import axios from "axios";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { BsFillPlayFill } from "react-icons/bs";

interface BillboardProps {
    mediaType?: string
}

const Billboard: React.FC<BillboardProps> = ({ mediaType }) => {
    const { data } = useBillboard(mediaType);
    const { openModal } = useInfoModal();
    const { data: user } = useCurrentUser();
    const [isMuted, setMuted] = useState(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const router = useRouter()

    const handleOpenModal = useCallback(() => {
        openModal(data?.id);
    }, [openModal, data?.id])

    useEffect(() => {
        if (firstLoad && !isUndefined(user)) {
            setMuted(isMuted => user?.isMuted)
            setFirstLoad(firstLoad => false)
        }
    }, [setMuted, isMuted, user, firstLoad, setFirstLoad])

    if (isUndefined(user) || isUndefined(data)) {
        return (
            <div className="block relative w-full h-[75vh] md:h-[90vh] z-0 animate-pulse" />
        )
    }

    const muteVideo = async () => {
        await axios.post('/api/muteUser', { data: (!isMuted).toString() });
        setMuted(isMuted => !isMuted)
    }

    const Icon = isMuted ? GoMute : GoUnmute

    return (
        <>
            <div className="hidden md:block relative max-h-[90vh] z-0">
                <div className="relative max-h-[110vh] overflow-hidden">
                    <video
                        className="
                        w-full
                        h-[56.25vw]
                        object-cover
                        brightness-[60%]
                        "
                        autoPlay={window.screen.width > 768}
                        loop
                        poster={data?.posterUrl}
                        src={data?.videoUrl}
                        muted={isMuted ? true : false}
                    >
                    </video>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-zinc-900 from-7% to-transparent to-25%" />
                </div>
                <div className="absolute top-[30%] md:top-[20%] px-4 md:px-16 w-[100%]">
                    <div className="flex flex-row items-center w-full">
                        <div className="flex flex-col ml-0 mr-auto w-full">
                            <p className="text-white text-1xl md:text-5xl h-full w-full lg:text-6xl font-bold drop-shadow-xl">{data?.title}</p>
                            <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 max-w-full lg:max-w-[50vw] lg:max-h-[10vw] drop-shadow-xl line-clamp-4 overflow-ellipsis">
                                {data?.description}
                            </p>
                            <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
                                <PlayButton mediaId={data?.id} />
                                <button onClick={handleOpenModal} className="bg-white text-white bg-opacity-30 rounded-md py-2 px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
                                    <AiOutlineInfoCircle className="mr-1" size={25} />
                                    <p>More Info</p>
                                </button>
                            </div>
                        </div>
                        <div className="hidden lg:block m-auto w-[50%]">
                            <a className="flex flex-col items-center " onClick={() => { router.push(`/watch/${data?.id}`) }}>
                                <img className="h-[55vh] rounded-xl transition duration-300 brightness-110 cursor-pointer hover:brightness-[115%]" src={data?.thumbUrl} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
                <div onClick={muteVideo} className={`absolute bottom-4 right-10 rounded-full p-2 border-2 border-white cursor-pointer ${isMuted ? "bg-white text-zinc-800" : "text-white"}`}>
                    <Icon size={25} />
                </div>
            </div>
            <div className="relative md:hidden flex flex-col items-center h-[75vh]">
                <div style={{ "backgroundImage": `url('${data?.posterUrl}')` }} className="absolute left-0 top-0 z-0 w-full h-full overflow-hidden bg-cover bg-no-repeat bg-center blur-xl" />
                <div className="absolute left-auto top-20 z-10 w-[90vw] h-[60vh] flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute left-0 top-0 z-0 w-full h-full overflow-hidden bg-cover bg-no-repeat bg-center bg-gradient-to-t from-neutral-700 from-5% to-transparent to-45% rounded-md" />
                        <img src={data?.thumbUrl} className="h-[60vh] w-[90vw] max-h-[60vh] max-w-[90vw] rounded-md  border-2 border-neutral-600 border-opacity-30 shadow-xl shadow-neutral-800" alt="" />
                        <div className="absolute bottom-0 left-0 w-full px-4 py-4 flex flex-col gap-2 items-center">
                            <p className="w-full text-center text-white text-sm font-semibold">{data?.genre.split(", ").slice(0, 3).join(" • ")}</p>
                            <div className="w-full grid grid-cols-2 gap-4">
                                <button onClick={() => router.push(`/watch/${data?.mediaId}`)} className="bg-white rounded-md py-1 px-4 w-full font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
                                    <BsFillPlayFill size={20} className="mr-1 ml-auto" />
                                    <p className="mr-auto">Play</p>
                                </button>
                                <button onClick={handleOpenModal} className="left-0 ml-auto bg-white text-white bg-opacity-30 rounded-md py-1 px-4 w-full font-semibold flex flex-row items-center hover:bg-opacity-20 transition">
                                    <AiOutlineInfoCircle className="mr-1 ml-auto" size={20} />
                                    <p className="mr-auto">Info</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Billboard;