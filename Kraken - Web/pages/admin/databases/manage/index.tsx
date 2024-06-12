import { AdminLayout } from "@/pages/_app";
import { MdOutlineVideoSettings, MdRefresh } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri"
import { BsDatabaseFillUp, BsDatabaseFillDown } from "react-icons/bs";
import { useRouter } from "next/router";
import { BiMovie } from "react-icons/bi";
import { PiRabbitFill } from "react-icons/pi";
import 'reactflow/dist/style.css';
import useUsers from "@/hooks/useUsers";
import useMedia from "@/hooks/useMedia";
import { isUndefined } from "lodash";

export default function Manage() {
    const router = useRouter()
    const { data: users, mutate: mutateUsers } = useUsers()
    const { data: media, mutate: mutateMedia } = useMedia()
    const { data: episodes, mutate: mutateEpisodes } = useMedia()

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
                            Last update : <span className="text-cyan-400 font-bold">{!isUndefined(users) ? new Date(users[0]?.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}</span>
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
                            Last update : <span className="text-cyan-400 font-bold">{!isUndefined(episodes) ? new Date(episodes[0]?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}</span>
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
                        <div className="inline-block px-3">
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
        </AdminLayout>
    )
}