import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SiVlcmediaplayer } from "react-icons/si";
import { useEffect } from "react";
import { RiQuestionLine } from "react-icons/ri";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/home",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export default function Index() {

    const router = useRouter()
    useEffect(() => { document.title = "Kraken Bay" }, [])

    return (
        <div className="flex flex-col bg-black w-full h-full">
            <div className="flex flex-row w-full justify-end">
                <div className="mr-4 mt-4 transition duration-300 underline text-white hover:text-red-600 cursor-pointer" onClick={() => router.push("/home")}>Web</div>
            </div>
            <div className="w-full flex flex-col items-center my-10">
                <p className="text-white text-3xl font-extrabold">Welcome !</p>
                <img className="max-w-[90vw] max-h-[50vh] m-10" src="/Assets/Images/default_profile.png" alt="" />
                <p className="text-white text-center max-w-[80vw] md:max-w-[50vw]">Welcome to Kraken Bay, this is a personal video streaming service.</p>
                <div className="flex flex-row items-center gap-2 md:gap-4">
                    <div onClick={() => router.push("/tutorial")} className="text-white md:w-44 flex flex-row items-center gap-2 p-2 bg-red-500 hover:opacity-80 rounded-md mt-6 cursor-pointer transition duration-300">
                        <RiQuestionLine size={25} />
                        <p className="hidden md:block font-semibold">Learn more</p>
                    </div>
                    <a href="/Assets/Apk/vlc.exe" className="md:flex hidden w-44 flex-row gap-2 items-center px-4 py-2 mt-6 cursor-pointer rounded-md bg-orange-500 hover:opacity-80 transition duration-300">
                        <SiVlcmediaplayer className="text-white mr-2" size={20} />
                        <p className="text-white font-semibold">Download VLC</p>
                    </a>
                    <a href="/Assets/Apk/vlc.apk" className="flex md:hidden flex-row gap-2 items-center px-4 py-2 mt-6 cursor-pointer rounded-md bg-orange-500 hover:opacity-80 transition duration-300">
                        <SiVlcmediaplayer className="text-white mr-2" size={15} />
                        <p className="text-white font-semibold">Download</p>
                    </a>
                </div>
                <div>

                </div>
            </div>

        </div>
    )
}