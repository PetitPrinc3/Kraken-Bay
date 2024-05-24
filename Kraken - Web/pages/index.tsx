import { useRouter } from "next/router";
import { SiVlcmediaplayer } from "react-icons/si";
import { useEffect } from "react";

export default function Index() {

    const router = useRouter()
    useEffect(() => { document.title = "Kraken Bay" }, [])

    return (
        <div className="flex flex-col bg-black w-full h-full">
            <div className="flex flex-row w-full justify-end">
                <div className="mr-4 mt-4 transition duration-300 underline text-white hover:text-red-600" onClick={() => router.push("/home")}>Web</div>
            </div>
            <div className="w-full flex flex-col items-center my-10">
                <p className="text-white text-3xl font-extrabold">Welcome !</p>
                <img className="max-w-[90vw] max-h-[50vh] m-10" src="/Assets/Images/default_profile.png" alt="" />
                <p className="text-white max-w-[50vw]">Welcome to Kraken Bay, this is a personal video streaming service.</p>
                <a href="/Assets/Apk/vlc.apk" className="flex md:hidden flex-row gap-2 items-center px-4 py-2 my-6 cursor-pointer rounded-md bg-orange-500 hover:opacity-80 transition duration-300">
                    <SiVlcmediaplayer className="text-white mr-2" size={15} />
                    <p className="text-white font-semibold">Download</p>
                </a>
                <div>

                </div>
            </div>

        </div>
    )
}