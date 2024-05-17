import React from "react";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import { AiOutlineArrowLeft } from "react-icons/ai";
import useCurrentUser from "@/hooks/useCurrentUser";
import usePending from "@/hooks/usePending";
import { isUndefined } from "lodash";

const Watch = () => {

    const router = useRouter();
    const { movieId } = router.query;
    const { data } = usePending(movieId as string);
    if (isUndefined(data)) return null

    return (
        <div className="h-screen w-screen bg-black">
            <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-70">

                <AiOutlineArrowLeft onClick={() => router.push('/admin')} className="text-white cursor-pointer" size={40} />
                <p className="text-white test-1xl md:text-3xl font-bold">
                    <span className="font-light">You are watching : </span>
                    {data?.title}
                </p>
            </nav>
            <div className="h-full w-full">
                <ReactPlayer
                    width={"100vw"}
                    height={"100vh"}
                    autoPlay={true}
                    controls
                    url={"/Assets/PendingUploads/" + movieId + "/" + data?.videoUrl} />
            </div>

        </div>


    )
}

export default Watch;