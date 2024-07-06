import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { IoPower } from "react-icons/io5";
import { BiWifi, BiWifi0, BiWifi1, BiWifi2, BiWifiOff } from "react-icons/bi";
import { FaWindows, FaLinux, FaServer } from "react-icons/fa";
import { MdOutlineRestartAlt, MdFolderShared, MdRefresh } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { BsDatabaseFillGear } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";

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
                    <div className="w-full h-full bg-slate-800 flex flex-col justify-between text-white rounded-md gap-4 p-4 cursor-default">
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
                    <div className="w-full h-full bg-slate-800 flex flex-col justify-between text-white rounded-md gap-4 p-4 cursor-default">
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
                    <div className="w-full h-full bg-slate-800 flex flex-col justify-between text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaServer />
                            Connectivity :
                        </div>
                        {
                            serverProps.connectivity == null ?
                                <div className="w-12 h-12 m-auto">
                                    <svg viewBox="0 0 255.73 255.47">
                                        <rect className="fill-none" width="255.73" height="255.47" />
                                        <path className="fill-orange-500"
                                            d="M128.73,179.27a20,20,0,1,0,.19,40,20.4,20.4,0,0,0,19.83-20.16A20.1,20.1,0,0,0,128.73,179.27Zm.41,26a6.1,6.1,0,0,1-6-6.18,5.89,5.89,0,0,1,11.77.18A6.09,6.09,0,0,1,129.14,205.23Z"
                                            transform="translate(0.08 -0.12)" />
                                        <path className="fill-orange-500"
                                            d="M255,127.76A126.25,126.25,0,1,0,128.71,254,126.39,126.39,0,0,0,255,127.76Zm-237.5,0A111.2,111.2,0,0,1,212.13,54.25L181.36,77.81a112.94,112.94,0,0,0-48.59-11.33c-37.13-.22-68.51,14.6-96.2,38.33-4,3.41-4.32,8.23-1.24,11.8s8.05,3.7,12.13.1A143.57,143.57,0,0,1,83.62,93.4c28.43-12.81,56.17-14.74,83-4.33l-23.09,17.68a111.72,111.72,0,0,0-14.68-1.29c-1.85,0-3.7-.09-5.54,0-2.08.13-4.16.41-6.23.68a91.59,91.59,0,0,0-52.77,24.9c-3.94,3.75-4.32,8.34-1.13,11.75s7.53,3.21,11.55-.12c2.55-2.13,5.09-4.28,7.8-6.19,13-9.17,27.05-14.77,42.38-15.5L36,189.13A110.63,110.63,0,0,1,17.46,127.76ZM129,239a111,111,0,0,1-83.95-38l41.83-32a8.23,8.23,0,0,0,.86,1.13c2.88,3.19,7,3.56,10.61.88,1.28-1,2.42-2.09,3.69-3.07,10.17-7.9,21.41-11.93,34.42-9.26,8.55,1.76,15.65,6.25,22.17,11.89a7.46,7.46,0,0,0,10.62-.34,7.65,7.65,0,0,0,0-10.7c-9.6-10.33-21.44-15.33-34.59-17a49.89,49.89,0,0,0-12.57.1l-1,.14,25.64-19.63c13.38,3.36,25.11,10.19,35.78,19.3,4.22,3.59,8.69,3.66,11.8.27s2.53-8.21-1.52-12A90.52,90.52,0,0,0,162,111.51l19.82-15.17q3.42,1.93,6.81,4.16c6.14,4,11.75,8.91,17.54,13.5,2.9,2.3,5.95,2.87,9.26,1.25l.09,0a7.71,7.71,0,0,0,3-10.82,13.64,13.64,0,0,0-2-2.66,81.8,81.8,0,0,0-8.15-6.92q-6.24-4.89-12.76-9.06l25.63-19.62A110.64,110.64,0,0,1,239.93,130C238.73,190.18,189.19,238.84,129,239Z"
                                            transform="translate(0.08 -0.12)" />
                                    </svg>
                                </div> :
                                <div className="w-10 h-10 m-auto">
                                    <svg viewBox="0 0 255.73 255.47">
                                        <rect className="fill-none" width="255.73" height="255.47" />
                                        <path className={serverProps.connectivity > 75 ? "fill-green-500" : "fill-white"} d="M251.8,80.14a10.43,10.43,0,0,1-4,14.67l-.11.06c-4.48,2.19-8.61,1.42-12.53-1.69C227.31,87,219.72,80.39,211.4,74.92c-45.46-29.88-93-31.71-142-9.61A194.55,194.55,0,0,0,20.45,96.84c-5.52,4.87-12.16,4.78-16.4-.13s-3.71-11.35,1.67-16C43.17,48.65,85.62,28.61,135.83,28.9c38.62.23,72.26,14.74,102.31,38.32a111.35,111.35,0,0,1,11,9.36A18.7,18.7,0,0,1,251.8,80.14Z" transform="translate(0.08 -0.12)" />
                                        <path className={serverProps.connectivity > 50 ? "fill-green-500" : "fill-white"} d="M130.57,81.63c33,.72,62.18,11.34,86.48,34.2,5.47,5.15,6.31,11.64,2.06,16.26s-10.26,4.49-16-.37c-17.45-14.89-37-25.3-60-28.33-27.88-3.66-52.61,4.35-75.2,20.23-3.67,2.58-7.1,5.5-10.56,8.37-5.42,4.5-11.46,4.61-15.62.17-4.3-4.62-3.79-10.83,1.53-15.89,20.07-19.09,44-30.16,71.38-33.68,2.8-.36,5.61-.75,8.43-.93C125.57,81.51,128.08,81.63,130.57,81.63Z" transform="translate(0.08 -0.12)" />
                                        <path className={serverProps.connectivity > 25 ? "fill-green-500" : "fill-white"} d="M123.27,131.75a56.93,56.93,0,0,1,12.65-.18c18.8,1.86,35.72,8.59,49.32,23.22a10.35,10.35,0,0,1,0,14.47c-3.88,4.05-9.82,4.4-14.38.45-8.81-7.61-18.41-13.7-30-16.07-17.59-3.61-32.8,1.84-46.56,12.53-1.71,1.32-3.26,2.85-5,4.14-4.84,3.63-10.45,3.13-14.35-1.19-3.69-4.09-3.76-9.54.24-14,11.24-12.44,25.47-19.48,41.8-22.5C119.07,132.28,121.15,132,123.27,131.75Z" transform="translate(0.08 -0.12)" />
                                        <path className={serverProps.connectivity > 5 ? "fill-green-500" : "fill-white"} d="M130.37,181.45a27.2,27.2,0,0,1,27.09,26.89c.07,14.58-12.33,27.18-26.83,27.28-14.69.1-27.2-12.12-27.33-26.71A27.29,27.29,0,0,1,130.37,181.45Zm8.38,27a8,8,0,0,0-15.92-.24,8,8,0,1,0,15.92.24Z" transform="translate(0.08 -0.12)" />
                                    </svg>
                                </div>
                        }
                        <div className="hidden md:block text-sm text-center">
                            Server is <span className={`${serverProps.connectivity == null ? "text-orange-500" : "text-green-500"} font-bold`}>{serverProps.connectivity == null ? "offline" : "online"}</span>.
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
                    <div className="flex gap-4 overflow-x-scroll scrollbar-hide">
                        <div className="inline-block">
                            <div className="w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-2 border-slate-500 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Reboot server</div>
                                <div onClick={() => axios.get("/api/serverProps", { params: { action: "reboot" } })} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdOutlineRestartAlt size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Perform reboot at os level.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${serverProps.hotSpot ? "border-green-500" : "border-orange-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Toggle Hostspot</div>
                                <div onClick={() => { axios.get("/api/serverProps", { params: { action: "toggleAP" } }); mutateProps() }} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <BiWifi size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Hotspot is currently <span className={serverProps.hotSpot ? "text-green-500 font-semibold" : "text-orange-500 font-semibold"}>{serverProps.hotSpot ? "on" : "off"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${serverProps.smbStatus ? "border-green-500" : "border-red-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Samba <span className="hidden md:block">Service</span></div>
                                <div onClick={() => axios.get("/api/serverProps", { params: { action: "restartSMB" } })} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdFolderShared size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Samba is currently <span className={serverProps.smbStatus ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{serverProps.smbStatus ? "up" : "down"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 border-green-500 bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Web <span className="hidden md:block">Service</span></div>
                                <div onClick={() => axios.get("/api/serverProps", { params: { action: "restartWEB" } })} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <TbWorld size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Restart node process.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
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