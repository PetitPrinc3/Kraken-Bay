import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { IoPower, IoSync } from "react-icons/io5";
import { BiWifi } from "react-icons/bi";
import { FaWindows, FaLinux, FaDocker } from "react-icons/fa";
import {
    MdFolderShared, MdRefresh,
    MdOutlineSignalWifiOff, MdOutlineSignalWifiStatusbarNull, MdOutlineNetworkWifi1Bar, MdOutlineNetworkWifi2Bar, MdOutlineNetworkWifi3Bar, MdOutlineSignalWifi4Bar,
    MdBatteryAlert, MdBattery20, MdBattery30, MdBattery50, MdBattery60, MdBattery80, MdBattery90, MdBatteryFull,
    MdBatteryCharging20, MdBatteryCharging30, MdBatteryCharging50, MdBatteryCharging60, MdBatteryCharging80, MdBatteryCharging90, MdBatteryChargingFull, MdBolt
} from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { BsDatabaseFillGear } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import { FaHardDrive } from "react-icons/fa6";
import Switch from "@/components/Switch";

const formatUptime = (serverUptime: any) => {
    var d = Math.floor(serverUptime / (3600 * 24));
    var h = Math.floor(serverUptime % (3600 * 24) / 3600);
    var m = Math.floor(serverUptime % 3600 / 60);
    var s = Math.floor(serverUptime % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m >= 0 ? m + "m " : "";

    return dDisplay + hDisplay + mDisplay;
}

export default function Accounts() {
    const { data: serverProps, mutate: mutateProps } = useServerProps()
    const router = useRouter()
    const [reboot, setReboot] = useState(false)
    const [power, setPower] = useState(false)
    const [SqlCtn, triggerSql] = useState(false)
    const [SrvCtn, triggerSrv] = useState(false)

    const rebootServer = async () => {
        await axios.get("/api/serverProps", { params: { action: "reboot" } })
        setPower(false)
        setReboot(true)
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            try {
                const test = await fetch(`http://${document.location.hostname}`)
                if (test.status == 200) {
                    setReboot(false)
                    break
                }
            } catch { }
        }
    }

    if (isUndefined(serverProps)) return null
    const PowerIcon = reboot ? IoSync : IoPower

    const OsIcon = serverProps.osPlatform == "win32" ? FaWindows : FaLinux

    return (
        <AdminLayout pageName="server" >
            <div className="flex flex-col h-full w-full gap-4">
                <div className="w-full h-36 md:h-48 relative">
                    <div className="absolute flex items-center left-0 right-0 top-0 bottom-0 rounded-md overflow-hidden">
                        <img className="w-full blur" src={`/Assets/Images/${serverProps.osPlatform == 'win32' ? 'windows_wallpaper.jpg' : 'ubuntu_wallpaper.jpg'}`} alt="" />
                    </div>
                    <div className="absolute left-4 top-4 flex flex-col gap-1">
                        <div className="flex flex-row items-baseline gap-1">
                            <div className="flex flex-row gap-4 items-baseline text-2xl font-semibold text-white leading-none">
                                <OsIcon size={20} />
                                {serverProps.osPlatform == "win32" ? "Windows" : "Linux"}
                            </div>
                            <span className="text-green-500 text-xs leading-none">{serverProps.osBuild}</span>
                        </div>
                        <div className="text-xs font-light text-white">
                            Hostname : {serverProps.osHostName}<br />
                            Uptime : {formatUptime(serverProps.osUptime)}
                        </div>
                    </div>
                    <div className="absolute right-4 top-4 flex items-center text-lg">
                        <div className="flex flex-row gap-4">
                            {serverProps.connectivity == null ?
                                <div className="flex flex-row items-center gap-1 group cursor-pointer">
                                    <div className="w-full overflow-hidden">
                                        <div className="translate-x-12 group-hover:translate-x-0 transition-all duration-200 text-xs font-semibold text-orange-500">offline</div>
                                    </div>
                                    <div className="text-orange-500">
                                        <MdOutlineSignalWifiOff />
                                    </div>
                                </div>
                                :
                                <div className="flex flex-row items-center gap-1 group cursor-pointer">
                                    <div className="w-full overflow-hidden">
                                        <div className="translate-x-12 group-hover:translate-x-0 transition-all duration-200 text-xs font-semibold text-green-500">online</div>
                                    </div>
                                    <div className="text-white">
                                        <div className={`${serverProps.connectivity < 5 ? "block" : "hidden"} m-auto`}>
                                            <MdOutlineSignalWifiStatusbarNull />
                                        </div>
                                        <div className={`${serverProps.connectivity >= 5 && serverProps.connectivity < 25 ? "block" : "hidden"} m-auto`}>
                                            <MdOutlineNetworkWifi1Bar />
                                        </div>
                                        <div className={`${serverProps.connectivity >= 25 && serverProps.connectivity < 50 ? "block" : "hidden"} m-auto`}>
                                            <MdOutlineNetworkWifi2Bar />
                                        </div>
                                        <div className={`${serverProps.connectivity >= 50 && serverProps.connectivity < 75 ? "block" : "hidden"} m-auto`}>
                                            <MdOutlineNetworkWifi3Bar />
                                        </div>
                                        <div className={`${serverProps.connectivity >= 75 ? "block" : "hidden"} m-auto`}>
                                            <MdOutlineSignalWifi4Bar />
                                        </div>
                                    </div>
                                </div>
                            }
                            {serverProps.battery.status ?
                                <div className="relative flex flex-col items-baseline group cursor-pointer">
                                    <div className="animate-pulse text-green-500 transition-all duration-200 group-hover:-translate-y-2">
                                        <div className={`${serverProps.battery.level < 25 ? "block" : "hidden"} text-orange-500`}>
                                            <MdBatteryCharging20 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 25 && serverProps.battery.level < 45 ? "block" : "hidden"} text-yellow-500`}>
                                            <MdBatteryCharging30 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 45 && serverProps.battery.level < 55 ? "block" : "hidden"}`}>
                                            <MdBatteryCharging50 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 55 && serverProps.battery.level < 75 ? "block" : "hidden"}`}>
                                            <MdBatteryCharging60 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 75 && serverProps.battery.level < 85 ? "block" : "hidden"}`}>
                                            <MdBatteryCharging80 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 85 && serverProps.battery.level < 95 ? "block" : "hidden"}`}>
                                            <MdBatteryCharging90 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 95 ? "block" : "hidden"}`}>
                                            <MdBatteryChargingFull />
                                        </div>
                                    </div>
                                    <div className="absolute top-2 w-fit overflow-hidden">
                                        <div className={`flex flex-row items-center gap-0 translate-y-12 group-hover:translate-y-0 transition-all duration-200 text-xs font-semibold ${serverProps.battery.level < 25 ? "text-orange-500" : serverProps.battery.level < 45 ? "text-yellow-500" : "text-green-500"}`}>
                                            {serverProps.battery.level}
                                            <MdBolt size={12} />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="relative flex flex-col items-center gap-1 group cursor-pointer">
                                    <div className="text-white transition-all duration-200 group-hover:-translate-y-2">
                                        <div className={`${serverProps.battery.level < 15 ? "block" : "hidden"} text-red-500 animate-pulse`}>
                                            <MdBatteryAlert />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 15 && serverProps.battery.level < 25 ? "block" : "hidden"} text-orange-500`}>
                                            <MdBattery20 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 25 && serverProps.battery.level < 45 ? "block" : "hidden"} text-yellow-500`}>
                                            <MdBattery30 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 45 && serverProps.battery.level < 55 ? "block" : "hidden"}`}>
                                            <MdBattery50 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 55 && serverProps.battery.level < 75 ? "block" : "hidden"}`}>
                                            <MdBattery60 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 75 && serverProps.battery.level < 85 ? "block" : "hidden"}`}>
                                            <MdBattery80 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 85 && serverProps.battery.level < 95 ? "block" : "hidden"}`}>
                                            <MdBattery90 />
                                        </div>
                                        <div className={`${serverProps.battery.level >= 95 ? "block" : "hidden"} text-green-500`}>
                                            <MdBatteryFull />
                                        </div>
                                    </div>
                                    <div className="absolute top-2 w-fit overflow-hidden">
                                        <div className={`translate-y-12 group-hover:translate-y-0 transition-all duration-200 text-xs font-semibold ${serverProps.battery.level > 95 ? "text-green-500" : serverProps.battery.level < 15 ? "text-red-500" : serverProps.battery.level < 25 ? "text-orange-500" : serverProps.battery.level < 45 ? "text-yellow-500" : "text-white"}`}>{serverProps.battery.level}%</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex flex-row items-center gap-4 text-lg text-white justify-end">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-full h-1 bg-slate-500 rounded-full overflow-hidden">
                                <div className={`h-full ${eval(serverProps?.diskUse) < 0.1 ? "bg-red-500" : eval(serverProps?.diskUse) < 0.3 ? "bg-orange-500" : eval(serverProps?.diskUse) < 0.8 ? "bg-blue-500" : "bg-green-500"} transition-all`} style={{ width: `${100 - eval(serverProps?.diskUse) * 100}%` }}></div>
                            </div>
                            <div className="text-xs font-light px-1"><span className="hidden md:inline-block">Free space :</span> {serverProps?.diskUse} Gb</div>
                        </div>
                        <FaHardDrive className="text-slate-500" />
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
                            <div className={`w-40 h-44 md:w-60 md:h-64 ${reboot ? "animate-pulse" : ""} max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md bg-slate-600 border-slate-500 border-2 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Power <span className="hidden md:inline-block">management</span></div>
                                <div onClick={() => setPower(!power)} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <PowerIcon className={reboot ? "animate-spin" : ""} size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Manage server power.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${!serverProps?.containers?.krakenSql?.state && !serverProps?.containers?.krakenSrv?.state ? "border-red-500" : serverProps?.containers?.krakenSql?.state && serverProps?.containers?.krakenSrv?.state ? "border-green-500" : serverProps?.containers?.krakenSql?.state ? "border-t-green-500 border-l-green-500 border-red-500" : "border-b-green-500 border-r-green-500 border-red-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold"><span className="hidden md:inline-block">Docker</span> Containers</div>
                                <div onClick={() => { }} className="p-4 rounded-full bg-slate-700 shadow-xl text-white">
                                    <FaDocker className="hidden md:block" size={35} />
                                    <FaDocker className="block md:hidden" size={25} />
                                </div>
                                <div className="w-full grid grid-cols-2 my-2 md:mb-5">
                                    <div className="w-full md:px-2 flex flex-col gap-1 items-center text-white text-xs border-r-[1px] border-slate-400 overflow-hidden">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm leading-none">KrakenSql</p>
                                            <p className="font-extralight leading-none max-md:text-[9px]">{serverProps?.containers?.krakenSql?.id}</p>
                                        </div>
                                        <div className="max-md:w-full px-2 grid grid-cols-2 gap-2 items-start">
                                            <div className="hidden md:block font-light">State : </div>
                                            {SqlCtn ?
                                                <div className="hidden md:flex flex-row items-baseline">
                                                    <span className="animate-bounce">.</span>
                                                    <span className="animate-[bounce_1s_infinite_100ms]">.</span>
                                                    <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                                                </div>
                                                :
                                                <div className={`hidden md:block ${serverProps?.containers?.krakenSql?.state ? "text-green-500" : "text-red-500"}`}>{serverProps?.containers?.krakenSql?.state ? "up" : "down"}</div>}
                                            <div className="w-full col-span-2">
                                                <Switch key={`krakenSql${serverProps?.osUptime}`} onChange={async () => { triggerSql(true); await axios.get("/api/serverProps?action=toggleSql"); await mutateProps(); triggerSql(false) }} disabled={serverProps?.containers?.krakenSql?.id == "N/A"} state={serverProps?.containers?.krakenSql?.state} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:px-2 flex flex-col gap-1 items-center text-white text-xs border-l-[1px] border-slate-400 overflow-hidden">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm leading-none">KrakenSrv</p>
                                            <p className="font-extralight leading-none max-md:text-[9px]">{serverProps?.containers?.krakenSrv?.id}</p>
                                        </div>
                                        <div className="max-md:w-full px-2 grid grid-cols-2 gap-2 items-start">
                                            <div className="hidden md:block font-light">State : </div>
                                            {SrvCtn ?
                                                <div className="hidden md:flex flex-row items-baseline">
                                                    <span className="animate-bounce">.</span>
                                                    <span className="animate-[bounce_1s_infinite_100ms]">.</span>
                                                    <span className="animate-[bounce_1s_infinite_200ms]">.</span>
                                                </div>
                                                : <div className={`hidden md:block ${serverProps?.containers?.krakenSrv?.state ? "text-green-500" : "text-red-500"}`}>{serverProps?.containers?.krakenSrv?.state ? "up" : "down"}</div>}
                                            <div className="w-full col-span-2">
                                                <Switch key={`krakenSrv${serverProps?.osUptime}`} onChange={async () => { triggerSrv(true); await axios.get("/api/serverProps?action=toggleSrv"); await mutateProps(); triggerSrv(false) }} disabled={serverProps?.containers?.krakenSrv?.id == "N/A"} state={serverProps?.containers?.krakenSrv?.state} />
                                            </div>
                                        </div>
                                    </div>
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
                                    Hotspot is <span className="hidden md:inline-block">currently</span> <span className={serverProps.hotSpot ? "text-green-500 font-semibold" : "text-orange-500 font-semibold"}>{serverProps.hotSpot ? "on" : "off"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 ${serverProps.smbStatus ? "border-green-500" : "border-red-500"} bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Samba</div>
                                <div onClick={() => axios.get("/api/serverProps", { params: { action: "restartSMB" } })} className="p-4 rounded-full bg-slate-700 shadow-xl text-white cursor-pointer hover:scale-105 transition-all duration-500">
                                    <MdFolderShared size={35} />
                                </div>
                                <div className="p-2 text-white text-sm text-center md:text-start font-light">
                                    Samba is <span className="hidden md:inline-block">currently</span> <span className={serverProps.smbStatus ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>{serverProps.smbStatus ? "up" : "down"}</span>.
                                </div>
                            </div>
                        </div>
                        <div className="inline-block">
                            <div className={`w-40 h-44 md:w-60 md:h-64 max-w-xs flex flex-col justify-between items-center overflow-hidden rounded-lg shadow-md border-2 border-green-500 bg-slate-600 hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
                                <div className="w-full text-white text-lg text-center my-2 font-semibold">Restart Server</div>
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
            <div className={`${power ? "backdrop-blur-md bg-black" : "backdrop-blur-none transparent pointer-events-none"} absolute top-0 left-0 right-0 bottom-0 z-30 flex items-center bg-opacity-50 transition-all ease-in-out duration-200`}>
                <div className={`${power ? "visible" : "hidden"} absolute top-0 left-0 right-0 bottom-0 flex items-center`}>
                    <div onClick={() => { setPower(false) }} className="fixed top-0 left-0 right-0 bottom-0 z-40"></div>
                    <div className="w-fit h-fit flex flex-col md:flex-row gap-12 md:gap-28 items-center text-black rounded-md m-auto z-50">
                        <div className="flex flex-col items-center group cursor-pointer" onClick={async () => { await axios.get("/api/serverProps", { params: { action: "poweroff" } }) }}>
                            <div className="h-fit w-fit m-auto p-4 bg-slate-600 rounded-full shadow-2xl cursor-pointer text-black group-hover:text-red-500 group-hover:-translate-y-1 transition-all duration-200">
                                <IoPower size={50} />
                            </div>
                            <div className="h-fit w-fit overflow-hidden">
                                <p className="font-semibold md:translate-y-12 group-hover:translate-y-0 transition-all duration-200 text-red-500 md:text-black">Poweroff</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center group cursor-pointer" onClick={rebootServer}>
                            <div className="h-fit w-fit m-auto p-4 bg-slate-600 rounded-full shadow-2xl cursor-pointer text-black group-hover:text-red-500 group-hover:-translate-y-1 transition-all duration-200">
                                <IoSync size={50} />
                            </div>
                            <div className="h-fit w-fit overflow-hidden">
                                <p className="font-semibold md:translate-y-12 group-hover:translate-y-0 transition-all duration-200 text-red-500 md:text-black">Reboot</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}