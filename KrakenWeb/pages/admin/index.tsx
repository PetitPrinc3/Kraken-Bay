import { AdminLayout } from "@/pages/_app";
import { FaUsers } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { IoPower } from "react-icons/io5";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { isUndefined } from "lodash";
import usePendingAccounts from "@/hooks/usePendingAccounts";
import usePendingUploads from "@/hooks/usePendingUploads";
import useBestUploaders from "@/hooks/useBestUploaders";
import useStatistics from "@/hooks/useStatistics";
import useServerProps from "@/hooks/useServerProps";
import useUsers from "@/hooks/useUsers";
import useMedia from "@/hooks/useMedia";

const formatUptime = (serverProps: any) => {
    var d = Math.floor(serverProps / (3600 * 24));
    var h = Math.floor(serverProps % (3600 * 24) / 3600);
    var m = Math.floor(serverProps % 3600 / 60);
    var s = Math.floor(serverProps % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m >= 0 ? m + "m " : "";

    return dDisplay + hDisplay + mDisplay;
}

export default function AdminDashboard() {
    const pendingAccounts = usePendingAccounts().data
    const existingUsers = useUsers().data
    const pendingUploads = usePendingUploads().data
    const existingMedia = useMedia().data
    const bestUploaders = useBestUploaders().data
    const serverProps = useServerProps().data

    const { data: statistics } = useStatistics();

    if (isUndefined(pendingAccounts) || isUndefined(existingUsers) || isUndefined(existingMedia) || isUndefined(pendingUploads) || isUndefined(bestUploaders) || isUndefined(serverProps)) return null
    return (
        <AdminLayout pageName="admin">
            <div className="w-full h-full flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 hover:bg-red-500 duration-300 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <FaUsers />
                            <p className="hidden md:block">Total users :</p>
                            <p className="block md:hidden">Users :</p>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {existingUsers.length}
                        </div>
                        <div className="text-sm text-center">
                            And <span className="text-green-500 font-bold">{pendingAccounts.length}</span> pending accounts.
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 hover:bg-red-500 duration-300 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <MdMovie />
                            <p className="hidden md:block">Total media :</p>
                            <p className="block md:hidden">Media :</p>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {existingMedia.length}
                        </div>
                        <div className="text-sm text-center">
                            And <span className="text-green-500 font-bold">{pendingUploads.length}</span> pending uploads.
                        </div>
                    </div>
                    <div className="w-full h-full bg-slate-800 flex flex-col text-white rounded-md gap-4 p-4 hover:bg-red-500 duration-300 cursor-default">
                        <div className="flex flex-row items-center gap-4 text-xl">
                            <IoPower />
                            <p className="hidden md:block">Uptime :</p>
                            <p className="block md:hidden">Up :</p>
                        </div>
                        <div className="text-2xl font-semibold text-center">
                            {formatUptime(serverProps.serverUptime)}
                        </div>
                        <div className="block text-sm text-center">
                            Last reboot on <span className="text-green-500 font-bold">{new Date(new Date().getTime() - (serverProps.serverUptime * 1000)).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>.
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit bg-slate-800 rounded-md p-4 flex flex-col">
                    <p className="text-white text-xl mb-4">Best Uploaders :</p>
                    <table className="w-full table-fixed border-separate border-spacing-2">
                        <thead className="w-full">
                            <tr className="w-full text-white">
                                <td className="w-[60%]">Name</td>
                                <td className="w-[10%] text-center"><span className="hidden md:block">Uploads</span></td>
                                <td className="w-[20%]">Latest</td>
                            </tr>
                        </thead>
                        <tbody className="w-full overflow-hidden">
                            {bestUploaders.map((uploader: any) => (
                                <tr key={uploader?.email} className="text-white">
                                    <td className="flex flex-row gap-4 items-center h-10 truncate text-ellipsis">
                                        <img src={uploader.image || "/Assets/Images/kraken.png"} className="h-8 w-8 rounded-full" alt="" />
                                        {uploader.email}
                                    </td>
                                    <td className="text-red-500 font-bold text-center truncate text-ellipsis">
                                        {uploader?.uploads}
                                    </td>
                                    <td className="truncate text-ellipsis">
                                        {uploader?.latestUpload}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full h-[50vh] bg-slate-800 rounded-md p-4 grid grid-rows-[15%_85%]">
                    <p className="text-white text-xl mb-4">Server Trends :</p>
                    <ResponsiveContainer className="w-full h-full">
                        <LineChart
                            className="w-full h-full"
                            data={statistics}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip contentStyle={{ background: "#1e293b", border: "none" }} />
                            <Legend />
                            <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="media" stroke="#82ca9d" activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    )
}