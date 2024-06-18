import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { IoPower } from "react-icons/io5";
import { FaWindows, FaLinux, FaServer, FaCircle, FaWifi } from "react-icons/fa";
import { MdOutlineRestartAlt, MdFolderShared, MdRefresh } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { BsDatabaseFillGear } from "react-icons/bs";
import { useRouter } from "next/router";

const formatUptime = (serverUptime: any) => {
    var d = Math.floor(serverUptime / (3600 * 24));
    var h = Math.floor(serverUptime % (3600 * 24) / 3600);
    var m = Math.floor(serverUptime % 3600 / 60);
    var s = Math.floor(serverUptime % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";

    return dDisplay + hDisplay + mDisplay;
}

export default function Accounts() {
    const { data: serverProps, mutate: mutateProps } = useServerProps()
    const router = useRouter()

    if (isUndefined(serverProps)) return null

    const OsIcon = serverProps.osPlatform == "win32" ? FaWindows : FaLinux
    return (
        <AdminLayout pageName="server" >
            <div className="flex flex-col h-full w-full gap-4">
                <div className="w-full h-full grid grid-cols-3 gap-4">
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaServer />
                            Host :
                        </div>
                        <div className="text-xl md:text-2xl font-semibold text-center">
                            {serverProps.osHostName}
                        </div>
                        <div className="hidden md:block text-sm text-center text-white">
                            Last reboot was <span className="text-green-500 font-bold">{formatUptime(serverProps.osUptime)}</span> ago.
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <OsIcon />
                            <p className="hidden md:block">Platform :</p>
                            <p className="block md:hidden">OS :</p>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {serverProps.osPlatform}
                        </div>
                        <div className="text-sm text-center text-green-500 font-bold">
                            {serverProps.osBuild}
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <IoPower />
                            <p className="hidden md:block">Server Uptime :</p>
                            <p className="block md:hidden">Up :</p>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {formatUptime(serverProps.serverUptime)}
                        </div>
                        <div className="hidden md:block text-sm text-center">
                            Last reboot on <span className="text-green-500 font-bold">{new Date(new Date().getTime() - serverProps.serverUptime * 1000).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>.
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit rounded-md flex flex-col gap-4 bg-slate-800 p-4">
                    <div className="w-full flex flex-row items-center justify-between">
                        <p className="text-white text-xl">Server Actions :</p>
                        <button onClick={() => { mutateProps() }} className="p-1 px-6 flex flex-row gap-2 group items-center justify-center rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                            <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                            Refresh
                        </button>
                    </div>
                    <div className="flex overflow-x-scroll scrollbar-hide">
                        <div className="inline-block px-3">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Reboot server</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdOutlineRestartAlt size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Perform reboot at os level.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block px-3">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${serverProps.hotSpot ? "border-green-500" : "border-orange-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Toggle Hostspot</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <FaWifi size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Hotspot is currently <span className={serverProps.hotSpot ? "text-green-500 font-semibold" : "text-orange-500 font-semibold"}>{serverProps.hotSpot ? "on" : "off"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block px-3">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${serverProps.smbStatus ? "border-green-500" : "border-red-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Samba <span className="hidden md:block">Service</span></div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdFolderShared size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Samba is currently <span className={serverProps.smbStatus ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{serverProps.smbStatus ? "up" : "down"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block px-3">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 border-green-500 bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Web <span className="hidden md:block">Service</span></div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <TbWorld size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Restart web server with systemctl.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block px-3">
                            <div onClick={() => router.push("/admin/databases/manage")} className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">DB Management</div>
                                <div className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BsDatabaseFillGear size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Manage databases.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}