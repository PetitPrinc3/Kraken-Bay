import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import useCurrentUser from "@/hooks/useCurrentUser"
import { isEmpty, isUndefined } from "lodash";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaCircle } from "react-icons/fa6";
import { IoCloudSharp, IoCloudOfflineSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import axios from "axios";
import useSWR from "swr";
import PendingUser from "@/components/PendingUser";
import PendingUpload from "@/components/PendingUpload";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import { ToastContainer } from "react-toastify";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

const GetPendingAccounts = () => {
    const { data, error, isLoading } = useSWR("/api/pendingAccounts", (url: string) => axios.get(url).then((res) => res.data))
    return { data, error, isLoading }
};

const GetPendingUploads = () => {
    const { data, error, isLoading } = useSWR("/api/pendingUploads", (url: string) => axios.get(url).then((res) => res.data))
    return { data, error, isLoading }
}

export default function Admin() {
    const { data: user } = useCurrentUser();
    const { data: pendingUploads } = GetPendingUploads();
    const { data: pendingAccounts } = GetPendingAccounts()
    const [isOnline, setIsOnline] = useState(true)
    const [webStatus, setWebstatus] = useState(true)
    const [smbStatus, setSmbStatus] = useState(true)

    const router = useRouter();
    const OnlineStatus = isOnline ? IoCloudSharp : IoCloudOfflineSharp

    if (isUndefined(user) || isUndefined(pendingUploads) || isUndefined(pendingAccounts)) {
        return null;
    }

    if (user?.roles != "admin") {
        return (
            <div className="w-full h-full flex flex-col items-center">
                <div className="flex flex-col items-center m-auto w-[50vw] h-[50vw] lg:w-[20vw] lg:h-[20vw] bg-zinc-600 rounded-md border-4 border-red-600">
                    <div className="flex flex-row items-center text-red-600 gap-4 my-5">
                        <PiWarningCircleFill size={30} />
                        <p className="text-white font-extrabold text-xl">Stop !</p>
                    </div>
                    <div className="w-[45vw] h-[30vw] lg:w-[19vw] lg:h-[10vw] px-4 py-2 m-auto flex flex-col items-center gap-4 text-white text-center">
                        <p>You are not an administrator and the access to this page is restricted.</p>
                        <p className="hidden md:block">Your current roles is : {user?.roles} </p>
                    </div>
                    <a className="py-2 px-4 bg-red-600 rounded-md mb-4 text-white font-semibold" href="/home">Go home</a>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className="relative w-full pt-[8vh] md:pt-[15vh]">
                <div className="my-5">
                    <p className="text-2xl text-white text-center font-semibold ml-10 cursor-default">Admin pannel</p>
                </div>
                <div className="w-full h-14 flex flex-row items-center my-4">
                    <div className="w-[30%] m-auto flex flex-row gap-4 items-center justify-center">
                        <FaCircle className={`${webStatus ? "text-green-500" : "text-red-500"}`} size={20} />
                        <p className="text-white font-semibold" >Web server</p>
                    </div>
                    <div className="w-[30%] m-auto flex flex-row gap-4 items-center justify-center">
                        <FaCircle className={`${smbStatus ? "text-green-500" : "text-red-500"}`} size={20} />
                        <p className="text-white font-semibold" >SMB server</p>
                    </div>
                    <div className="w-[30%] m-auto flex flex-row gap-4 items-center justify-center">
                        <OnlineStatus className="text-blue-500" size={20} />
                        <p className="text-white font-semibold" >On/Offline <span className="hidden md:inline-block text-white font-semibold">status</span></p>
                    </div>

                </div>
                <p className="text-xl text-white font-semibold ml-[10%]">Pending Uploads :</p>
                <div className="w-full h-full flex flex-col items-center">
                    <div className="m-5 w-[80vw] h-[40vh] rounded-md overflow-hidden bg-zinc-600 border-2 border-black">
                        <div className="flex flex-row items-center px-5 w-full h-14 border-b-2 border-black">
                            <div className="w-full h-full flex flex-row items-center cursor-default">
                                <div onClick={() => { }} className="w-full h-full flex flex-row items-center gap-4 cursor-pointer">
                                    <div className="w-[50%] flex flex-row items-center gap-2 truncate text-ellipsis overflow-hidden">
                                        <p className="text-white font-semibold text-ellipsis overflow-hidden">Title</p>
                                    </div>
                                    <div className="w-[15%] hidden lg:flex flex-row items-center gap-2 overflow-hidden">
                                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">Thumbnail</p>
                                    </div>
                                    <div className="w-[15%] hidden lg:flex flex-row items-center gap-2 overflow-hidden">
                                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">Poster</p>
                                    </div>
                                    <div className="w-[20%] flex flex-row items-center gap-2 mr-10 ml-auto">
                                        <p className="text-white w-full font-semibold text-center text-ellipsis overflow-hidden">Uploaded by</p>
                                    </div>
                                </div>
                                <div className="w-[15%] lg:w-[5%]"></div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col items-center overflow-y-scroll scrollbar-hide">
                            {pendingUploads.map((upload: any) => (
                                <PendingUpload key={upload?.id} data={upload} />
                            ))}
                            <div className={`w-full h-[80%] ${isEmpty(pendingUploads) ? "flex" : "hidden"} flex-col items-center justify-center`}>
                                <p className="text-xl font-bold text-zinc-800">No pending Uploads</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-xl text-white font-semibold ml-[10%]">Pending Accounts :</p>
                <div className="w-full h-full flex flex-col items-center">
                    <div className="m-5 w-[80vw] h-[40vh] rounded-md overflow-x-hidden overflow-y-scroll bg-zinc-600 border-2 border-black scrollbar-hide">
                        {pendingAccounts.map((pendingUser: any) => (
                            <PendingUser key={pendingUser?.id} data={pendingUser} />
                        ))}
                        <div className={`w-full h-full ${isEmpty(pendingAccounts) ? "flex" : "hidden"} flex-col items-center justify-center`}>
                            <p className="text-xl font-bold text-zinc-800">No pending Accounts</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
                containerId={"AdminContainer"}
            />
        </div>
    )
}