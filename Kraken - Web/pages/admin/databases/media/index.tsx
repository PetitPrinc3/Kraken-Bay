"use client"
import { AdminLayout } from "@/pages/_app";
import axios from "axios";
import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MdRefresh, MdSearch, MdOutlineEdit, MdSync } from "react-icons/md";
import { BsDatabaseFillX, BsDatabaseFillAdd } from "react-icons/bs";
import { BiMovie, BiSolidFileJson } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { IoWarning, IoGitMerge, IoGitPullRequest } from "react-icons/io5";
import { HiOutlineTrash } from "react-icons/hi2";
import { TbDatabaseImport, TbDatabaseExport } from "react-icons/tb";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { isUndefined } from "lodash";
import useMedia from "@/hooks/useMedia";

export default function Media() {
    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();
    const pathname = usePathname();
    const q = searchParams.get("q");
    const [targetDb, setTargetDb] = useState("Media")
    const [importData, setImportData] = useState<any>()
    const jsonImportRef = useRef<HTMLInputElement>(null)
    const [purgeAction, setPurgeAction] = useState(false)
    const [importAction, setImportAction] = useState(false)
    const [replaceAction, setReplaceAction] = useState(false)
    const [purgeValidation, setPurgeValidation] = useState("")
    const { data: media, mutate: mutateMedia } = useMedia({ searchText: q })

    const handleSearch = (e: any) => {
        if (e.target.value) {
            searchParams.set("q", e.target.value);
            router.replace(`${pathname}?${searchParams}`);
        } else {
            router.replace(`${pathname}`);
        }
    }

    const jsonImport = async (e: any) => {
        const jsonFile = e.target.files[0] as File
        const jsonInput = JSON.parse(await jsonFile.text())
        if (isUndefined(jsonInput?.Titles)) {
            toast.error("Invalid JSON file.")
            return
        } else {
            setImportData(jsonInput.Titles)
            setImportAction(true)
        }
        if (!isUndefined(jsonImportRef.current?.files)) jsonImportRef.current.value = ""
    }

    const jsonExport = () => {
        const jsonData = JSON.stringify({
            "Titles": media
        }, null, 4)
        const exportData = new Blob([jsonData])
        const downloader = window.document.createElement("a")
        downloader.href = window.URL.createObjectURL(exportData);
        const now = new Date()
        downloader.download = now.toLocaleDateString("fr", { year: "numeric", month: "2-digit", day: "2-digit" }).split("/").reverse().join("") + "_" + now.getUTCHours().toString() + "Z" + now.getUTCMinutes().toString() + "_KrakenMedia_Export.json"
        document.body.appendChild(downloader)
        downloader.click()
        document.body.removeChild(downloader)
    }

    const purgeMedia = async (mediaId?: string) => {
        if (purgeAction && purgeValidation == "Kraken/Media") {
            await axios.delete("/api/media").catch((err) => {
                toast.clearWaitingQueue()
                toast.error("Something went wrong.", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                    toast.success("DB purged.", { containerId: "AdminContainer" })
                    setPurgeAction(false)
                    setPurgeValidation("")
                    mutateMedia()
                }
            })
        } else if (!isUndefined(mediaId)) {
            await axios.delete("/api/media", { params: { mediaId: mediaId } }).catch((err) => {
                toast.clearWaitingQueue()
                toast.error("Something went wrong.", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                    toast.success("Entry removed.", { containerId: "AdminContainer" })
                    setPurgeAction(false)
                    setPurgeValidation("")
                    mutateMedia()
                }
            })
        }
    }

    const handleMerge = async (tstr: boolean = true) => {
        if (targetDb == "Media") {
            setReplaceAction(false)
            for (let i = 0; i < importData.length; i++) {
                await axios.post("/api/media", importData[i]).catch((err) => {
                    toast.error("Something went wrong.", { containerId: "AdminContainer" })
                })
            }
            mutateMedia()
            if (tstr) {
                toast.success("Data merged successfully.", { containerId: "AdminContainer" })
            }
        }
    }

    const handleReplace = async () => {
        if (targetDb == "Media") {
            await axios.delete("/api/media").catch((err) => {
                toast.clearWaitingQueue()
                toast.error("Something went wrong.", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                }
            })
            handleMerge(false)
            toast.success("Data replaced successfully.", { containerId: "AdminContainer" })
        }
    }

    return (
        <AdminLayout pageName="media" >
            <div className="w-full h-fit max-h-full flex flex-col p-4 gap-4 rounded-md bg-slate-800">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input onChange={(e) => handleSearch(e)} type="text" className="bg-transparent text-white focus:outline-none w-full" placeholder="Search for media..." />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
                            <MdSync />
                            Detect <span className="hidden lg:block">new media</span>
                        </div>
                        <div onClick={jsonExport} className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
                            <TbDatabaseExport />
                            Export <span className="hidden lg:block">as JSON</span>
                        </div>
                        <div onClick={() => { jsonImportRef.current?.click() }} className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
                            <input onChange={jsonImport} ref={jsonImportRef} type="file" accept=".json" className="hidden" />
                            <TbDatabaseImport />
                            Import <span className="hidden lg:block">from JSON</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[55vh] overflow-y-scroll overflow-x-clip">
                    <table className="w-full max-h-full relative table-fixed border-separate border-spacing-y-4">
                        <thead className="top-0 sticky bg-slate-800 w-full">
                            <tr className="text-white font-semibold ">
                                <td className="w-[30%]">Title</td>
                                <td className="w-[30%] lg:w-[25%]">Video</td>
                                <td className="w-[15%] text-center">Created At</td>
                                <td className="w-[25%] lg:w-[10%] text-center">Uploader</td>
                                <td className="w-[10%] text-center">Type</td>
                                <td className="w-[15%]"></td>
                            </tr>
                        </thead>
                        <tbody className="w-full h-full rounded-md text-white">
                            {(media || []).map((media: any) => (
                                <tr key={media?.id}>
                                    <td className="grid grid-cols-[20%_80%] items-center font-semibold truncate text-ellipsis">
                                        <img src={media?.posterUrl || "/Assets/Images/default_profile.png"} className="max-h-6" alt="" />
                                        {media?.title}
                                    </td>
                                    <td className="font-light truncate text-ellipsis">
                                        <a href={media?.videoUrl}>{media?.videoUrl}</a>
                                    </td>
                                    <td className="text-center text-slate-400 truncate text-ellipsis">
                                        {new Date(media?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="text-center text-slate-400 truncate text-ellipsis">
                                        {media?.uploadedBy}
                                    </td>
                                    <td className="text-center text-slate-400 truncate text-ellipsis">
                                        {media?.type == "Movies" ? "Movie" : "TV Show"}
                                    </td>
                                    <td className="flex flex-row items-center justify-center gap-2">
                                        <div onClick={() => router.push(`./media/edit/${media.id}`)} className="p-1 rounded-lg bg-slate-600 border-[1px] border-slate-400 hover:bg-blue-500 hover:border-blue-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <MdOutlineEdit />
                                        </div>
                                        <div onClick={() => { purgeMedia(media.id) }} className="p-1 rounded-lg bg-slate-600 border-[1px] border-slate-400 hover:bg-red-500 hover:border-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <HiOutlineTrash />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full h-fit flex flex-row items-center justify-between px-4">
                    <button onClick={() => { mutateMedia() }} className="w-[15%] flex flex-row gap-2 group items-center justify-center p-1 px-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                        <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                        Refresh
                    </button>
                    <button onClick={() => { setPurgeAction(true) }} className="w-[15%] flex flex-row gap-2 group items-center justify-center p-1 px-2 rounded-md bg-red-500 border-2 border-red-600 text-sm hover:bg-red-400 transition-all duration-100">
                        Purge <span className="hidden lg:block">database</span>
                    </button>
                </div>
            </div>
            <div onKeyDown={(e) => { if (e.key == "Escape") setPurgeAction(false) }} className={`${purgeAction ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${purgeAction ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 flex items-center`}>
                    <div onClick={() => setPurgeAction(false)} className="fixed top-0 left-0 right-0 bottom-0 z-40"></div>
                    <div className="w-[35%] h-fit flex flex-col gap-4 py-4 bg-slate-700 border-[1px] border-slate-400 text-slate-300 rounded-md m-auto  z-50">
                        <div className="w-full flex flex-row items-center justify-between px-4 ">
                            <div className="flex flex-col">
                                <p className="font-semibold text-xl">
                                    Purge Media Database
                                </p>
                                <div className="flex flex-row items-center gap-2 text-xs font-light leading-none">
                                    <IoWarning className="text-orange-400" />
                                    This will also delete every entry from the Serie_EP database.
                                </div>
                            </div>
                            <div onClick={() => setPurgeAction(false)} className="p-2 cursor-pointer hover:bg-slate-600 rounded-md transition-all duration-300">
                                <RxCross2 />
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="w-ful flex flex-col gap-2 items-center">
                            <div className="text-slate-400">
                                <BsDatabaseFillX size={30} />
                            </div>
                            <div className="text-2xl font-semibold">
                                Kraken/Media
                            </div>
                            <div className="flex flex-row gap-2 items-center text-md font-light">
                                <BiMovie className="text-slate-400" size={20} />
                                {media?.length} entries
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="flex flex-col gap-2 px-4">
                            <p className="font-semibold">
                                To confirm, type &quot;Kraken/Media&quot; in the box below
                            </p>
                            <input value={purgeValidation} onChange={(e) => setPurgeValidation(e.currentTarget.value)} type="text" className="rounded-md h-8 border-[1px] border-red-500 bg-slate-800 px-4 text-slate-300 font-semibold focus:outline-none" />
                        </div>
                        <div className="px-4">
                            <button onClick={() => purgeMedia()} disabled={purgeValidation != "Kraken/Media"} className="w-full text-red-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:text-red-500 disabled:hover:border-slate-500 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">Puge this database</button>
                        </div>
                    </div>
                </div>
            </div>
            <div onKeyDown={(e) => { if (e.key == "Escape") setImportAction(false) }} className={`${importAction ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${importAction ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 flex items-center`}>
                    <div onClick={() => setImportAction(false)} className="fixed top-0 left-0 right-0 bottom-0 z-40"></div>
                    <div className="w-[35%] h-fit flex flex-col gap-4 py-4 bg-slate-700 border-[1px] border-slate-400 text-slate-300 rounded-md m-auto  z-50">
                        <div className="w-full flex flex-row items-center justify-between px-4 ">
                            <div className="flex flex-col">
                                <p className="font-semibold text-xl">
                                    Import from JSON
                                </p>
                            </div>
                            <div onClick={() => setImportAction(false)} className="p-2 cursor-pointer hover:bg-slate-600 rounded-md transition-all duration-300">
                                <RxCross2 />
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="flex flex-row items-center justify-between gap-4 w-full px-4">
                            <div className="">
                                Target :
                            </div>
                            <select onChange={(e) => setTargetDb(e.currentTarget.value)} className="bg-slate-700 px-8 focus:outline-none" value={targetDb}>
                                <option value="Media">Media</option>
                                <option value="Serie_EP">Serie_EP</option>
                            </select>
                        </div>
                        <div className="w-ful flex flex-col gap-2 items-center">
                            <div className="text-slate-400">
                                <BsDatabaseFillAdd size={30} />
                            </div>
                            <div className="text-2xl font-semibold">
                                Kraken/{targetDb}
                            </div>
                            <div className="flex flex-row gap-8">
                                <div className="flex flex-row gap-2 items-center text-md font-light">
                                    <BiMovie className="text-slate-400" size={20} />
                                    {media?.length} entries
                                </div>
                                <div className="flex flex-row gap-2 items-center text-md font-light">
                                    <BiSolidFileJson className="text-slate-400" size={20} />
                                    {importData?.length} entries
                                </div>
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="grid grid-cols-2">
                            <div className="px-4">
                                <button onClick={() => { handleMerge() }} className="w-full flex flex-row items-center justify-center gap-2 text-green-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 hover:bg-green-500 hover:border-green-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">
                                    <IoGitMerge />
                                    Merge
                                </button>
                            </div>
                            <div className="px-4">
                                <button onClick={() => { setReplaceAction(!replaceAction) }} className={`w-full flex flex-row items-center justify-center gap-2 font-semibold px-8 py-1 border-[1px] ${replaceAction ? "bg-red-500 border-red-500 text-white" : "bg-slate-800 border-slate-500 text-red-500"} hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md transition-all duration-200`}>
                                    <IoGitPullRequest />
                                    Replace
                                </button>
                            </div>
                        </div>
                        <div className={replaceAction ? "w-full px-4 flex flex-col gap-2 transition-all duration-200" : "hidden"}>
                            <div className="flex flex-row items-center gap-2 text-sm font-light leading-none">
                                <IoWarning className="text-orange-400" />
                                This will purge the {targetDb} database. Use with caution !
                            </div>
                            <button onClick={() => { handleReplace() }} className="w-full flex flex-row items-center justify-center gap-2 text-red-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">
                                Confirm my choice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}