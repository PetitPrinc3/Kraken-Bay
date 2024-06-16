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
import { TbZoomScan, TbArrowMergeLeft } from "react-icons/tb";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { isEmpty, isUndefined } from "lodash";
import useMedia from "@/hooks/useMedia";

export default function Media() {
    const searchParams = new URLSearchParams(useSearchParams());
    const router = useRouter();
    const pathname = usePathname();
    const q = searchParams.get("q");
    const [files, setFiles] = useState<any[] | undefined>(undefined)
    const [targetDb, setTargetDb] = useState("Media")
    const [importData, setImportData] = useState<any>()
    const jsonImportRef = useRef<HTMLInputElement>(null)
    const [purgeAction, setPurgeAction] = useState(false)
    const [importAction, setImportAction] = useState(false)
    const [replaceAction, setReplaceAction] = useState(false)
    const [openDetection, setOpenDetection] = useState(false)
    const [purgeValidation, setPurgeValidation] = useState("")
    const { data: media, mutate: mutateMedia } = useMedia({ searchText: q })


    const toggleDetection = async () => {
        setFiles(undefined)
        setOpenDetection(true)
        const loading = toast.loading("Detecting new files...", { containerId: "AdminContainer" })
        const data = await axios.get("/api/autoImport").catch((err) => toast.update(loading, { render: "Oops, something went wrong...", type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })).then((res) => { return res?.data })
        setFiles(data)
        toast.update(loading, { render: "Done.", type: "success", isLoading: false, autoClose: 1000, containerId: "AdminContainer" })
    }

    const setTitle = (key: string, e: any) => {
        if (isUndefined(files)) return
        const tempFiles = files.splice(0)
        tempFiles.forEach((file: any) => {
            if (file.key == key) {
                file.title = e.target.value
            }
        })
        setFiles(tempFiles)
    }

    const removeFile = (key: string) => {
        if (isUndefined(files)) return
        const tempFiles: any = new Array()
        files.splice(0).forEach((file: any) => {
            if (file.key != key) {
                tempFiles.push(file)
            }
        })
        setFiles(tempFiles)
    }

    const fetchMovies = async () => {
        const loading = toast.loading("Computing new entries...", { containerId: "AdminContainer" })
        const { data } = await axios.post("/api/autoImport", files).catch((err) => toast.update(loading, { render: "Oops, something went wrong...", type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })).then((res) => { return res?.data })
        await mutateMedia()
        toast.update(loading, { render: "Files added.", type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
    }

    const handleSearch = (e: any) => {
        if (e.target.value) {
            searchParams.set("q", e.target.value);
            router.replace(`${pathname}?${searchParams}`);
        } else {
            router.replace(`${pathname}`);
        }
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
            const loading = toast.loading("Purging database...", { containerId: "AdminContainer" })
            await axios.delete("/api/media").catch((err) => {
                toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.update(loading, { render: 'DB purged.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
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

    const jsonImport = async (e: any) => {
        const jsonFile = e.target.files[0] as File
        const jsonInput = JSON.parse(await jsonFile.text())
        if (isUndefined(jsonInput?.Titles) && isUndefined(jsonInput?.Episodes)) {
            toast.error("Invalid JSON file.", { containerId: "AdminContainer" })
            return
        } else if (!isUndefined(jsonInput?.Titles)) {
            setImportData(jsonInput.Titles)
            setTargetDb("Media")
            setImportAction(true)
        } else if (!isUndefined(jsonInput?.Episodes)) {
            setImportData(jsonInput.Episodes)
            setTargetDb("Serie_EP")
            setImportAction(true)
        }
        if (!isUndefined(jsonImportRef.current?.files)) jsonImportRef.current.value = ""
    }

    const handleMerge = async (tstr: boolean = true) => {
        setReplaceAction(false)
        const loading = tstr ? toast.loading("Merging data...", { containerId: "AdminContainer" }) : undefined
        if (targetDb == "Media") {
            for (let i = 0; i < importData.length; i++) {
                await axios.post("/api/media", importData[i]).catch((err) => {
                    !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                })
            }
            mutateMedia()
            !isUndefined(loading) && toast.update(loading, { render: 'Data merged successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        }
        if (targetDb == "Serie_EP") {
            for (let i = 0; i < importData.length; i++) {
                await axios.post("/api/episode", { importData: importData[i] }).catch((err) => {
                    !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                })
            }
            mutateMedia()
            !isUndefined(loading) && toast.update(loading, { render: 'Data merged successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        }
    }

    const handleReplace = async () => {
        const loading = toast.loading("Replacing data...", { containerId: "AdminContainer" })
        if (targetDb == "Media") {
            await axios.delete("/api/media").catch((err) => {
                toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                }
            })
        }
        if (targetDb == "Serie_EP") {
            await axios.delete("/api/episode").catch((err) => {
                toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                }
            })
        }
        await handleMerge(false)
        toast.update(loading, { render: 'Data replaced successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
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
                        <div onClick={toggleDetection} className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
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
                                        <p className="truncate text-ellipsis">{media?.title}</p>
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
            <div className={`${openDetection ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${openDetection ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 flex items-center`}>
                    <div className="w-[90%] h-[70%] mx-auto flex flex-col gap-4 rounded-md p-4 bg-slate-800">
                        <div className="w-full flex flex-row items-center justify-between text-2xl font-bold text-white">
                            Automatic Media detection
                            <div onClick={() => setOpenDetection(false)} className="p-2 rounded-md hover:bg-slate-700 transition-all duration-300 cursor-pointer">
                                <RxCross2 ></RxCross2>
                            </div>
                        </div>
                        <hr className="border-slate-400" />
                        <div className="relative w-full h-full overflow-y-scroll overflow-x-clip">
                            <table className="w-full h-fit border-separate border-spacing-x-4 border-spacing-y-1 table-fixed">
                                <thead className="h-[10%]">
                                    <tr className="text-white font-semibold text-lg">
                                        <td className="w-[50%]">File</td>
                                        <td className="w-[40%]">Title</td>
                                        <td className="w-[10%] text-center">Type</td>
                                    </tr>
                                </thead>
                                <tbody className="max-h-[90%] overflow-hidden">
                                    {!isUndefined(files) && files.map((file: any) => (
                                        <tr key={file.key}>
                                            <td onClick={() => removeFile(file.key)} className="group grid grid-cols-[3%_97%] items-center gap-2 px-2 rounded-full bg-slate-700 border-[1px] border-slate-500 hover:bg-red-500 hover:border-red-500 transition-all duration-300 cursor-pointer">
                                                <RxCross2 className="text-white group-hover:rotate-90 transition-all duration-500" />
                                                <p className="truncate text-ellipsis text-white pr-2">{file.name}</p>
                                            </td>
                                            <td>
                                                <input onChange={e => setTitle(file.key, e)} type="text" defaultValue={file.title} placeholder="Title" className="w-full bg-slate-700 text-white focus:outline-none px-2 border-slate-900 border-[1px] rounded-md" />
                                            </td>
                                            <td className="truncate text-ellipsis text-slate-400 text-center">
                                                {file.type}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {isUndefined(files) ?
                                <div className="flex flex-col gap-2">
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                    <div className={isUndefined(files) || isEmpty(files) ? "mx-4 h-10 bg-slate-700 rounded-md animate-pulse" : ""} />
                                </div>
                                : isEmpty(files) ?
                                    <div className="w-full pt-10 flex items-center test-center p-auto">
                                        <p className="w-full text-center text-md text-slate-400 font-semibold">No new files</p>
                                    </div>
                                    : null
                            }
                        </div>
                        <hr className="border-slate-400" />
                        <div className="flex flex-row gap-4">
                            <button disabled={files?.length == 0} className="flex flex-row items-center w-[20%] m-auto justify-center py-1 rounded-md bg-slate-700 border-2 font-semibold cursor-pointer transition-all duration-300 text-white hover:bg-green-500"
                                onClick={fetchMovies}
                            >
                                <TbArrowMergeLeft size={25} />
                                Add files
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}