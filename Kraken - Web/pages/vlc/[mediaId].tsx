import React, { useState } from "react";
import useMedia from "@/hooks/useMedia";
import { useRouter } from "next/router";
import { BiCopy } from "react-icons/bi";
import { SiVlcmediaplayer } from "react-icons/si";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import copy from "@/lib/copy";

const Vlc = () => {
    const router = useRouter();
    const { mediaId } = router.query;
    const { data } = useMedia({ mediaId: mediaId as string });
    const [toast, setToast] = useState(false)

    const handleCopy = async () => {
        await copy(`smb://kraken.local${data?.videoUrl}`)
        setToast(true)
        await new Promise(f => setTimeout(f, 2000));
        setToast(false)
    }

    return (
        <div className="">
            <Navbar />
            <div className="w-full h-full flex flex-col items-center py-10 md:py-20">
                <div className="text-white text-2xl  md:text-3xl flex flex-row items-center gap-4 font-semibold my-10">
                    <SiVlcmediaplayer className="hidden md:block text-orange-500" size={25} />
                    Start streaming with VLC !
                </div>
                <div className="flex max-w-[95%] md:max-w-[90%] h-16 bg-neutral-600 border-2 border-neutral-400 flex-row items-center gap-2 rounded-md px-4 py-2">
                    <p className="max-w-[95%] overflow-hidden truncate text-ellipsis text-white text-light opacity-80">Your link : <a href={`smb://kraken.local${data?.videoUrl}`} className="text-white text-base underline cursor-pointer">smb://kraken.local{data?.videoUrl}</a></p>
                    <div onClick={handleCopy} className="relative w-[5%] flex flex-col items-center cursor-pointer text-white">
                        <div className="hover:opacity-70 transition-all duration-500">
                            <BiCopy className="w-fit" size={25} />
                        </div>
                        <div className={`absolute ${toast ? "opacity-100" : "opacity-0"} flex flex-col items-center w-fit top-8 transition-all duration-500`}>
                            <div className="w-4 border-b-neutral-700 border-b-8 border-r-transparent border-r-8 border-l-transparent border-l-8"></div>
                            <div className="h-8 flex flex-row items-center w-14 bg-neutral-700 rounded-md border-neutral-700 border-2 p-2">
                                <p className="text-white text-xs">Copied</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full items-start mt-10 px-4 md:px-16">
                    <div className=" w-full flex flex-row items-center justify-between">
                        <p className="text-xl font-semibold underline text-white">Tutorial :</p>
                        <a href="/Assets/Vlc/vlc.exe" className="hidden md:flex flex-row gap-2 items-center px-4 py-2 my-6 cursor-pointer rounded-md bg-orange-500 hover:opacity-80 transition duration-300">
                            <SiVlcmediaplayer className="text-white mr-2" size={15} />
                            <p className="text-white font-semibold">Download</p>
                        </a>
                        <a href="/Assets/Vlc/vlc.apk" className="flex md:hidden flex-row gap-1 items-center px-2 py-2 my-6 cursor-pointer rounded-md text-sm bg-orange-500 hover:opacity-80 transition duration-300">
                            <SiVlcmediaplayer className="text-white mr-2" size={15} />
                            <p className="text-white font-semibold">Download</p>
                        </a>
                    </div>
                    <div className="hidden lg:grid w-full grid-cols-5 gap-4 mt-5">
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 1 : Copy link</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep1.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Copy the link above.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 2 : Open VLC</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep2.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Open the &quot;Media&quot; tab.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 3 : Open a stream</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep3.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Open a network stream.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 4 : Paste & Play</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep4.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Paste the link and hit play.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 5 : Enjoy !</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep5.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">With full audio & subtitles.</p>
                        </div>
                    </div>
                    <div className="grid lg:hidden w-full grid-flow-row gap-4 mt-5">
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 1 : Copy link</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamStep1.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Copy the link above.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 2 : Open VLC app.</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamMobStep2.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Open the &quot;More&quot; tab and hit &quot;New Stream&quot;.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 3 : Paste</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamMobStep3.png" alt="" />
                            <p className="h-5 text-xs text-white text-light">Paste the provided link.</p>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-4 py-2 px-4 rounded-md shadow-black shadow-lg hover:translate-x-1 hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <p className="h-8 underline text-white">Step 4 : Enjoy</p>
                            <img className="w-full lg:w-auto lg:h-32" src="/Assets/Images/Tutorial/StreamMobStep4.png" alt="" />
                            <p className="h-5 text-xs text-white text-light"> Hit the paper plane & enjoy !</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Vlc;