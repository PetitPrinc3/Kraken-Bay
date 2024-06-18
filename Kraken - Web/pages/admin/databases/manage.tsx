import { AdminLayout } from "@/pages/_app";
import { MdOutlineVideoSettings, MdRefresh } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri"
import { BsDatabaseFillUp, BsDatabaseFillDown } from "react-icons/bs";
import { useRouter } from "next/router";
import { PiRabbitFill } from "react-icons/pi";
import 'reactflow/dist/style.css';
import useUsers from "@/hooks/useUsers";
import useMedia from "@/hooks/useMedia";
import { isNull, isUndefined } from "lodash";
import { RxCross2 } from "react-icons/rx";
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useEpisode from "@/hooks/useEpisode";
import { BiMovie } from "react-icons/bi";
import { IoWarning, IoGitMerge, IoGitPullRequest } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import useCurrentUser from "@/hooks/useCurrentUser";

export default function Manage() {
    const router = useRouter()
    const { data: users, mutate: mutateUsers } = useUsers()
    const { data: media, mutate: mutateMedia } = useMedia()
    const { data: episodes, mutate: mutateEpisodes } = useEpisode()
    const { data: currentUser } = useCurrentUser()

    const jsonImportRef = useRef<HTMLInputElement>(null)

    const [dummyDemo, setDummyDemo] = useState(false)
    const [dummyCheck, setDummyCheck] = useState(false)
    const [jsonFiles, setJsonFiles] = useState<any[]>([])
    const [importAction, setImportAction] = useState(false)
    const [replaceAction, setReplaceAction] = useState(false)

    const runDummy = async () => {
        const loading = toast.loading("Setting everything up...", { containerId: "AdminContainer" })
        if (!dummyCheck) return
        await axios.get("/api/dummyDemo").catch((err) => {
            toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        }).then((res) => {
            toast.update(loading, { render: 'Dummy demo is up !', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        })
        await mutate()
    }

    const fullBackup = async () => {

        const loading = toast.loading("Updating data with latest entries...", { containerId: "AdminContainer" })

        try {
            await mutateUsers()
            await mutateMedia()
            await mutateEpisodes()

            const downloader = window.document.createElement("a")
            const now = new Date()
            const filePatern = now.toLocaleDateString("fr", { year: "numeric", month: "2-digit", day: "2-digit" }).split("/").reverse().join("") + "_" + now.getUTCHours().toString() + "Z" + now.getUTCMinutes().toString()

            toast.update(loading, { render: "Generating User report...", containerId: "AdminContainer" })

            const jsonUsers = JSON.stringify({
                "Users": users
            }, null, 4)

            const exportUsers = new Blob([jsonUsers])
            downloader.href = window.URL.createObjectURL(exportUsers);
            downloader.download = filePatern + "_KrakenUsers_Export.json"
            document.body.appendChild(downloader)
            downloader.click()
            document.body.removeChild(downloader)

            toast.update(loading, { render: "Generating Media report...", containerId: "AdminContainer" })

            const jsonMedia = JSON.stringify({
                "Titles": media
            }, null, 4)

            const exportMedia = new Blob([jsonMedia])
            downloader.href = window.URL.createObjectURL(exportMedia);
            downloader.download = filePatern + "_KrakenMedia_Export.json"
            document.body.appendChild(downloader)
            downloader.click()
            document.body.removeChild(downloader)

            toast.update(loading, { render: "Generating Episode report...", containerId: "AdminContainer" })

            const jsonEpisodes = JSON.stringify({
                "Episodes": episodes
            }, null, 4)

            const exportEpisodes = new Blob([jsonEpisodes])
            downloader.href = window.URL.createObjectURL(exportEpisodes);
            downloader.download = filePatern + "_KrakenEpisodes_Export.json"
            document.body.appendChild(downloader)
            downloader.click()
            document.body.removeChild(downloader)

            toast.update(loading, { render: "Done !", type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        } catch {
            toast.update(loading, { render: "Oops, something went wrong...", type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        }


    }

    const toggleImport = useCallback(() => {
        setImportAction(!importAction)
        setReplaceAction(false)
        setJsonFiles([])
        if (!isUndefined(jsonImportRef.current?.files)) jsonImportRef.current.value = ""
    }, [importAction])

    const handleImport = async (e: any) => {
        if (!isNull(e.target.files)) {
            const jsonData = []
            for (let i = 0; i < (e.target.files || []).length; i++) {
                const jsonFile = e.target.files[i] as File
                const jsonInput = JSON.parse(await jsonFile.text())
                const target = jsonInput.hasOwnProperty("Titles") ? "Media" : jsonInput.hasOwnProperty("Users") ? "User" : jsonInput.hasOwnProperty("Episodes") ? "Serie_EP" : "Unknown"
                const json = {
                    key: uuidv4(),
                    name: jsonFile.name,
                    target: target,
                    data: jsonInput,
                }
                if (target == "Serie_EP" || target == "Unknown") {
                    jsonData.push(json)
                } else {
                    jsonData.unshift(json)
                }
            }
            setJsonFiles(jsonData)
            if (!isUndefined(jsonImportRef.current?.files)) jsonImportRef.current.value = ""
        }
    }

    const handleRemove = (id: string) => {
        const tmpFiles = jsonFiles.slice(0)
        for (let i = 0; i < tmpFiles.length; i++) {
            if (tmpFiles[i].key == id) {
                tmpFiles.splice(i, 1)
            }
        }
        console.log(tmpFiles)
        setJsonFiles(tmpFiles)
    }

    const handleMerge = async (tstr: boolean = true) => {
        setReplaceAction(false)
        const loading = tstr ? toast.loading("Merging data...", { containerId: "AdminContainer" }) : undefined
        for (let file of jsonFiles) {
            if (file.target == "User") {
                try {
                    const userData = file.data.Users
                    for (let i = 0; i < userData.length; i++) {
                        await axios.post("/api/users", { userData: userData[i] }).catch((err) => {
                            !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                        })
                    }
                } catch (err) {
                    toast.error(`Something went wrong importing ${file.name}`, { containerId: "AdminContainer" })
                }
            } else if (file.target == "Media") {
                try {
                    const mediaData = file.data.Titles
                    for (let i = 0; i < mediaData.length; i++) {
                        mediaData[i].uploadedBy = currentUser.email
                        await axios.post("/api/media", mediaData[i]).catch((err) => {
                            !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                        })
                    }
                } catch (err) {
                    toast.error(`Something went wrong importing ${file.name}`, { containerId: "AdminContainer" })
                }
            } else if (file.target == "Serie_EP") {
                try {
                    const episodeData = file.data.Episodes
                    for (let i = 0; i < episodeData.length; i++) {
                        await axios.post("/api/episode", { episodeData: episodeData[i], serieUrl: file.data?.serieUrl ? file.data?.serieUrl[0] : undefined }).catch((err) => {
                            !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                        })
                    }
                } catch (err) {
                    toast.error(`Something went wrong importing ${file.name}`, { containerId: "AdminContainer" })
                }
            } else {
                toast.error("Unrecognized file target.", { containerId: "AdminContainer" })
            }

        }
        await mutate()
        !isUndefined(loading) && toast.update(loading, { render: 'Data merged successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
    }

    const handleReplace = async () => {
        const loading = toast.loading("Purging databases...", { containerId: "AdminContainer" })

        for (let file of jsonFiles) {
            if (file.target == "User") {
                await axios.delete("/api/users").catch((err) => {
                    toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                }).then((data) => {
                    if (!isUndefined(data)) {
                        toast.clearWaitingQueue()
                    }
                })
            } else if (file.target == "Media") {
                await axios.delete("/api/media").catch((err) => {
                    toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                }).then((data) => {
                    if (!isUndefined(data)) {
                        toast.clearWaitingQueue()
                    }
                })
            } else if (file.target == "Serie_EP") {
                await axios.delete("/api/episode").catch((err) => {
                    toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                }).then((data) => {
                    if (!isUndefined(data)) {
                        toast.clearWaitingQueue()
                    }
                })
            }
        }
        toast.update(loading, { render: "Importing data...", containerId: "AdminContainer" })
        await handleMerge(false)
        toast.update(loading, { render: 'Data replaced successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
    }

    const mutate = async () => {
        await mutateUsers()
        await mutateMedia()
        await mutateEpisodes()
    }

    return (
        <AdminLayout pageName="manage">
            <div className="w-full h-fit flex flex-col gap-4">
                <div className="w-full h-full grid grid-cols-3 gap-4">
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaUserGroup size={20} />
                            User <span className="hidden md:block">:</span>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {users?.length} entrie{users?.length > 0 ? "s" : ""}
                        </div>
                        <div className="text-sm text-center text-white">
                            Last entry : <span className="text-cyan-400 font-bold">{!isUndefined(users) ? new Date(users[0]?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}</span>
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <BiMovie size={20} />
                            Media <span className="hidden md:block">:</span>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {media?.length} entrie{media?.length > 0 ? "s" : ""}
                        </div>
                        <div className="text-sm text-center text-white line-clamp-2">
                            <p className="line-clamp-2">
                                Latest entry : <span className="font-bold text-cyan-400">{!isUndefined(media) ? media[media.length - 1]?.title : "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <BiMovie size={20} />
                            Serie_EP <span className="hidden md:block">:</span>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {episodes?.length} entrie{episodes?.length > 0 ? "s" : ""}
                        </div>
                        <div className="text-sm text-center text-white">
                            Last entry : <span className="text-cyan-400 font-bold">{!isUndefined(episodes) ? new Date(episodes[0]?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit rounded-md flex flex-col gap-4 bg-slate-800 p-4">
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-white text-xl">Actions :</p>
                        <button onClick={() => { mutate() }} className="p-1 px-6 flex flex-row gap-2 group items-center justify-center rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                            <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                            Refresh
                        </button>
                    </div>
                    <div className="flex overflow-x-scroll scrollbar-hide">
                        <div onClick={() => { toggleImport() }} className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-green-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Full DB Setup</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BsDatabaseFillUp size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Import multiple JSON files.
                                </div>
                            </div>
                        </div>
                        <div onClick={fullBackup} className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-green-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Full DB Backup</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BsDatabaseFillDown size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Export DBs to JSON files.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => { router.push("users") }} className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Manage Users</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <RiUserSettingsFill size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Edit, remove, create users.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => { router.push("media") }} className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Manage Media</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdOutlineVideoSettings size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Edit, remove, create media.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => setDummyDemo(true)} className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className={`w-full h-full flex flex-col justify-between items-center overflow-hidden rounded-md bg-slate-600`}>
                                    <div className="w-full text-white text-lg text-center my-2 font-semibold">Set up dummy demo</div>
                                    <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                        <PiRabbitFill size={35} />
                                    </div>
                                    <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                        Demo with &quot;Big bug Bunny&quot; videos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${dummyDemo ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${dummyDemo ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 flex items-center`}>
                    <div onClick={() => { setDummyDemo(false) }} className="fixed top-0 left-0 right-0 bottom-0 z-40"></div>
                    <div className="w-[80%] md:w-[35%] h-fit flex flex-col gap-4 py-4 p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-400 text-black rounded-md m-auto z-50">
                        <div className="w-full flex flex-row items-center justify-between px-4 ">
                            <div className="flex flex-col">
                                <p className="font-semibold text-xl">
                                    Big Buck Dummy demo
                                </p>
                            </div>
                            <div onClick={() => { setDummyDemo(false) }} className="p-2 cursor-pointer hover:bg-cyan-600 rounded-md transition-all duration-300">
                                <RxCross2 />
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="w-ful flex flex-col gap-2 items-center">
                            <div className="text-pink-600">
                                <PiRabbitFill size={50} />
                            </div>
                            <div className="text-2xl font-semibold">
                            </div>
                            <div className="text-md font-light px-4">
                                You will now setup a demonstration of <span className="font-bold text-pink-600">Kraken Bay</span> using a random amount of movies and TV Shows.
                                <br />
                                All files will link to an external video reference. For this to work, you need to be connected to the internet.
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="flex flex-row items-center gap-2 text-md font-semibold leading-none px-4">
                            <IoWarning className="text-orange-400" />
                            Attention, this action will purge the Media database & the Serie_EP database.
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="w-full flex flex-col gap-2 px-4">
                            <div className="w-full flex flex-row gap-2 items-center font-light">
                                <input id="dummyCheck" onClick={(e) => setDummyCheck(e.currentTarget.checked)} type="checkbox" />
                                <label htmlFor="dummyCheck">I understand the risk and I wish to continue.</label>
                            </div>
                            <button disabled={!dummyCheck} onClick={() => { runDummy() }} className="w-full flex flex-row items-center justify-center gap-2 text-black font-semibold px-8 py-1 border-[1px] border-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 disabled:hover:text-black disabled:hover:border-cyan-400 hover:bg-purple-500 hover:border-purple-600 hover:text-white rounded-md bg-cyan-500 transition-all duration-200">
                                Let&apos;s go !
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div onKeyDown={(e) => { if (e.key == "Escape") toggleImport() }} className={`${importAction ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 overflow-auto flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${importAction ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 h-auto flex items-center`}>
                    <div onClick={() => toggleImport()} className="fixed top-0 left-0 right-0 bottom-0 z-40"></div>
                    <div className="w-[80%] md:w-[50%] max-h-fit m-auto py-10 overflow-y-auto z-50">
                        <div className="flex flex-col gap-4 py-4 bg-slate-700 border-[1px] border-slate-400 text-slate-300 rounded-md">
                            <div className="w-full flex flex-row items-center justify-between px-4 ">
                                <div className="flex flex-col">
                                    <p className="font-semibold text-xl">
                                        Import multiple JSON files
                                    </p>
                                </div>
                                <div onClick={() => toggleImport()} className="p-2 cursor-pointer hover:bg-slate-600 rounded-md transition-all duration-300">
                                    <RxCross2 />
                                </div>
                            </div>
                            <hr className="border-[1px] border-slate-400" />
                            <div className="w-ful flex flex-col gap-4 items-center">
                                <div className="text-slate-400 h-24">
                                    <img src="/Assets/Images/kraken.png" className="max-h-full max-w-full" alt="" />
                                </div>
                            </div>
                            {jsonFiles.length > 0 && <hr className="border-[1px] border-slate-400" />}
                            {jsonFiles.length > 0 &&
                                <div className="w-full h-fit px-4">
                                    <table className="w-full max-h-[50%] table-fixed relative border-separate border-spacing-y-2 border-spacing-x-2">
                                        <thead className="top-0 sticky bg-slate-700 w-full">
                                            <tr>
                                                <td className="w-[70%]">File</td>
                                                <td className="w-[20%]">Database</td>
                                                <td className="w-[10%]">Data</td>
                                            </tr>
                                        </thead>
                                        <tbody className="w-full overflow-y-scroll">
                                            {jsonFiles.map((file) => (
                                                <tr key={file.key} className="">
                                                    <td className="">
                                                        <div onClick={() => { handleRemove(file.key) }} className={`w-fit pl-2 pr-4 grid grid-cols-[5%_95%] gap-4 items-center p-1 rounded-lg ${file.target == "Unknown" ? "bg-red-500 border-red-600 text-white" : "bg-slate-600 border-slate-400"} border-[1px] hover:bg-red-500 hover:border-red-600 hover:text-white transition-all duration-300 cursor-pointer`}>
                                                            <RxCross2 />
                                                            <p className="text-sm font-light truncate text-ellipsis">{file.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className={`truncate text-ellipsis ${file.target == "Unknown" ? "text-red-500" : ""}`}>{file.target}</td>
                                                    <td className={file.target == "Unknown" ? "text-red-500" : ""}>{file.target == "User" ? file.data.Users.length.toString() : file.target == "Media" ? file.data.Titles.length.toString() : file.target == "Serie_EP" ? file.data.Episodes.length.toString() : "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>}
                            <hr className="border-[1px] border-slate-400" />
                            {jsonFiles.length == 0 ?
                                <div className="w-full px-4">
                                    <input onChange={handleImport} ref={jsonImportRef} type="file" multiple accept="application/json" className="hidden" />
                                    <button onClick={() => jsonImportRef.current?.click()} className="w-full px-4 py-2 rounded-md bg-slate-800 border-2 border-slate-900 text-md text-slate-400 font-semibold hover:bg-slate-900 hover:border-slate-950 hover:text-slate-300 transition-all duration-300">Select your files</button>
                                </div>
                                :
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
                                </div>}
                            <div className={replaceAction ? "w-full px-4 flex flex-col gap-2 transition-all duration-200" : "hidden"}>
                                <div className="flex flex-row items-center gap-2 text-sm font-light leading-none">
                                    <IoWarning className="text-orange-400" />
                                    This will purge databases. Use with caution !
                                </div>
                                <button onClick={() => { handleReplace() }} className="w-full flex flex-row items-center justify-center gap-2 text-red-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">
                                    Confirm my choice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}