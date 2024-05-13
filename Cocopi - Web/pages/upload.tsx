import useCurrentUser from "@/hooks/useCurrentUser"
import { isUndefined } from "lodash";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Navbar from "@/components/Navbar";
import Input from "@/components/Input";
import { useState } from "react";
import { IoIosCloudUpload } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

export async function getServerSideProps(context: NextPageContext) {
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

export default function Upload() {

    const { data: user } = useCurrentUser();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnail, setThumbnail] = useState(undefined)
    const [poster, setPoster] = useState(undefined)


    if (isUndefined(user)) {
        return null;
    }

    if (user?.roles[0] != "admin") {
        return (
            <div>
                <Navbar />
                <div className="pt-[15vh] flex flex-col items-center">
                    <div className="w-[90%] bg-zinc-600 rounded-md">
                        <div className="w-full flex flex-row px-4 h-20 ">
                            <div className="w-[40%] m-auto ml-0">
                                <Input
                                    label="Title"
                                    onChange={(e: any) => { setTitle((title) => e.target.value) }}
                                    id="name"
                                    value={title}
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-row items-center w-[20%] mx-auto">
                                <img className={`${thumbnail ? "block" : "hidden"}`} src={thumbnail} alt="Oops..." />
                                <div className={`${thumbnail ? "hidden" : "relative w-full cursor-pointer"}`}>
                                    <label htmlFor="dropzone-file" className="flex flex-row items-center justify-center h-14 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-neutral-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-neutral-600">
                                        <div className="flex flex-row items-center gap-4 pt-5 pb-6">
                                            <div className="w-10 h-full hidden md:flex flex-col items-center text-gray-500 dark:text-gray-400">
                                                <CiImageOn size={20} />
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold"><span className="hidden md:inline-block">Choose</span> Thumbnail</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-row items-center w-[20%] mx-auto">
                                <img className={`${poster ? "block" : "hidden"}`} src={poster} alt="Oops..." />
                                <div className={`${poster ? "hidden" : "relative w-full cursor-pointer"}`}>
                                    <label htmlFor="dropzone-file" className="flex flex-row items-center justify-center h-14 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-neutral-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-neutral-600">
                                        <div className="flex flex-row items-center gap-4 pt-5 pb-6">
                                            <div className="hidden md:flex w-10 h-full flex-col items-center text-gray-500 dark:text-gray-400">
                                                <CiImageOn size={20} />
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold"><span className="hidden md:inline-block">Choose</span> Poster</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 cursor-pointer rounded-md pt-5 pb-4 md:px-4 md:pt-3 md:pb-4 w-[15%] text-md text-white bg-blue-500 border-2 border-blue-600 hover:bg-blue-400 hover:border-blue-500 transition duration-300 mr-0 m-auto">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="m-auto">
                                        <IoIosCloudUpload />
                                    </div>
                                    <p className="hidden md:block relative cursor-pointer text-md font-semibold">Upload</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[30vh] px-4 mb-4">
                            <div className="relative">
                                <textarea
                                    onChange={(e: any) => setDescription(e.target.value)}
                                    value={description}
                                    id=""
                                    className="block h-[30vh] w-full resize-none rounded-md px-6 pt-6 pb-1 text-md text-white bg-neutral-700 appearance-none focus:outline-none focus:ring-0 peer"
                                    placeholder=" "
                                />
                                <label
                                    className="absolute text-md text-zinc-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                                    htmlFor="">
                                    Description
                                </label>
                            </div>
                        </div>
                        <div className="px-4 mb-4">
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-neutral-700 hover:bg-zinc-100 dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-neutral-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400">
                                            <IoCloudUploadOutline size={40} />
                                        </div>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">MKV, AVI, MP4, ...</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    console.log(user)

    return (
        <div>

        </div>
    )
}