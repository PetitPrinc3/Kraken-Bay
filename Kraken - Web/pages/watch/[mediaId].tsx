import React, { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"
import { MdFileDownload } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdReplay10, MdOutlineForward10, MdInfoOutline } from "react-icons/md";
import { IoVolumeMute, IoVolumeLow, IoVolumeMedium, IoVolumeHigh } from "react-icons/io5";
import { GoScreenFull } from "react-icons/go";
import { SiVlcmediaplayer } from "react-icons/si";
import { useRouter } from "next/router";
import useMedia from "@/hooks/useMedia";
import screenfull from 'screenfull';
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { BiCopy } from "react-icons/bi";
import { isUndefined } from "lodash";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const Player = () => {
    const router = useRouter();
    const [volume, setVolume] = useState(0.8)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setMuted] = useState(false)
    const [seek, setSeek] = useState(0)
    const [idleTime, setIdleTime] = useState(0)
    const [opacity, setOpacity] = useState(100)
    const [timeDisp, setTimeDisp] = useState<string>()
    const playerRef = useRef<ReactPlayer>(null)
    const screenRef = useRef<any>()
    const { mediaId } = router.query;
    const { data } = useMedia({ mediaId: mediaId as string });
    const [clicked, setClicked] = useState(false)

    const handleCopy = async () => {
        setClicked(true)
        navigator.clipboard.writeText(`http://kraken.local${data?.videoUrl}`)
        await new Promise(f => setTimeout(f, 2000));
        setClicked(false)
    }

    const PlayIcon = isPlaying ? FaPlay : FaPause
    const VolumeIcon = isMuted ? IoVolumeMute : volume == 0 ? IoVolumeMute : volume <= 0.4 ? IoVolumeLow : volume <= 0.7 ? IoVolumeMedium : IoVolumeHigh

    const fastForward = () => {
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 10)
    }
    const fastBackward = () => {
        playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 10)
    }

    const toggleFull = () => {
        screenfull.toggle(screenRef.current)
    }

    const seekProgress = (e: any) => {
        const progress = e.target.valueAsNumber
        setSeek(progress)
        console.log(progress)
        playerRef.current?.seekTo(playerRef.current.getDuration() * progress)
    }

    const updateDisp = (played: number) => {
        const duration = playerRef.current?.getDuration() || 0
        const remaining = duration - played
        setTimeDisp(new Date(remaining * 1000).toISOString().slice(11, 19))
    }

    const handleIdle = () => {
        setIdleTime(0)
        setOpacity(100)
    }

    if (isUndefined(data)) return null

    return (
        <div onMouseMove={handleIdle} className={`w-full h-full overflow-hidden bg-black ${opacity == 0 ? "cursor-none" : "cursor-auto"}`}>
            <div ref={screenRef}>
                <ReactPlayer
                    ref={playerRef}
                    url={data?.videoUrl}
                    muted={isMuted}
                    playing={!isPlaying}
                    volume={volume}
                    height={"100vh"}
                    width={"100%"}
                    onProgress={(state) => {
                        setSeek(state.played)
                        updateDisp(state.playedSeconds)
                        if (idleTime > 3) {
                            setOpacity(0)
                        } else {
                            setIdleTime(idleTime + 1)
                        }
                    }}
                />
                <div onClick={() => setIsPlaying(!isPlaying)} className="absolute z-10 w-full h-full left-0 top-0"></div>
                <div className={`absolute top-0 lef-0 w-full h-full flex flex-col justify-between z-20 transition-all duration-500 bg-gradient-to-t from-zinc-900 from-2% to-transparent to-70% opacity-${opacity}`}>
                    <div className="w-full flex flex-row items-center justify-between top-0 pt-8 pb-4 px-10">
                        <div className="text-3xl flex flex-row items-center gap-4">
                            <AiOutlineArrowLeft onClick={() => router.back()} className="text-white cursor-pointer hover:opacity-70 hover:scale-110 transition-all duration-300" size={40} />
                            <p className="text-white test-1xl md:hidden font-bold">
                                <span className="font-light">You are watching : </span>
                                {data?.title}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <a href={data?.videoUrl} download={data?.title} className="flex flex-row gap-2 items-center font-semibold text-lg text-white transition-all duration-500 pt-4 hover:py-2 px-4 rounded-md hover:bg-bottom bg-gradient-to-t from-red-600 from-50% to-transparent to-50% bg-[length:100%_200%]">
                                <MdFileDownload size={20} />
                                <p>Download</p>
                            </a>
                        </div>
                    </div>
                    <div className="md:hidden w-full flex flex-row gap-10 items-center justify-center py-4 px-16 text-white">
                        <div className="transition-all duration-500 hover:text-red-600 cursor-pointer opacity-70 hover:opacity-100">
                            <MdReplay10 size={40} />
                        </div>
                        <div className="transition-all duration-500 hover:text-red-600 cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                            <PlayIcon size={50} />
                        </div>
                        <div className="transition-all duration-500 hover:text-red-600 cursor-pointer opacity-70 hover:opacity-100">
                            <MdOutlineForward10 size={40} />
                        </div>
                    </div>
                    <div className="w-full h-full hidden md:block" onClick={() => setIsPlaying(!isPlaying)}>

                    </div>
                    <div className="relative z-40 flex flex-col gap-2 pt-4 pb-8 text-white">
                        <div className="px-16 w-full grid grid-cols-[95%_5%] gap-4">
                            <div className="group relative w-full mb-2">
                                <div className="absolute bottom-8 rounded-md w-18 h-fit bg-neutral-700 bg-opacity-80 py-1 px-2 opacity-0 transition-all duration-200 group-active:opacity-100" style={{ left: `${(seek * 100).toFixed()}%`, transform: "translate(-50%)" }}>
                                    {playerRef.current && (new Date(playerRef.current.getDuration() * seek * 1000).toISOString().slice(11, 19))}
                                </div>
                                <input className="w-full h-1 bg-neutral-600 accent-red-600 transition-all duration-1000 rounded-lg cursor-pointer"
                                    type="range" min={0} max={1} step={0.0001} value={seek}
                                    onChange={seekProgress}
                                />
                            </div>
                            <div className="h-full w-full flex flex-row items-center">
                                <p className="text-xs m-auto md:text-base">{timeDisp}</p>
                            </div>
                        </div>
                        <div className="px-20 w-full md:grid md:grid-cols-[30%_40%_30%] items-center justify-between">
                            <div className="flex flex-row items-center gap-4 cursor-pointer">
                                <div onClick={() => setIsPlaying(!isPlaying)} className="hidden md:block hover:opacity-70 transition-all duration-300">
                                    <PlayIcon size={25} />
                                </div>
                                <div onClick={fastBackward} className="hidden md:block hover:opacity-70 transition-all duration-300">
                                    <MdReplay10 size={30} />
                                </div>
                                <div onClick={fastForward} className="hidden md:block hover:opacity-70 transition-all duration-300">
                                    <MdOutlineForward10 size={30} />
                                </div>
                                <div className="group hidden md:flex flex-row items-center gap-4 cursor-pointer">
                                    <VolumeIcon onClick={() => {
                                        if (!isMuted) {
                                            setMuted(true)
                                        } else {
                                            setMuted(false)
                                            if (volume == 0) {
                                                setVolume(0.1)
                                            }
                                        }
                                    }} size={30} />
                                    <div className="scale-x-0 -translate-x-20 transition-all duration-300 group-hover:scale-x-100 group-hover:translate-x-0">
                                        <input className="accent-red-600 outline-none w-40 hover:accent-red-600" type="range" min={0} max={1} step={0.02} value={volume} onChange={(e) => {
                                            const newVolume = e.target.valueAsNumber
                                            if (isMuted && newVolume > volume) setMuted(false)
                                            if (!isMuted && newVolume == 0) setMuted(true)
                                            setVolume(newVolume)
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <div className="text-white hidden md:flex flex-row items-center gap-2 justify-center overflow-hidden">
                                <p className="truncate text-ellipsis">{data?.title}</p>
                            </div>
                            <div className="flex flex-row items-center w-full gap-4 justify-between md:justify-end">
                                <div onClick={() => router.push(`/vlc/${mediaId}`)} className="w-[30%] md:w-auto flex flex-col items-center cursor-pointer hover:text-orange-500 transition-all duration-500">
                                    <SiVlcmediaplayer size={25} />
                                </div>
                                <div>
                                    <div onClick={handleCopy} className="relative cursor-pointer group-item right-0 w-10 h-10 transition-all text-white hover:border-neutral-300 duration-500 flex justify-center items-center">
                                        <BiCopy className="w-fit" size={25} />
                                    </div>
                                </div>
                                <a href={data?.videoUrl} download={data?.title} className="w-[30%] md:w-auto flex flex-col items-center md:hidden">
                                    <MdFileDownload size={30} />
                                </a>
                                <div onClick={toggleFull} className="w-[30%] md:w-auto flex flex-col items-center cursor-pointer hover:opacity-70 transition-all duration-300">
                                    <GoScreenFull size={30} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Player