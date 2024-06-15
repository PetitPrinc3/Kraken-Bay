import React, { useState } from "react";
import useMedia from "@/hooks/useMedia";
import { BiCopy } from "react-icons/bi";

interface CopyButtonProps {
    data: Record<string, any>;
}

const CopyButton: React.FC<CopyButtonProps> = ({ data }) => {
    const [toast, setToast] = useState(false)
    const [clicked, setClicked] = useState(false)

    const handleCopy = async () => {
        setClicked(true)
        navigator.clipboard.writeText(`smb://kraken.local${data?.videoUrl}`)
        setToast(true)
        await new Promise(f => setTimeout(f, 2000));
        setToast(false)
    }

    return (
        <div onClick={handleCopy} className={`relative cursor-pointer group-item right-0 w-10 h-10 transition-all ${clicked ? "text-neutral-700 bg-white" : "text-white border-white hover:border-neutral-300"} transition-all duration-500 border-2 rounded-full flex justify-center items-center`}>
            <div>
                <BiCopy className="w-fit" size={20} />
            </div>
            <div className={`absolute ${toast ? "opacity-100" : "opacity-0"} flex flex-col items-center w-fit top-10 transition-all duration-500`}>
                <div className="w-4 border-b-neutral-700 border-b-8 border-r-transparent border-r-8 border-l-transparent border-l-8"></div>
                <div className="h-8 flex flex-row items-center w-14 bg-neutral-700 rounded-md border-neutral-700 border-2 p-2">
                    <p className="text-white text-xs">Copied</p>
                </div>
            </div>
        </div>
    )
}

export default CopyButton;