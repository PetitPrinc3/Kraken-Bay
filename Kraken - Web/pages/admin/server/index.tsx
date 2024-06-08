import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { IoPower } from "react-icons/io5";
import { FaWindows, FaLinux, FaServer, FaCircle } from "react-icons/fa";
import { GrMysql } from "react-icons/gr";

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
    const serverProps = useServerProps().data

    if (isUndefined(serverProps)) return null

    const OsIcon = serverProps.osPlatform == "win32" ? FaWindows : FaLinux
    return (
        <AdminLayout pageName="server" >
            <div className="flex flex-col h-full w-full gap-4">
                <div className="w-full h-full grid grid-cols-3 gap-4">
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <OsIcon />
                            Platform :
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
                            OS Uptime :
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {formatUptime(serverProps.osUptime)}
                        </div>
                        <div className="text-sm text-center">
                            Last reboot on <span className="text-green-500 font-bold">{new Date(new Date().getTime() - serverProps.osUptime * 1000).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>.
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaServer />
                            Server :
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {serverProps.osHostName}
                        </div>
                        <div className="w-full grid grid-cols-3 gap-4">
                            <div className="grid grid-cols-[20%_80%] items-center gap-2 text-green-500">
                                <GrMysql />
                                Mysql
                            </div>
                            <div className="grid grid-cols-[20%_80%] items-center gap-2">
                                <FaCircle />
                                Samba
                            </div>
                            <div className="grid grid-cols-[20%_80%] items-center gap-2">
                                <FaCircle />
                                Mysql
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}