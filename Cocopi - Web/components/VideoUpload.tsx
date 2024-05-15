import React, { createRef, Ref, RefObject, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";

const VideoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");
    const [uploadRequest, setUploadRequest] = useState(new XMLHttpRequest());

    const clearFileInput = () => {
        if (uploadStatus == "uploading") {
            uploadRequest.abort()
        }
        if (inputRef.current) inputRef.current.value = "";
        setSelectedFile(null);
        setProgress(0);
        setUploadStatus("select");
    };

    const onChooseFile = () => {
        if (inputRef.current) inputRef.current.click();
    }

    const handleUpload = async (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);

            setUploadStatus("uploading")

            const formData = new FormData();
            formData.append('file', event.target.files[0], event.target.files[0].name)
            const req = new XMLHttpRequest();
            req.open('POST', "/api/upload", true)

            req.upload.onprogress = (e) => { setProgress(+(e.loaded / e.total * 100).toFixed(2)) }
            req.onerror = () => { console.log("error") }
            req.onabort = () => {
                setProgress(0)
                setUploadStatus("select")
            }
            req.onload = () => {
                setProgress(0)
                setUploadStatus("done")
            }
            setUploadRequest(req)
            req.send(formData)

        }
    };

    return (
        <div className={`w-full flex flex-row items-center transition-all duration-300 ${selectedFile ? "h-12" : "h-60 border-dashed hover:border-zinc-500 hover:bg-neutral-600"} rounded-md bg-neutral-700 border-2 border-zinc-600`}>
            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={handleUpload}
                style={{ display: "none" }}
            />

            {!selectedFile && (
                <button className="w-full h-full flex flex-row items-center transition duration-300" onClick={onChooseFile}>
                    <div className="w-full flex flex-col items-center text-zinc-400">
                        <IoCloudUploadOutline size={50} />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MKV, AVI, MP4, ...</p>
                    </div>
                </button>
            )}

            {selectedFile && (
                <div className="relative w-full h-full">
                    <div className={`${uploadStatus !== "select" ? "absolute" : "hidden"} top-0 left-0 h-full ease-in-out bg-neutral-900 rounded-md opacity-15 z-0`} style={{ width: progress.toFixed(0) + "%" }}></div>
                    <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center gap-4 z-10">
                        <p className="w-[80%] ml-4 text-neutral-400 flex flex-row gap-1 items-center mr-0"> Selected file :
                            <span className="font-semibold max-w-[60%] truncate overflow-hidden text-ellipsis mr-0">{selectedFile?.name}</span>
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
    );
}

export default VideoUpload;