import { AdminLayout } from "@/pages/_app";
import axios from "axios";
import { isUndefined } from "lodash";
import { useState, useRef } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import useUsers from "@/hooks/useUsers";
import { MdRefresh, MdSearch, MdOutlineEdit, MdSync, MdBlock } from "react-icons/md";
import { BsPersonPlusFill, BsDatabaseFillX, BsDatabaseFillAdd } from "react-icons/bs";
import { BiMovie, BiSolidFileJson } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { FaUserGroup } from "react-icons/fa6";
import { IoWarning, IoGitMerge, IoGitPullRequest } from "react-icons/io5";
import { HiOutlineTrash } from "react-icons/hi2";
import { TbDatabaseImport, TbDatabaseExport } from "react-icons/tb";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const q = searchParams.get("q");
    const { data: users, mutate: mutateUsers } = useUsers({ searchText: q });
    const [purgeAction, setPurgeAction] = useState(false)
    const [purgeValidation, setPurgeValidation] = useState("")
    const [importAction, setImportAction] = useState(false)
    const [replaceAction, setReplaceAction] = useState(false)
    const [importData, setImportData] = useState<any>()
    const jsonImportRef = useRef<HTMLInputElement>(null)

    const handleSearch = (e: any) => {
        if (e.target.value) {
            searchParams.set("q", e.target.value);
            router.replace(`${pathname}?${searchParams}`);
        } else {
            router.replace(`${pathname}`);
        }
    }

    const blockUser = async (userId: string, userRole: string) => {
        await axios.post("/api/users", { userData: { id: userId, roles: userRole } }).catch((err) => {
            toast.clearWaitingQueue()
            toast.error("Something went wrong.", { containerId: "AdminContainer" })
        }).then((data) => {
            if (!isUndefined(data)) {
                toast.clearWaitingQueue()
                toast.success("User blocked.", { containerId: "AdminContainer" })
                mutateUsers()
            }
        })
    }

    const jsonExport = () => {
        const jsonData = JSON.stringify({
            "Users": users
        }, null, 4)
        const exportData = new Blob([jsonData])
        const downloader = window.document.createElement("a")
        downloader.href = window.URL.createObjectURL(exportData);
        const now = new Date()
        downloader.download = now.toLocaleDateString("fr", { year: "numeric", month: "2-digit", day: "2-digit" }).split("/").reverse().join("") + "_" + now.getUTCHours().toString() + "Z" + now.getUTCMinutes().toString() + "_KrakenUsers_Export.json"
        document.body.appendChild(downloader)
        downloader.click()
        document.body.removeChild(downloader)
    }

    const purgeUser = async (userId?: string) => {
        if (purgeAction && purgeValidation == "Kraken/User") {
            const loading = toast.loading("Purging database...", { containerId: "AdminContainer" })
            await axios.delete("/api/users").catch((err) => {
                toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.update(loading, { render: 'DB purged.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
                    setPurgeAction(false)
                    setPurgeValidation("")
                    mutateUsers()
                }
            })
        } else if (!isUndefined(userId)) {
            await axios.delete("/api/users", { params: { userId: userId } }).catch((err) => {
                toast.clearWaitingQueue()
                toast.error("Something went wrong.", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.clearWaitingQueue()
                    toast.success("Entry removed.", { containerId: "AdminContainer" })
                    setPurgeAction(false)
                    setPurgeValidation("")
                    mutateUsers()
                }
            })
        }
    }

    const jsonImport = async (e: any) => {
        const jsonFile = e.target.files[0] as File
        const jsonInput = JSON.parse(await jsonFile.text())
        if (isUndefined(jsonInput?.Users)) {
            toast.error("Invalid JSON file.", { containerId: "AdminContainer" })
            return
        } else {
            setImportData(jsonInput.Users)
            setImportAction(true)
        }
        if (!isUndefined(jsonImportRef.current?.files)) jsonImportRef.current.value = ""
    }

    const handleMerge = async (tstr: boolean = true) => {
        setReplaceAction(false)
        const loading = tstr ? toast.loading("Merging data...", { containerId: "AdminContainer" }) : undefined
        for (let i = 0; i < importData.length; i++) {
            await axios.post("/api/users", { userData: importData[i] }).catch((err) => {
                !isUndefined(loading) && toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
            })
        }
        mutateUsers()
        !isUndefined(loading) && toast.update(loading, { render: 'Data merged successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
    }

    const handleReplace = async () => {
        const loading = toast.loading("Replacing data...", { containerId: "AdminContainer" })
        await axios.delete("/api/users").catch((err) => {
            toast.update(loading, { render: 'Oops, something went wrong...', type: "error", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
        }).then((data) => {
            if (!isUndefined(data)) {
                toast.clearWaitingQueue()
            }
        })
        handleMerge(false)
        toast.update(loading, { render: 'Data replaced successfully.', type: "success", isLoading: false, autoClose: 2000, containerId: "AdminContainer" })
    }

    return (
        <AdminLayout pageName="users" >
            <div className="w-full h-fit max-h-full flex flex-col p-4 gap-4 rounded-md bg-slate-800">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-[50%] md:w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input onChange={(e) => handleSearch(e)} type="text" className="bg-transparent text-white focus:outline-none w-full" placeholder="Search for user..." />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <div onClick={jsonExport} className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
                            <TbDatabaseExport />
                            <p className="hidden md:block">
                                Export <span className="hidden lg:inline-block">as JSON</span>
                            </p>
                        </div>
                        <div onClick={() => { jsonImportRef.current?.click() }} className="flex flex-row items-center gap-2 px-2 py-1 rounded-md bg-slate-600 border-2 border-slate-500 cursor-pointer hover:bg-slate-500 hover:border-slate-400 transition-all duration-300">
                            <input onChange={jsonImport} ref={jsonImportRef} type="file" accept=".json" className="hidden" />
                            <TbDatabaseImport />
                            <p className="hidden md:block">
                                Import <span className="hidden lg:inline-block">from JSON</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full max-h-[70vh] md:h-[55vh] overflow-y-scroll overflow-x-clip">
                    <table className="w-full max-h-full table-fixed relative border-separate border-spacing-y-4">
                        <thead className="top-0 sticky bg-slate-800 w-full">
                            <tr className="text-white font-semibold ">
                                <td className="w-[35%]">Name</td>
                                <td className="w-[25%]">Email</td>
                                <td className="max-md:hidden w-[15%] text-center">Created At</td>
                                <td className="w-[15%] md:w-[10%] text-center">Roles</td>
                                <td className="w-[25%] md:w-[15%]"></td>
                            </tr>
                        </thead>
                        <tbody className="w-full text-white">
                            {(users || []).map((user: any) => (
                                <tr key={user?.id}>
                                    <td className="grid grid-cols-[20%_80%] items-center font-semibold truncate text-ellipsis">
                                        <div className="h-6 w-6 rounded-md overflow-hidden">
                                            <img src={user.image || "/Assets/Images/default_profile.png"} className="w-6 h-auto" alt="" />
                                        </div>
                                        <p className="truncate text-ellipsis">{user?.name}</p>
                                    </td>
                                    <td className="font-light truncate text-ellipsis">
                                        {user?.email}
                                    </td>
                                    <td className="max-md:hidden text-center text-slate-400 truncate text-ellipsis">
                                        {new Date(user?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className={`${user?.roles == "admin" ? "text-red-500" : user?.roles == "user" ? "text-green-500" : "text-blue-500"} text-center truncate text-ellipsis`}>
                                        {user?.roles || "pending"}
                                    </td>
                                    <td className="flex flex-row items-center justify-center gap-2">
                                        <div onClick={() => router.push(`./users/edit/${user.id}`)} className="p-1 rounded-lg bg-slate-600 border-[1px] border-slate-400 hover:bg-blue-500 hover:border-blue-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <MdOutlineEdit />
                                        </div>
                                        <div onClick={() => { blockUser(user.id, user.roles == "" ? "user" : "") }} className={`p-1 rounded-lg border-[1px] ${user.roles == "" ? "bg-orange-500 border-orange-600" : "bg-slate-600 border-slate-400 hover:bg-orange-500 hover:border-orange-600"} hover:text-white transition-all duration-300 cursor-pointer`}>
                                            <MdBlock />
                                        </div>
                                        <div onClick={() => { purgeUser(user.id) }} className="p-1 rounded-lg bg-slate-600 border-[1px] border-slate-400 hover:bg-red-500 hover:border-red-600 hover:text-white transition-all duration-300 cursor-pointer">
                                            <HiOutlineTrash />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full h-fit flex flex-row items-center justify-between px-4">
                    <button onClick={() => { mutateUsers() }} className="w-[25%] md:w-[15%] flex flex-row gap-2 group items-center justify-center p-1 px-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                        <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                        Refresh
                    </button>
                    <button onClick={() => { router.push("/admin/access/add") }} className="w-[25%] md:w-[15%] flex flex-row gap-2 items-center justify-center p-1 px-2 rounded-md bg-green-500 border-2 border-green-600 text-sm hover:bg-green-400 transition-all duration-100">
                        <BsPersonPlusFill className="hidden lg:block transition-all duration-300" size={18} />
                        Add New
                    </button>
                    <button onClick={() => { setPurgeAction(true) }} className="w-[25%] md:w-[15%] flex flex-row gap-2 group items-center justify-center p-1 px-2 rounded-md bg-red-500 border-2 border-red-600 text-sm hover:bg-red-400 transition-all duration-100">
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
                                    Purge User Database
                                </p>
                                <div className="flex flex-row items-center gap-2 text-xs font-light leading-none">
                                    <IoWarning className="text-orange-400" />
                                    This will remove every user except your current user.
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
                                Kraken/User
                            </div>
                            <div className="flex flex-row gap-2 items-center text-md font-light">
                                <FaUserGroup className="text-slate-400" size={20} />
                                {users?.length} entries
                            </div>
                        </div>
                        <hr className="border-[1px] border-slate-400" />
                        <div className="flex flex-col gap-2 px-4">
                            <p className="font-semibold">
                                To confirm, type &quot;Kraken/User&quot; in the box below
                            </p>
                            <input value={purgeValidation} onChange={(e) => setPurgeValidation(e.currentTarget.value)} type="text" className="rounded-md h-8 border-[1px] border-red-500 bg-slate-800 px-4 text-slate-300 font-semibold focus:outline-none" />
                        </div>
                        <div className="px-4">
                            <button onClick={() => purgeUser()} disabled={purgeValidation != "Kraken/User"} className="w-full text-red-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:text-red-500 disabled:hover:border-slate-500 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">Puge this database</button>
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
                        <div className="w-ful flex flex-col gap-2 items-center">
                            <div className="text-slate-400">
                                <BsDatabaseFillAdd size={30} />
                            </div>
                            <div className="text-2xl font-semibold">
                                Kraken/User
                            </div>
                            <div className="flex flex-row gap-8">
                                <div className="flex flex-row gap-2 items-center text-md font-light">
                                    <BiMovie className="text-slate-400" size={20} />
                                    {users?.length} entries
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
                                This will purge the User database. Use with caution !
                            </div>
                            <button onClick={() => { handleReplace() }} className="w-full flex flex-row items-center justify-center gap-2 text-red-500 font-semibold px-8 py-1 border-[1px] border-slate-500 disabled:opacity-50 disabled:hover:bg-slate-800 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-md bg-slate-800 transition-all duration-200">
                                Confirm my choice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}