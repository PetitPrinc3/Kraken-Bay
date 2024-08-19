import { useRouter } from "next/router";
import React from "react";
import { GoPlusCircle } from "react-icons/go";

const UploadItem = () => {

    const router = useRouter();

    return (
        <div onClick={() => { router.push("/upload") }} className="hidden md:flex flex-row gap-1 items-center text-white cursor-pointer hover:text-gray-300 transition">
            <GoPlusCircle className="text-xl md:text-lg" />
            <p className="hidden md:block">Upload</p>
        </div>
    )
}

export default UploadItem