import { useRouter } from "next/router";
import React from "react";
import { GoPlusCircle } from "react-icons/go";

const UploadItem = () => {

    const router = useRouter();

    return (
        <div onClick={() => { router.push("/upload") }} className="flex flex-row gap-1 items-center text-white cursor-pointer hover:text-gray-300 transition">
            <GoPlusCircle size={15} />
            Upload
        </div>
    )
}

export default UploadItem