import axios from "axios";
import usePendingUploads from "@/hooks/usePendingUploads";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AdminLayout } from "@/pages/_app";
import { FaCheck, FaPlay } from "react-icons/fa";
import { MdSearch, MdRefresh } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

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

    if (session.user.roles != "admin") {
        return {
            redirect: {
                destination: "/account",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export default function Accounts() {
    const router = useRouter();
    const pathname = usePathname();
    const [page, setPage] = useState(1)
    const searchParams = new URLSearchParams(useSearchParams());
    const q = searchParams.get("q");
    const p = searchParams.get("page") || 1;
    const { data: pendingUploads, mutate: mutateUploads } = usePendingUploads({ searchText: q, page: p } || undefined);
    const { data: uploadCount, mutate: mutateUploadCount } = usePendingUploads({ searchText: q });

    const handleSearch = (e: any) => {
        if (e.target.value) {
            searchParams.set("q", e.target.value);
        } else {
            searchParams.delete("q");
        }
        router.replace(`${pathname}?${searchParams}`);
    }

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

    const nextPage = async () => {
        setPage(page + 1)
        if (!searchParams.has("page")) searchParams.set("page", (page + 1).toString())
        else searchParams.set("page", (page + 1).toString())

        if (searchParams.size == 0) {
            router.replace(`${pathname}`);
        } else {
            router.replace(`${pathname}?${searchParams}`);
        }
        await mutateUploadCount()
        await mutateUploads()
    }

    const prevPage = async () => {
        setPage(page - 1)
        searchParams.set("page", (page - 1).toString())
        if (page - 1 == 1) searchParams.delete("page")
        if (searchParams.size == 0) {
            router.replace(`${pathname}`);
        } else {
            router.replace(`${pathname}?${searchParams}`);
        }
        await mutateUploadCount()
        await mutateUploads()
    }

    return (
        <AdminLayout pageName="Pending Uploads">
            <div className="flex flex-col gap-2 justify-between items-start p-2 bg-slate-800 rounded-md">
                <div className="w-full h-fit flex flex-row items-center justify-between">
                    <div className="w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input onChange={(e) => handleSearch(e)} type="text" className="bg-transparent focus:outline-none w-full text-white" placeholder="Search for upload..." />
                    </div>
                    <button onClick={() => { mutateUploads() }} className="p-1 px-6 flex flex-row gap-2 group items-center justify-center rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                        <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                        Refresh
                    </button>
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
                                    <td className="grid grid-cols-[20%_80%] items-center font-semibold truncate text-ellipsis">
                                        <img src={upload?.posterUrl ? `/Assets/PendingUploads/${upload.id}/thumb/${upload.posterUrl}` : "/Assets/Images/default_profile.png"} className="max-h-6" alt="" />
                                        {upload?.title}
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
                    <button onClick={prevPage} disabled={page <= 1} className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm disabled:bg-slate-800 disabled:border-slate-500 disabled:hover:bg-slate-800 disabled:text-slate-900 hover:bg-slate-600 transition all duration-100">Previous</button>
                    <button onClick={nextPage} disabled={page * 10 >= uploadCount?.length} className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm disabled:bg-slate-800 disabled:border-slate-500 disabled:hover:bg-slate-800 disabled:text-slate-900 hover:bg-slate-600 transition all duration-100">Next</button>
                </div>
            </div>
        </AdminLayout>
    )
}