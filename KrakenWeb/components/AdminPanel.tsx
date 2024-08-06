import React, { useState } from "react"

import { RiDashboardFill, RiUserSettingsFill, RiPassPendingFill } from "react-icons/ri";
import { BsFillCloudUploadFill, BsDatabaseFillGear } from "react-icons/bs";
import { BiSolidServer } from "react-icons/bi";
import { MdMovie, MdOutlineMenu } from "react-icons/md";
import { FaTools, FaHome, FaChevronLeft } from "react-icons/fa";

interface AdminPanelProps {
    user: any
}

const AdminPanel: React.FC<AdminPanelProps> = ({
    user
}) => {

    const [dispSize, setDispSize] = useState(15)
    const [active, setActive] = useState("")
    const pendingUsers = 0
    const pendingUploads = 0

    return (
        <div className="absolute left-0 top-0 h-full md:w-[20%] lg:w-[15%] bg-slate-800 flex flex-col gap-4 py-2 z-50">
            <div className="relative grid grid-cols-[25%_75%] p-2 z-50">
                <div className="w-[80%] p-2">
                    <img className="max-w-full rounded-full bg-neutral-800" src={user?.image || "/Assets/Images/default_profile.png"} alt="" />
                </div>
                <div className="flex flex-col my-auto space-y-0">
                    <p className="font-bold text-2xl leading-none">{user?.name}</p>
                    <p className="font-light text-red-400 text-sm leading-none">Administrator</p>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <p className="mx-2 font-semibold text-sm text-neutral-400">Kraken Bay</p>
                    <ul className="cursor-pointer px-2 space-y-1">
                        <li onClick={() => setActive("Dashboard")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "Dashboard" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <RiDashboardFill size={dispSize} />
                            Dashboard
                        </li>
                        <li onClick={() => setActive("PendingUsers")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "PendingUsers" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <RiPassPendingFill size={dispSize} />
                            Users
                            <div className={`${pendingUsers > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                                <p className="m-auto rounded-full">{pendingUsers}</p>
                            </div>
                        </li>
                        <li onClick={() => setActive("Uploads")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "Uploads" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <BsFillCloudUploadFill size={dispSize} />
                            Uploads
                            <div className={`${pendingUploads > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                                <p className="m-auto rounded-full">{pendingUploads}</p>
                            </div>
                        </li>
                        <li onClick={() => setActive("Server")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "Server" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <BiSolidServer size={dispSize} />
                            Server
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="mx-2 font-semibold text-sm text-neutral-400">Databases</p>
                    <ul className="cursor-pointer px-2">
                        <li onClick={() => setActive("MediaDB")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "MediaDB" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <MdMovie size={dispSize} />
                            Media DB
                        </li>
                        <li onClick={() => setActive("UserDB")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "UserDB" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <RiUserSettingsFill size={dispSize} />
                            User DB
                        </li>
                        <li onClick={() => setActive("ManageDB")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "ManageDB" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <BsDatabaseFillGear size={dispSize} />
                            Manage DBs
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="mx-2 font-semibold text-sm text-neutral-400">Settings</p>
                    <ul className="cursor-pointer px-2">
                        <li onClick={() => setActive("Config")} className={`w-full rounded-md flex flex-row items-center gap-2 ${active == "Config" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                            <FaTools size={dispSize} />
                            Config
                        </li>
                        <li className="w-full rounded-md flex flex-row items-center gap-2 hover:bg-red-500 px-4 py-2 font-semibold transition-all duration-200">
                            <FaHome size={dispSize} />
                            Go Home
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel;