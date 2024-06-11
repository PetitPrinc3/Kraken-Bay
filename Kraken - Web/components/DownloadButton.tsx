import { MdFileDownload } from "react-icons/md";
import React, { useState } from "react";
import useMedia from "@/hooks/useMedia";

interface DownloadButtonProps {
    mediaId: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ mediaId }) => {
    const { data = {} } = useMedia({ mediaID: mediaId });
    const [currentDownload, setDownload] = useState(false)

    const Download = async () => {
        setDownload((currentDownload) => !currentDownload)
        await new Promise(f => setTimeout(f, 1000));
        setDownload((currentDownload) => !currentDownload)
    };

    return (
        <a href={currentDownload ? data?.videoUrl : "false"} download={data?.title} onClick={Download} className={`${currentDownload ? "bg-white transform scale-150" : ""} cursor-pointer group-item w-10 h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300`}>
            <MdFileDownload className={`${currentDownload ? "text-zinc-800" : "text-white"}`} size={25} />
        </a>
    )
}

export default DownloadButton;