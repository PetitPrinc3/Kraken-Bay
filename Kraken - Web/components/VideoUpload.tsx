import { UploadPropsInterface } from "@/hooks/useUploadProps"
import React, { useState, useRef } from "react"
import axios, { AxiosError } from "axios"

import { IoCloudUploadOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

interface VideoUploadProps {
    uploadProps: UploadPropsInterface
}

const VideoUpload: React.FC<VideoUploadProps> = ({ uploadProps }) => {

    const [selectedVideo, setSelectedVideo] = useState(uploadProps.videoUrl);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");

    const abortControllerRef = useRef(new AbortController())
    const videoRef = useRef<HTMLInputElement>(null);

    const onChooseFile = () => {
        if (videoRef.current) videoRef.current.click();
    }

    const handleUpload = (event: any) => {
        setUploadStatus((uploadStatus) => "uploading")
        if (event.target.files && event.target.files.length > 0) {
            const videoFile = event.target.files[0];
            setSelectedVideo(videoFile)
            const formData = new FormData();
            formData.append("video", videoFile);
            const uploadRequest = axios.post(`/api/uploader/video/${uploadProps.id}`, formData, {
                onUploadProgress: ProgressEvent => {
                    const uploadProgress: number = parseFloat((ProgressEvent.loaded / (ProgressEvent.total || 1) * 100).toFixed(2))
                    setProgress(uploadProgress)
                },
                signal: abortControllerRef.current.signal

            }
            ).catch((err: AxiosError) => { if (err?.message != "canceled") { console.log(err) } }).then(() => {
                setUploadStatus((uploadStatus) => "done")
            })
            uploadProps.setRequest(uploadRequest)
            uploadProps.setVideo(videoFile?.name)
            setProgress(100)
        }
    }

    const clearFile = () => {
        if (uploadStatus == "uploading") {
            abortControllerRef.current.abort("Canceled by user")
            abortControllerRef.current = new AbortController()
        }
        uploadProps.setVideo()
        if (videoRef.current) videoRef.current.value = "";
        setSelectedVideo(undefined);
        setProgress(0);
        setUploadStatus("select");
    }

    return (
        <div className="px-4 mb-4">
            <div className={`w-full flex flex-row items-center transition-all duration-300 ${selectedVideo ? "h-12" : "h-40 md:h-60 border-dashed hover:border-zinc-500 hover:bg-neutral-600"} ${uploadStatus === "done" ? "border-r-2 border-r-green-600" : "border-2"} rounded-md bg-neutral-700 border-zinc-600`}>
                <input
                    ref={videoRef}
                    type="file"
                    accept="video/*,.mkv"
                    onChange={handleUpload}
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
                            <p className="w-[80%] ml-4 text-neutral-400 flex flex-row gap-1 items-center mr-0">
                                <span className="hidden md:inline-block">Selected file :</span>
                                <span className="font-semibold max-w-[60%] truncate overflow-hidden text-ellipsis mr-0">{selectedVideo?.name}</span>
                                <span className={`${uploadStatus !== "select" ? "font-light text-sm mb-0 mt-auto ml-0 mr-0 max-w-[15%]" : "hidden"} `}>{uploadStatus === "uploading" ? progress + "%" : ""}</span>
                                <span className={`${uploadStatus === "done" ? "flex flex-row items-center gap-2 font-light text-sm mb-0 mt-auto ml-0 mr-0 max-w-[15%]" : "hidden"} `}>Uploaded<span className="text-green-500"><FaCheck size={10} /></span></span>
                            </p>
                            <div className="text-neutral-400 font-semibold mr-4 ml-auto cursor-pointer z-10" onClick={clearFile}>
                                <RxCross2 size={30} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoUpload