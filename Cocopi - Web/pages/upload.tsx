import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { isUndefined } from "lodash";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Navbar from "@/components/Navbar";
import Input from "@/components/Input";
import useCurrentUser from "@/hooks/useCurrentUser"
import useGenresList from "@/hooks/useGenresList";
import { uploadData } from "@/lib/uploadData";
import { IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaCheck, FaPlus } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ImageUploadInput from "@/components/ImageUploadInput";


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


class Genre {
    id: string;
    genre: string;
    isClicked: boolean;

    constructor(id: string, genre: string, isClicked: boolean = false) {
        this.id = id
        this.genre = genre
        this.isClicked = isClicked
    }
    public updateState(isClicked: boolean) {
        this.isClicked = isClicked
        return this
    }
}

class GenreList {
    list: Genre[];

    constructor(genreList: Genre[] = []) {
        this.list = genreList;
    }
    public push(g: Genre) {
        this.list.push(g);
    }
    public index(g: Genre) {
        for (let exGenre of this?.list) {
            if (exGenre?.id == g.id) {
                return this?.list.indexOf(exGenre)
            }
        }
        return 0
    }
    public updateState(g: Genre) {
        this.list[this.index(g)] = g.updateState(!g.isClicked)
    }
    public getSelected() {
        const selectedList = new GenreList();
        for (let g in this.list) {
            if (this.list[g]?.isClicked) {
                selectedList.push(this.list[g])
            }
        }
        return selectedList
    }
    public displayList() {
        const selectedGenres = this.getSelected()
        const displayArray: string[] = []
        selectedGenres.list.forEach(genre => {
            displayArray.push(genre?.genre)
        });
        if (displayArray.length == 1) return displayArray[0]
        return displayArray.join(", ") || undefined
    }

}

interface GenreChoiceProps {
    visible?: boolean;
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

export default function Upload() {

    const { data: user } = useCurrentUser();
    const { data: dbGenres } = useGenresList();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [viewGenres, toggleViewGenres] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [genreList, setGenreList] = useState<GenreList>(new GenreList())
    const videoRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController>(new AbortController());

    const initGenreList = useCallback(() => {
        const tmpList = new GenreList
        dbGenres.map((g: any) => {
            const genre = new Genre(g?.id, g?.genre, false)
            tmpList.push(genre)
        })
        setGenreList(genreList => new GenreList(tmpList.list))
    }, [dbGenres, setGenreList])

    useEffect(() => {
        if (isUndefined(dbGenres)) return
        if (!isFirstLoad) { return }
        else {
            setIsFirstLoad(false)
            initGenreList()
        }
    }, [isFirstLoad, setIsFirstLoad, initGenreList, dbGenres])

    if (isUndefined(genreList)) {
        return null
    }

    const getGenreList = () => {
        return genreList
    }

    const selectGenre = (genre: Genre) => {
        genreList.updateState(genre)
        setGenreList(genreList => new GenreList(genreList.list))
        uploadData.setGenre(genreList.displayList())
    }
    if (isUndefined(user) || isUndefined(genreList)) {
        return null;
    }



    const handleUpload = async () => {
        if (isUndefined(uploadData.getVideo())) {
            toast.error("Please choose a video file before uploading !", ToastProps)
            return
        }

        if (title === "") {
            toast.error("Please choose a title before uploading !", ToastProps)
            return
        }

        if (description === "") {
            toast.error("Please write a short description before uploading !",)
            return
        }

        try {
            const loading = toast.loading("Uploading your file...", ToastProps)

            const requestData = {
                title: title,
                description: description,
                genres: genreList.displayList(),
                userId: user?.id,
                userName: user?.name,
                thumbnail: "undefined",
                poster: "undefined",
                videoUrl: "",
            }

            console.log(requestData)

            const uploadRequest = await axios.post('/api/upload', requestData).then(
                (data) => {
                    toast.update(loading, { render: "Thank you for your contribution !", type: "success", isLoading: false, autoClose: 2000 })
                    return data
                }
            ).catch(
                (err: AxiosError) => {
                    if (err?.message != "canceled") { console.log(err) }
                    toast.update(loading, { render: "Oops, something went terribly wrong...", type: "error", isLoading: false, autoClose: 2000 })
                })

            if (uploadRequest?.status == 200) {

            }

        } catch (error) {
            console.log(error)
        }


    };

    const clearFileInput = () => {
        if (uploadStatus == "uploading") {
            abortControllerRef.current.abort("Canceled by user")
            abortControllerRef.current = new AbortController()
        }
        if (videoRef.current) videoRef.current.value = "";
        setSelectedVideo(null);
        setProgress(0);
        setUploadStatus("select");
    };

    const onChooseFile = () => {
        if (videoRef.current) videoRef.current.click();
    }

    const handleVideoUpload = async (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedVideo(event.target.files[0]);

            try {
                setUploadStatus("uploading")
                const formData = new FormData();
                formData.append("video", event.target.files[0]);

                const uploadRequest = await axios.post('/api/videoUpload', formData,
                    {
                        onUploadProgress: ProgressEvent => {
                            const uploadProgress: number = parseFloat((ProgressEvent.loaded / (ProgressEvent.total || 1) * 100).toFixed(2))
                            setProgress((progress) => uploadProgress)
                        },
                        signal: abortControllerRef.current.signal
                    }
                ).catch((err: AxiosError) => { if (err?.message != "canceled") { console.log(err) } })
                uploadData.setVideo(uploadRequest?.data)
                setProgress(0)
                setUploadStatus("done")
            } catch (error) {
                console.log(error)
            }
        }
        return
    };


    if (user?.roles[0] != "admin") {
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
                            <div className="w-[80%] md:w-[40%] mr-4 m-auto ml-0">
                                <Input
                                    label="Title"
                                    onChange={(e: any) => { setTitle(e.currentTarget.value) }}
                                    id="name"
                                    value={title}
                                    type="text"
                                    isMandatory={true}
                                />
                            </div>
                            <ImageUploadInput name="Thumbnail" />
                            <ImageUploadInput name="Poster" />
                            <div className="flex flex-row items-center max-w-[20%] w-[15%] md:w-auto mr-4 md:mx-auto">
                                <div
                                    className={`flex flex-col h-14 w-full gap-4 cursor-pointer ${genreList.displayList() ? "justify-left border-r-2 border-r-green-600" : "items-center border-2 border-dashed"} rounded-md pt-4 pb-4 md:px-4 md:pt-3 md:pb-4 text-md text-gray-400 bg-neutral-700 border-zinc-600 hover:bg-neutral-600 hover:border-zinc-500 transition duration-300 mx-0 my-auto`}
                                    onClick={() => { toggleViewGenres((viewGenres) => true) }}>
                                    <p className="hidden md:block truncate text-ellipsis">{genreList.displayList() ? genreList.displayList() : "Select Genres"}<span className={`${genreList.displayList() ? "hidden" : "inline-block"} text-sm text-red-500`}>*</span></p>
                                    <div className="flex flex-col items-center p-auto m-auto md:hidden">
                                        <FaPlus />
                                    </div>

                                </div>
                                <div className={`${viewGenres ? "absolute" : "hidden"} top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 z-30`}>
                                    <div className="w-full h-full flex flex-row items-center justify-center">
                                        <div className="w-[90%] md:w-[40%]  flex-col items-center bg-neutral-700 rounded-md border-2 border-neutral-800 px-4 pb-2 pt-4">
                                            <div className="w-full flex flex-row items-center">
                                                <p className="text-white text-left font-semibold text-2xl ml-0 mr-auto">Choose :</p>
                                                <RxCross2 className="cursor-pointer" onClick={() => { toggleViewGenres((viewGenres) => false) }} />
                                            </div>
                                            <hr className="w-[90%] border-1 border-neutral-800 my-2" />
                                            <div className="w-full flex flex-wrap items-center justify-center gap-2 px-4 my-4">
                                                {genreList.list.map((e: any) => (
                                                    <div key={e?.id}>
                                                        <input onClick={() => { selectGenre(e) }} id={e?.id} className="hidden" type="checkbox" />
                                                        <label htmlFor={e?.id} className={`${getGenreList().list[genreList.index(e)]?.isClicked ? "bg-white border-white" : "bordrer-zing-400"} flex flex-row items-center gap-2 cursor-pointer text-xs md:text-base text-zinc-400 py-1 px-2 rounded-full border-2 transition duration-300`}>
                                                            <p>
                                                                {e?.genre}
                                                            </p>
                                                            <GoPlus className={`font-extrabold transition duration-300 ${getGenreList().list[genreList.index(e)]?.isClicked ? "transform rotate-[135deg]" : ""}`} size={15} />
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div onClick={handleUpload} className="flex flex-col items-center gap-4 cursor-pointer rounded-md pt-4 pb-4 md:px-4 md:pt-3 md:pb-4 w-[15%] text-md text-white bg-blue-500 border-2 border-blue-600 hover:bg-blue-400 hover:border-blue-500 transition duration-300 mx-0 md:ml-auto my-auto">
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
                                    onChange={(e: any) => setDescription(e.currentTarget.value)}
                                    value={description}
                                    id=""
                                    className={`block ${description == "" ? "" : "border-r-2 border-r-green-600"} h-[30vh] w-full resize-none rounded-md px-6 pt-6 pb-1 text-md text-white bg-neutral-700 appearance-none focus:outline-none focus:ring-0 peer`}
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
                        <div className="px-4 mb-4">
                            <div className={`w-full flex flex-row items-center transition-all duration-300 ${selectedVideo ? "h-12" : "h-60 border-dashed hover:border-zinc-500 hover:bg-neutral-600"} ${uploadStatus === "done" ? "border-r-2 border-r-green-600" : "border-2"} rounded-md bg-neutral-700 border-zinc-600`}>
                                <input
                                    ref={videoRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    style={{ display: "none" }}
                                />

                                {!selectedVideo && (
                                    <button className="w-full h-full flex flex-row items-center transition duration-300" onClick={onChooseFile}>
                                        <div className="w-full flex flex-col items-center text-zinc-400">
                                            <IoCloudUploadOutline size={50} />
                                            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-400">MKV, AVI, MP4, ...</p>
                                        </div>
                                    </button>
                                )}

                                {selectedVideo && (
                                    <div className="relative w-full h-full">
                                        <div className={`${uploadStatus !== "select" ? "absolute" : "hidden"} top-0 left-0 h-full ease-in-out bg-neutral-900 rounded-md opacity-15 z-0`} style={{ width: progress.toFixed(0) + "%" }}></div>
                                        <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center gap-4 z-10">
                                            <p className="w-[80%] ml-4 text-neutral-400 flex flex-row gap-1 items-center mr-0"> Selected file :
                                                <span className="font-semibold max-w-[60%] truncate overflow-hidden text-ellipsis mr-0">{selectedVideo?.name}</span>
                                                <span className={`${uploadStatus !== "select" ? "font-light text-sm mb-0 mt-auto ml-0 mr-0 max-w-[15%]" : "hidden"} `}>{uploadStatus === "uploading" ? progress + "%" : ""}</span>
                                                <span className={`${uploadStatus === "done" ? "flex flex-row items-center gap-2 font-light text-sm mb-0 mt-auto ml-0 mr-0 max-w-[15%]" : "hidden"} `}>Uploaded<span className="text-green-500"><FaCheck size={10} /></span></span>
                                            </p>
                                            <div className="text-neutral-400 font-semibold mr-4 ml-auto cursor-pointer z-10" onClick={clearFileInput}>
                                                <RxCross2 size={30} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}