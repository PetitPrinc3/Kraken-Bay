import React, { useRef, useState } from "react"
import { RxCross2 } from "react-icons/rx";
import { CiImageOn } from "react-icons/ci";
import { uploadData } from "@/lib/uploadData"

interface ImageInputProps {
    name: string
}

const ImageUploadInput: React.FC<ImageInputProps> = ({
    name
}) => {
    const thumbRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState(null)


    const imageClick = () => {
        if (thumbRef.current) thumbRef.current.click();
    }

    const imageChange = async (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage((image) => event.target.files[0])
            uploadData.setImage(name, event.target.files[0])
        }
    }

    const removeImage = () => {
        setImage(image => null)
        if (thumbRef.current) thumbRef.current.value = ""
        uploadData.setImage(name)
    }

    return (
        <div className="hidden md:flex flex-row items-center w-[10%] mx-auto">
            <div className={`${!image ? "hidden" : "hidden md:flex flex-row items-center gap-4 rounded-md bg-neutral-600 border-r-2 border-r-green-500"}`} onClick={removeImage}>
                <img className="rounded-md h-14 cursor-pointer md:cursor-default" src="/Assets/Images/default_profile.png" alt="" />
                <div className="cursor-pointer hidden md:flex flex-col items-center ml-0 mr-2 text-gray-500 font-semibold">
                    <RxCross2 size={20} />
                </div>
            </div>
            <div className={`${image ? "hidden" : "relative w-full cursor-pointer"}`}>
                <input id="poster-file" type="file" onChange={(e: any) => { imageChange(e) }} ref={thumbRef} className="hidden" />
                <label onClick={imageClick} htmlFor="dropzone-file" className="flex flex-row items-center justify-center h-14 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-neutral-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-neutral-600 transition duration-300">
                    <div className="flex flex-row items-center gap-1 pt-5 pb-6">
                        <p className="hidden md:block w-full text-center text-sm text-gray-500 dark:text-gray-400 font-semibold">Choose {name}</p>
                        <div className="flex md:hidden flex-col items-center text-gray-500 font-semibold">
                            <CiImageOn size={25} />
                        </div>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default ImageUploadInput;