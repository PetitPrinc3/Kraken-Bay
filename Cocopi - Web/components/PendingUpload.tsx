import axios from "axios";
import { useRouter } from "next/router";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ValidateUpload = (uploadId: string, uploadTitle: string) => {
    axios.get("/api/pendingUploads", { params: { uploadId: uploadId } })
    toast.success("Upload accepted : " + uploadTitle,
        {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colored",
            containerId: "AdminContainer"
        })
};

const RejectUpload = (uploadId: string, uploadTitle?: string) => {
    axios.delete("/api/pendingUploads", { data: { uploadId } })
    toast.error("Rejected upload : " + uploadTitle,
        {
            position: "bottom-right",
            autoClose: 2000,
            theme: "colored",
            containerId: "AdminContainer"
        })
}

const PendingUpload = (data: any) => {

    const upload = data?.data
    const router = useRouter()
    const [hidden, setHidden] = useState(false)

    return (
        <>
            <div className={`${hidden ? "hidden" : "flex"} flex-row items-center px-5 w-full h-14 border-b-2 border-white transition duration-100`}>
                <div onClick={() => { router.push(upload?.videoUrl) }} className="w-full h-full flex flex-row items-center gap-4 cursor-pointer">
                    <div className="w-[50%] flex flex-row items-center gap-2 truncate text-ellipsis overflow-hidden">
                        <p className="text-white font-semibold text-ellipsis overflow-hidden">{upload?.title}</p>
                    </div>
                    <div className="w-[15%] hidden lg:flex flex-row items-center gap-2 overflow-hidden">
                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">{upload?.thumbUrl != "undefined" ? "Yes" : "No"}</p>
                    </div>
                    <div className="w-[15%] hidden lg:flex flex-row items-center gap-2 overflow-hidden">
                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">{upload?.posterUrl != "undefined" ? "Yes" : "No"}</p>
                    </div>
                    <div className="w-[20%] flex flex-row items-center gap-2 mr-10 ml-auto">
                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">{upload?.userName ? upload?.userName : "Not available"}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-5 w-[15%] lg:w-[5%]">
                    <button>
                        <FaCheck onClick={() => { ValidateUpload(upload?.id, upload?.title); setHidden(true) }} className="text-green-500" size={20} />
                    </button>
                    <button>
                        <ImCross onClick={() => { RejectUpload(upload?.id, upload?.title); setHidden(true) }} className="text-red-600" size={15} />
                    </button>
                </div>
            </div >
        </>
    )
}

export default PendingUpload;

