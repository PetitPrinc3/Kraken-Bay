import { AdminLayout } from "@/pages/_app";
import { useRouter } from "next/router";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import { isUndefined } from "lodash";
import usePendingAccounts from "@/hooks/usePendingAccounts";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

export default function Access() {
    const router = useRouter();
    const { data: pendingAccounts, mutate: mutateAccounts } = usePendingAccounts();

    const rejectUser = async (userId: string) => {
        await axios.delete('/api/pendingAccounts', { data: { userId } }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("User rejected.", { containerId: "AdminContainer" })
        })
        mutateAccounts()
    }
    const acceptUser = async (userId: string) => {
        await axios.put('/api/pendingAccounts', { userId: userId, userRole: "user" }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("User accepted.", { containerId: "AdminContainer" })
        })
        mutateAccounts()
    }

    if (isUndefined(pendingAccounts)) return null

    return (
        <AdminLayout pageName="access" >
            <div className="flex flex-col gap-2 items-center justify-between p-2 bg-slate-800 rounded-md">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input type="text" className="bg-transparent focus:outline-none w-full" placeholder="Search for user..." />
                    </div>
                    <button onClick={() => { router.push("access/add") }} className="p-1 px-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">Add New</button>
                </div>
                <div className="w-full h-[60vh] px-4">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-white font-semibold">
                                <td className="w-[30%]">Name</td>
                                <td className="w-[25%]">Email</td>
                                <td className="w-[25%] text-center">Created At</td>
                                <td className="w-[20%]"></td>
                            </tr>
                        </thead>
                        <tbody className="w-full h-full rounded-md">
                            {pendingAccounts.map((account: any) => (
                                <tr key={account?.id} className="text-white">
                                    <td className="grid grid-cols-[20%_80%] items-center">
                                        <img src="/Assets/Images/default_profile.png" className="max-h-6" alt="" />
                                        {account?.name}
                                    </td>
                                    <td>
                                        {account?.email}
                                    </td>
                                    <td className="text-center">
                                        {new Date(account?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="">
                                        <div className="relative flex flex-row items-center gap-2 text-black font-semibold text-sm">
                                            <button onClick={() => { acceptUser(account?.id) }} className="w-[40%] py-1 px-2 rounded-md ml-auto bg-green-500 hover:bg-green-400 transition-all duration-200">Accept</button>
                                            <button onClick={() => { rejectUser(account?.id) }} className="w-[40%] py-1 px-2 rounded-md mr-auto bg-red-700 hover:bg-red-600 transition-all duration-200">Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <button className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm hover:bg-slate-600 transition all duration-100">Previous</button>
                    <button className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm hover:bg-slate-600 transition all duration-100">Next</button>
                </div>
            </div>
        </AdminLayout>
    )
}