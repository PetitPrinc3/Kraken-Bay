import { AdminLayout } from "@/pages/_app";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { MdSearch, MdRefresh } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import usePendingAccounts from "@/hooks/usePendingAccounts";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { isEmpty } from "lodash";

export default function Access() {
    const router = useRouter();
    const pathname = usePathname();
    const [page, setPage] = useState(1)
    const searchParams = new URLSearchParams(useSearchParams());
    const q = searchParams.get("q");
    const p = searchParams.get("page") || 1
    const { data: pendingAccounts, mutate: mutateAccounts } = usePendingAccounts({ searchText: q, page: p });
    const { data: userCount, mutate: mutateUserCount } = usePendingAccounts({ searchText: q })

    const handleSearch = (e: any) => {
        if (e.target.value) {
            searchParams.set("q", e.target.value);
        } else {
            searchParams.delete("q")
        }
        if (searchParams.size == 0) {
            router.replace(`${pathname}`);
        } else {
            router.replace(`${pathname}?${searchParams}`);
        }
    }

    const nextPage = async () => {
        setPage(page + 1)
        if (!searchParams.has("page")) searchParams.set("page", (page + 1).toString())
        else searchParams.set("page", (page + 1).toString())

        if (searchParams.size == 0) {
            router.replace(`${pathname}`);
        } else {
            router.replace(`${pathname}?${searchParams}`);
        }
        await mutateUserCount()
        await mutateAccounts()
    }

    const prevPage = async () => {
        setPage(page - 1)
        searchParams.set("page", (page - 1).toString())
        if (page - 1 == 1) searchParams.delete("page")
        if (searchParams.size == 0) {
            router.replace(`${pathname}`);
        } else {
            router.replace(`${pathname}?${searchParams}`);
        }
        await mutateUserCount()
        await mutateAccounts()
    }

    const rejectUser = async (userId: string) => {
        await axios.delete('/api/users', { params: { userId: userId } }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("User rejected.", { containerId: "AdminContainer" })
        })
        await mutateAccounts()
        await mutateUserCount()
        if ((page - 1) * 10 >= userCount?.length - 1 && page > 1) {
            setPage(page - 1)
            searchParams.set("page", (page - 1).toString())
            if (page - 1 == 1) searchParams.delete("page")
            if (searchParams.size == 0) {
                router.replace(`${pathname}`);
            } else {
                router.replace(`${pathname}?${searchParams}`);
            }
        }
    }
    const acceptUser = async (userId: string) => {
        await axios.post('/api/users', { userData: { id: userId, roles: "user" } }).catch((err) => {
            toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        }).then(() => {
            toast.success("User accepted.", { containerId: "AdminContainer" })
        })
        await mutateAccounts()
        await mutateUserCount()
        if ((page - 1) * 10 >= userCount?.length - 1 && page > 1) {
            setPage(page - 1)
            searchParams.set("page", (page - 1).toString())
            if (page - 1 == 1) searchParams.delete("page")
            if (searchParams.size == 0) {
                router.replace(`${pathname}`);
            } else {
                router.replace(`${pathname}?${searchParams}`);
            }
        }
    }

    return (
        <AdminLayout pageName="Pending Access" >
            <div className="flex flex-col gap-2 items-center justify-between p-2 bg-slate-800 rounded-md">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-[30%] flex flex-row items-center gap-2 bg-slate-700 text-neutral-400 text-sm rounded-md p-1 px-2">
                        <MdSearch />
                        <input onChange={(e) => handleSearch(e)} type="text" className="bg-transparent text-white focus:outline-none w-full" placeholder="Search for user..." />
                    </div>
                    <div className="w-fit flex flex-row items-center gap-2">
                        <button onClick={() => { mutateAccounts(); mutateUserCount() }} className="p-1 px-6 flex flex-row gap-2 group items-center justify-center rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                            <MdRefresh className="hidden lg:block group-hover:animate-spin transition-all duration-300" size={18} />
                            Refresh
                        </button>
                        <button onClick={() => { router.push("access/add") }} className="p-1 px-6 flex flex-row items-center gap-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">
                            <FaPlus />
                            Add New
                        </button>
                    </div>
                </div>
                <div className="w-full h-fit min-h-[30vh] md:h-[60vh] px-4">
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
                            {(pendingAccounts || []).map((account: any) => (
                                <tr key={account?.id} className="text-white">
                                    <td className="grid grid-cols-[20%_80%] items-center truncate text-ellipsis">
                                        <img src={account?.image || "/Assets/Images/default_profile.png"} className="max-h-6" alt="" />
                                        {account?.name}
                                    </td>
                                    <td className="truncate text-ellipsis">
                                        {account?.email}
                                    </td>
                                    <td className="text-center truncate text-ellipsis">
                                        {new Date(account?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="">
                                        <div className="relative flex flex-row items-center gap-2 text-black font-semibold text-sm">
                                            <button onClick={() => { acceptUser(account?.id) }} className="w-[40%] py-1 px-2 flex items-center justify-center rounded-md ml-auto bg-green-500 hover:bg-green-400 transition-all duration-200">
                                                <p className="hidden md:block">Accept</p>
                                                <FaCheck className="block md:hidden" />
                                            </button>
                                            <button onClick={() => { rejectUser(account?.id) }} className="w-[40%] py-1 px-2 flex items-center justify-center rounded-md mr-auto bg-red-700 hover:bg-red-600 transition-all duration-200">
                                                <p className="hidden md:block">Reject</p>
                                                <FaPlus className="rotate-45 block md:hidden" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isEmpty(pendingAccounts) &&
                        <div className="w-full h-fit text-center text-slate-500 font-semibold text-sm">No pending access.</div>
                    }
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                    <button onClick={prevPage} disabled={page <= 1} className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm disabled:bg-slate-800 disabled:border-slate-500 disabled:hover:bg-slate-800 disabled:text-slate-900 hover:bg-slate-600 transition all duration-100">Previous</button>
                    <button onClick={nextPage} disabled={page * 10 >= userCount?.length} className="p-1 px-2 w-20 rounded-md bg-slate-700 border-[1px] border-slate-400 text-sm disabled:bg-slate-800 disabled:border-slate-500 disabled:hover:bg-slate-800 disabled:text-slate-900 hover:bg-slate-600 transition all duration-100">Next</button>
                </div>
            </div>
        </AdminLayout>
    )
}