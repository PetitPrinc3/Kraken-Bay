import { AdminLayout } from "@/pages/_app";
import { MdOutlineVideoSettings, MdRefresh } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri"
import { BsDatabaseFillUp, BsDatabaseFillDown } from "react-icons/bs";
import { useRouter } from "next/router";
import { BiMovie } from "react-icons/bi";
import { PiRabbitFill } from "react-icons/pi";
import { IoWarning } from "react-icons/io5";
import 'reactflow/dist/style.css';
import useUsers from "@/hooks/useUsers";
import useMedia from "@/hooks/useMedia";
import { isUndefined } from "lodash";
import { RxCross2 } from "react-icons/rx";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Manage() {
    const router = useRouter()
    const { data: users, mutate: mutateUsers } = useUsers()
    const { data: media, mutate: mutateMedia } = useMedia()
    const { data: episodes, mutate: mutateEpisodes } = useMedia()

    const [dummyDemo, setDummyDemo] = useState(false)
    const [dummyCheck, setDummyCheck] = useState(false)

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

    const mutate = async () => {
        await mutateUsers()
        await mutateMedia()
        await mutateEpisodes()
    }

    console.log(users)

    return (
        <AdminLayout pageName="manage">
            <div className="w-full h-fit flex flex-col gap-4">
                <div className="w-full h-full grid grid-cols-3 gap-4">
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaUserGroup size={20} />
                            User :
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
                            Media :
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {media?.length} entrie{media?.length > 0 ? "s" : ""}
                        </div>
                        <div className="text-sm text-center text-white truncate text-ellipsis">
                            Latest entry : <span className="font-bold text-cyan-400">{!isUndefined(media) ? media[0]?.title : "N/A"}</span>
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <BiMovie size={20} />
                            Serie_EP :
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
                        <div className="inline-block px-3">
                            <div className="w-60 h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-green-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Full DB Setup</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BsDatabaseFillUp size={35} />
                                </div>
                                <div className="p-2 text-white text-sm font-light">
                                    Import multiple JSON files.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block px-3">
                            <div className="w-60 h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-green-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Full DB Backup</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BsDatabaseFillDown size={35} />
                                </div>
                                <div className="p-2 text-white text-sm font-light">
                                    Export DBs to JSON files.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => { router.push("users") }} className="inline-block px-3">
                            <div className="w-60 h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Manage Users</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <RiUserSettingsFill size={35} />
                                </div>
                                <div className="p-2 text-white text-sm font-light">
                                    Edit, remove, create users.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => { router.push("media") }} className="inline-block px-3">
                            <div className="w-60 h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Manage Media</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdOutlineVideoSettings size={35} />
                                </div>
                                <div className="p-2 text-white text-sm font-light">
                                    Edit, remove, create media.
                                </div>
                            </div>
                        </div>
                        <div onClick={() => setDummyDemo(true)} className="inline-block px-3">
                            <div className="w-60 h-64 max-w-xs p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className={`w-full h-full flex flex-col justify-between items-center overflow-hidden rounded-md bg-slate-600`}>
                                    <div className="w-full text-white text-lg text-center my-2 font-semibold">Set up dummy demo</div>
                                    <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                        <PiRabbitFill size={35} />
                                    </div>
                                    <div className="p-2 text-white text-sm font-light">
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
                    <div className="w-[35%] h-fit flex flex-col gap-4 py-4 p-[2px] bg-gradient-to-tr from-purple-500 to-cyan-400 text-black rounded-md m-auto z-50">
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
        </AdminLayout>
    )
}