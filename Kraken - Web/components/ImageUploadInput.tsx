import React, { useRef, useState, useEffect } from "react"
import { RxCross2 } from "react-icons/rx";
import { CiImageOn } from "react-icons/ci";
import { UploadPropsInterface } from "@/hooks/useUploadProps";
import axios from "axios";
interface ImageInputProps {
    name: string
    uploadProps: UploadPropsInterface
}

const ImageUploadInput: React.FC<ImageInputProps> = ({
    name,
    uploadProps,
}) => {
    const thumbRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState(undefined)

    const imageClick = () => {
        if (thumbRef.current) thumbRef.current.click();
    }

    const imageChange = async (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            const imageFile = event.target.files[0]
            if (name == "Thumbnail") uploadProps.setThumb(imageFile.name)
            if (name == "Poster") uploadProps.setPoster(imageFile.name)
            setImage(imageFile)
            const formData = new FormData();
            formData.append(name, imageFile);
            const uploadRequest = axios.post(`/api/uploader/image/${uploadProps.id}`, formData).catch((err) => console.log(err))
        }
    }


    const removeImage = () => {
        if (thumbRef.current) thumbRef.current.value = ""
        if (name == "Thumbnail") uploadProps.setThumb()
        if (name == "Poster") uploadProps.setPoster()
        setImage(undefined)
    }

    return (
        <div className="flex flex-row items-center w-full">
            <div className={`${!image ? "hidden" : "flex flex-row gapp-4 items-center w-full rounded-md bg-neutral-600 border-r-2 border-r-green-500 md:pr-4"}`} onClick={removeImage}>
                <img className="rounded-md h-14 max-w-[80%] mr-auto cursor-default" src="/Assets/Images/default_profile.png" alt="" />
                <p className="hidden sm:inline-block md:hidden ml-4 mr-0 text-neutral-800 truncate text-ellipsis">{image?.name}</p>
                <div className="cursor-pointer flex flex-col items-center mr-2 lg:mr-0 ml-auto text-gray-400 font-extrabold">
                    <RxCross2 size={25} />
                </div>
            </div>
            <div className={`${image ? "hidden" : "relative w-full cursor-pointer"}`}>
                <input id="poster-file" type="file" onChange={(e: any) => { imageChange(e) }} ref={thumbRef} className="hidden" />
                <label onClick={imageClick} htmlFor="dropzone-file" className="flex flex-row items-center justify-center h-14 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-neutral-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-neutral-600 transition duration-300">
                    <div className="flex flex-row items-center gap-1 pt-5 pb-6">
                        <div className="flex flex-col items-center text-gray-500 font-semibold">
                            <CiImageOn size={25} />
                        </div>
                        <p className="block w-full text-center text-sm text-gray-500 dark:text-gray-400 font-semibold">{name}</p>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default ImageUploadInput;