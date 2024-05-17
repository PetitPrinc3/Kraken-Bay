import React, { useRef, useState } from "react";
import axios from "axios";
import { isUndefined } from "lodash";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import VideoUpload from "@/components/VideoUpload";
import Input from "@/components/Input";
import ImageUploadInput from "@/components/ImageUploadInput";
import GenreModal from "@/components/GenreModal";

import useUploadModal from "@/hooks/useUploadProps";
import useCurrentUser from "@/hooks/useCurrentUser";

import { toast, ToastContainer, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import { IoSend } from "react-icons/io5";

async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const ToastProps: ToastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
}


const Uploader = () => {
    const uploadProps = useUploadModal()
    const { data: user } = useCurrentUser();
    const [reset, setReset] = useState(false)

    const handleUpload = async () => {
        console.log(uploadProps)
        const loading = toast.loading("Uploading your file...", ToastProps)
        uploadProps.setUserId(user?.id)
        uploadProps.setUserName(user?.email)
        console.log(uploadProps)
        if (isUndefined(uploadProps.video)) {
            toast.update(loading, { render: "Please choose a video file before uploading.", type: "error", isLoading: false, autoClose: 2000 })
            return null
        }
        if (isUndefined(uploadProps.title)) {
            toast.update(loading, { render: "Please choose a title for your file.", type: "error", isLoading: false, autoClose: 2000 })
            return null
        }
        if (isUndefined(uploadProps.description)) {
            toast.update(loading, { render: "Please write a small descritpion for your file.", type: "error", isLoading: false, autoClose: 2000 })
            return null
        }
        if (isUndefined(uploadProps.genres)) {
            toast.update(loading, { render: "Select at least one genre for your file.", type: "error", isLoading: false, autoClose: 2000 })
        }
        await uploadProps.videoRequest?.catch((err) => {
            console.log(err);
            toast.update(loading, { render: "Oops, something went terribly wrong...", type: "error", isLoading: false, autoClose: 2000 })
            return null
        }).then((data) => {
            data
        })

        await axios.post("/api/uploader", { uploadProps }).catch((err) => {
            console.log(err)
            toast.update(loading, { render: "Oops, something went terribly wrong...", type: "error", isLoading: false, autoClose: 2000 })
            return null
        }).then((data) => {
            data
        })

        toast.update(loading, { render: "Thank you for your contribution !", type: "success", isLoading: false, autoClose: 2000 })
        uploadProps.newUpload()

    }


    return (
        <div className="relative h-full w-full">
            <Navbar />
            <div className="absolute">
                <ToastContainer position="bottom-center"
                    autoClose={2000}
                    hideProgressBar
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored" />
            </div>
            <div className="pt-[15vh] flex flex-col items-center">
                <div className="w-[90%] bg-zinc-600 rounded-md">
                    <div className="w-full flex flex-row px-4 h-20 ">
                        <div className="w-[50%] md:w-[40%] mr-4 m-auto ml-0">
                            <Input
                                label="Title"
                                onChange={(e: any) => { uploadProps.setTitle(e.currentTarget.value) }}
                                id="name"
                                value={uploadProps.title || ""}
                                type="text"
                                isMandatory={true}
                            />
                        </div>
                        <ImageUploadInput key={uploadProps?.id + "Thumb"} name="Thumbnail" uploadProps={uploadProps} />
                        <ImageUploadInput key={uploadProps?.id + "Poster"} name="Poster" uploadProps={uploadProps} />
                        <GenreModal key={uploadProps?.id + "Genres"} uploadProps={uploadProps} />
                        <div onClick={handleUpload} className="flex flex-col items-center gap-4 cursor-pointer rounded-md pt-4 pb-4 md:px-4 md:pt-3 md:pb-4 w-[20%] md:w-[15%] text-md text-white bg-blue-500 border-2 border-blue-600 hover:bg-blue-400 hover:border-blue-500 transition duration-300 mx-0 md:ml-auto my-auto">
                            <div className="flex flex-row items-center gap-2">
                                <div className="m-auto">
                                    <IoSend size={20} />
                                </div>
                                <p className="hidden md:block relative cursor-pointer text-md font-semibold">Upload</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[30vh] px-4 mb-4">
                        <div className="relative">
                            <textarea
                                onChange={(e: any) => { uploadProps.setDesc(e.currentTarget.value) }}
                                value={uploadProps.description || ""}
                                id=""
                                className={`block ${uploadProps.description && "border-r-2 border-r-green-600"} h-[30vh] w-full resize-none rounded-md px-6 pt-6 pb-1 text-md text-white bg-neutral-700 appearance-none focus:outline-none focus:ring-0 peer`}
                                placeholder=" "
                            />
                            <label
                                className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                                htmlFor="">
                                Description
                                <span className='inline-bloc text-red-600 font-light'>*</span>
                            </label>
                        </div>
                    </div>
                    <VideoUpload key={uploadProps?.id + "Video"} uploadProps={uploadProps} />
                </div>
            </div>
        </div >
    )
}

export default Uploader;