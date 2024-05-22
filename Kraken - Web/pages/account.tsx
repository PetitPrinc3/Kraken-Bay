import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";
import useUserUploads from "@/hooks/useUserUploads";
import { FaCrown, FaUser } from "react-icons/fa6";
import { IoIosInformationCircle, IoIosWarning, IoIosCheckmarkCircle } from "react-icons/io";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { isUndefined } from "lodash";

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

const Account = () => {
    const { data: user } = useCurrentUser()
    const { data: notifications } = useNotifications()
    const { data: uploads } = useUserUploads();
    const profilePic = useRef(null)
    const [image, setImage] = useState<string>()
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        if (firstLoad && !isUndefined(user)) {
            setImage(user.image)
            setFirstLoad(false)
        }
    }, [firstLoad, user])

    const imageClick = () => {
        if (profilePic.current) profilePic.current.click();
    }

    const imageUpdate = async (event: any) => {
        if (event.target.files && event.target.files.length > 0) {
            const imageFile = event.target.files[0]
            setImage(URL.createObjectURL(imageFile))
            const formData = new FormData();
            formData.append("pic", imageFile);
            const uploadRequest = axios.post(`/api/profileUpdate`, formData).catch((err) => console.log(err))
        }
    }

    const Icon = user?.roles == "admin" ? FaCrown : FaUser

    return (
        <div className="">
            <Navbar />
            <div className="py-[10vh] flex flex-col items-center">
                <div className="md:h-[85vh] w-[85vw] md:w-[95vw] flex flex-col p-4 gap-4 rounded-md bg-neutral-700 overflow-auto z-0">
                    <div className="flex flex-col h-[25%] md:flex-row md:items-center gap-8 p-2 border-zinc-800 border-2 rounded-md z-30">
                        <div className="w-full h-full md:w-auto flex flex-col items-center">
                            <input id="poster-file" type="file" onChange={(e: any) => { imageUpdate(e) }} className="hidden" />
                            <label onClick={() => { imageClick }} htmlFor="poster-file" className="h-40 md:h-full rounded-md transition duration-200 cursor-pointer" >
                                <img className="h-40 md:h-full rounded-md transition duration-200 cursor-pointer hover:brightness-150" src={image || "/Assets/Images/default_profile.png"} alt="" />
                            </label>
                        </div>
                        <div className="grid grid-cols-[auto_auto] md:w-auto w-full items-center justify-center gap-x-8 md:gap-x-4 text-white text-lg font-light">
                            <p className="text-zinc-400 font-semibold">Name : </p>
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-zinc-400 font-semibold">Email : </p>
                            <p className="">{user?.email}</p>
                            <p className="text-zinc-400 font-semibold">Role : </p>
                            <div className="flex flex-row items-center gap-2">
                                <Icon />
                                <p className={`${user?.roles == "admin" ? "text-red-500" : "text-green-500"}`}>{user?.roles}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-full overflow-hidden z-30">
                        <div className="w-full h-full flex flex-col md:flex-row gap-4">
                            <div className="md:w-[50%] w-full h-full border-2 border-zinc-800 rounded-md flex flex-col items-start overflow-auto">
                                <p className="mx-4 my-2 text-zinc-400 font-semibold">Your notifications :</p>
                                {notifications && notifications.map((notification: any) => (
                                    <div key={notification.id} className="flex flex-row items-center justify-start w-full">
                                        <div className="w-[20%]">
                                            <IoIosCheckmarkCircle className={`${notification.type === "success" ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                                            <IoIosInformationCircle className={`${notification.type === "info" ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                                            <IoIosWarning className={`${notification.type === "warning" ? "inline-block" : "hidden"} m-2 text-orange-500`} size={30} />
                                            <RiIndeterminateCircleFill className={`${notification.type === "error" ? "inline-block" : "hidden"} m-2 text-red-500`} size={30} />
                                        </div>
                                        <div className="w-[80%]">
                                            <p className="text-white max-w-[95%] row-span-2 truncate text-ellipsis">{notification.content}</p>
                                            <p className="text-xs">{new Date(notification.date).toLocaleString()}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                            <div className="md:w-[50%] w-full h-full border-2 border-zinc-800 rounded-md flex flex-col items-start">
                                <p className="mx-4 my-2 text-zinc-400 font-semibold">Your uploads :</p>
                                {uploads && uploads.map((upload: any) => (
                                    <div key={upload.id} className="flex flex-row items-center justify-start w-full">
                                        <div className="w-[20%]">
                                            <IoIosCheckmarkCircle className={`${upload?.uploadedBy ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                                            <MdPending className={`${upload?.userName ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                                        </div>
                                        <div className="w-[80%]">
                                            <p className="text-white max-w-[95%] row-span-2 truncate text-ellipsis">{upload.title}</p>
                                            <p className="text-xs">{new Date(upload.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute md:h-[80vh] w-[80vw] md:w-[90vw] bg-[url('/Assets/Images/kraken.png')] bg-contain bg-no-repeat bg-center opacity-60 z-10"></div>
                </div>
            </div>
            <Footer />
        </div >
    )
}

export default Account;