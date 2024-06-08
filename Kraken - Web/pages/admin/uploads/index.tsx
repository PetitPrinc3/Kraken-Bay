import { AdminLayout } from "@/pages/_app";
import { FaCheck, FaPlay } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { ImCross } from "react-icons/im";
import usePendingUploads from "@/hooks/usePendingUploads";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

export default function Accounts() {
    const { data: pendingUploads, mutate: mutateUploads } = usePendingUploads();
    const router = useRouter();

    const acceptUpload = async (upload: any) => {
        await axios.put("/api/pendingUploads", { uploadId: upload.id }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("Upload accepted.", { containerId: "AdminContainer" })
        })
        mutateUploads()
        await axios.post("/api/notify", { recipient: upload.uploadedBy, content: `Thank you for uploading ${upload.title}`, type: "success" }).then(() => {
        }).catch((err) => {
            toast.error(`Oops, something went wrong with the notification : ${err.response.data}`, { containerId: "AdminContainer" })
        })
    }

    const rejectUpload = async (upload: any) => {
        await axios.delete("/api/pendingUploads", { data: `${upload.id}` }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("Upload rejected.", { containerId: "AdminContainer" })
        })
        mutateUploads()
        await axios.post("/api/notify", { recipient: upload.uploadedBy, content: `We decided to reject your upload for ${upload.title}`, type: "success" }).then(() => {
        }).catch((err) => {
            toast.error(`Oops, something went wrong with the notification : ${err.response.data}`, { containerId: "AdminContainer" })
        })
    }

    if (isUndefined(pendingUploads)) return null
    return (
        <AdminLayout pageName="uploads">
            <div className="flex flex-col gap-2 justify-between items-start p-2 bg-slate-800 rounded-md">
                <div className="w-full h-fit flex flex-row items-center justify-between">
                    <div className="w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input type="text" className="bg-transparent focus:outline-none w-full" placeholder="Search for upload..." />
                    </div>
                    <button onClick={() => { mutateUploads() }} className="p-1 px-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">Refresh</button>
                </div>
                <div className="w-full h-[60vh] px-4">
                    <table className="w-full border-separate table-fixed border-spacing-y-2">
                        <thead className="text-md">
                            <tr className="text-white font-semibold">
                                <td className="w-[30%] lg:w-[25%]">Title</td>
                                <td className="w-[30%]">Upload Folder</td>
                                <td className="w-[20%] text-center">Created By</td>
                                <td className="w-[20%] lg:w-[25%]"></td>
                            </tr>
                        </thead>
                        <tbody className="w-full h-full rounded-md text-sm">
                            {(pendingUploads || []).map((upload: any) => (
                                <tr key={upload.id} className="text-white">
                                    <td className="truncate text-ellipsis">
                                        {upload.title}
                                    </td>
                                    <td className="truncate text-ellipsis">
                                        <a href={`/Assets/PendingUploads/${upload.id}`}>{upload.id}</a>
                                    </td>
                                    <td className="text-center truncate text-ellipsis">
                                        {upload.userName}
                                    </td>
                                    <td className="">
                                        <div className="relative flex flex-row items-center gap-2 text-black font-semibold text-sm">
                                            <button onClick={() => router.push(`./uploads/preview/${upload.id}`)} className="w-[30%] py-1 px-2 rounded-md ml-auto bg-slate-600 hover:bg-slate-500 transition-all duration-200">
                                                <p className="hidden lg:block">View</p>
                                                <div className="lg:hidden text-white m-1 flex items-center" >
                                                    <FaPlay size={15} />
                                                </div>
                                            </button>
                                            <button onClick={() => { acceptUpload(upload) }} className="w-[30%] py-1 px-2 rounded-md ml-auto bg-green-500 hover:bg-green-400 transition-all duration-200">
                                                <p className="hidden lg:block">Accept</p>
                                                <div className="lg:hidden text-white m-1 flex items-center" >
                                                    <FaCheck size={15} />
                                                </div>
                                            </button>
                                            <button onClick={() => { rejectUpload(upload) }} className="w-[30%] py-1 px-2 rounded-md mr-auto bg-red-700 hover:bg-red-600 transition-all duration-200">
                                                <p className="hidden lg:block">Reject</p>
                                                <div className="lg:hidden text-white m-1 flex items-center" >
                                                    <ImCross size={15} />
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <button className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm hover:bg-slate-600 transition all duration-100">Previous</button>
                    <button className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm hover:bg-slate-600 transition all duration-100">Next</button>
                </div>
            </div>
        </AdminLayout>
    )
}