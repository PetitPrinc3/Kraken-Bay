import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";
import useUserUploads from "@/hooks/useUserUploads";
import { FaCrown, FaUser } from "react-icons/fa6";
import { IoIosInformationCircle, IoIosWarning, IoIosCheckmarkCircle } from "react-icons/io";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { isEmpty, isUndefined } from "lodash";
import { FaPencilAlt } from "react-icons/fa";
import { IoNotifications, IoCloudUploadSharp, IoSave } from "react-icons/io5";
import { FaStar, FaHome } from "react-icons/fa";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useFavorites from "@/hooks/useFavorites";
import FavoriteButton from "@/components/FavoriteButton";

const Account = () => {
    const router = useRouter()
    const { data: user, mutate: mutateUser } = useCurrentUser()
    const { data: uploads } = useUserUploads();
    const { data: notifications } = useNotifications()
    const { data: favorites } = useFavorites()
    const [activeTab, setActiveTab] = useState("Notifications")
    const [muted, setMuted] = useState<boolean | undefined>(user?.isMuted)
    const [image, setImage] = useState("")
    const [imageFile, setImageFile] = useState<File>()
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [skipPrompt, setSkipPrompt] = useState<boolean | undefined>(user?.skipPrompt)
    const [confirmPassword, setConfirmPassword] = useState<string | undefined>(undefined)
    const profileRef = useRef<any>(null)
    const passwordRef = useRef<any>(null)

    useEffect(() => {
        if (!isUndefined(user)) {
            setMuted(user?.isMuted)
            setSkipPrompt(user?.skipPrompt)
            setImage(user?.image)
        }
    }, [user])

    const handleUpdate = async () => {

        if (password && password != confirmPassword) {
            toast.error("Oops, password and confirmation do not match...")
            return
        }
        if (imageFile == undefined) {
            await axios.post("/api/users", {
                userData: {
                    id: user?.id,
                    hashedPassword: password,
                    isMuted: muted,
                    skipPrompt: skipPrompt,
                }
            }).catch((err) => {
                toast.error("Oops something went wrong...")
            }).then(async (data) => {
                if (!isUndefined(data)) {
                    await mutateUser()
                    toast.success("Profile updated !")
                    setPassword(undefined)
                    passwordRef.current.value = ""
                }
            })
        } else {
            const imageData = imageFile as File
            const buffer = await imageData.arrayBuffer()
            const imageBuffer = Buffer.from(buffer)
            await axios.post("/api/users", {
                userData: {
                    id: user?.id,
                    hashedPassword: password,
                    isMuted: muted,
                    skipPrompt: skipPrompt,
                    image: { imageBuffer: imageBuffer, fileName: imageData.name }
                }
            }).catch((err) => {
                toast.error("Oops something went wrong...")
            }).then(async (data) => {
                if (!isUndefined(data)) {
                    await mutateUser()
                    toast.success("Profile updated !")
                    setPassword(undefined)
                    passwordRef.current.value = ""
                }
            })
        }
    }

    const changeProfile = async (e: any) => {
        const image = profileRef.current?.files
        if (image.length != 1) {
            toast.error("What did you do ?!")
            profileRef.current.value = ""
            setImage("")
            return
        } else {
            setImage(URL.createObjectURL(image[0]))
            setImageFile(e.target.files[0])
            profileRef.current.value = ""
        }
    }

    const Icon = user?.roles == "admin" ? FaCrown : FaUser

    return (
        <div className="w-full h-full bg-white md:bg-slate-950 p-4 md:p-20 flex">
            <div className="w-full">
                <div className="w-full h-full overflow-y-scroll scrollbar-hide md:overflow-hidden flex flex-col md:grid md:grid-cols-[30%_70%] lg:grid-cols-[60%_40%] items-start gap-16 md:gap-4 p-4 rounded-md bg-white">
                    <div className="w-full h-full flex flex-col gap-12">
                        <div className="flex flex-col gap-8 md:gap-2 md:flex-row items-center justify-between">
                            <div className="w-full flex flex-nowrap flex-row items-center gap-4">
                                <div onClick={() => profileRef.current?.click()} className="relative h-16 w-16 group p-0 m-0 rounded-full shadow-2xl cursor-pointer">
                                    <input onChange={changeProfile} ref={profileRef} type="file" className="hidden" />
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img src={image} alt="" className="top-0 left-0 z-30 object-cover min-w-full min-h-full" />
                                    </div>
                                    <div className="hidden md:flex opacity-0 group-hover:opacity-90 pointer-events-none absolute items-center top-0 left-0 bottom-0 right-0 bg-slate-950 z-50 rounded-full transition-all duration-300 cursor-pointer">
                                        <FaPencilAlt className="text-white m-auto" size={25} />
                                    </div>
                                    <div className="flex md:hidden pointer-events-none absolute items-center bottom-0 right-0 p-1 bg-slate-950 z-50 transition-all duration-300 cursor-pointer rounded-md">
                                        <FaPencilAlt className="text-white m-auto" size={15} />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-xl text-slate-800 leading-none">
                                        {user?.name}
                                    </p>
                                    <p className="font-light text-xs text-slate-500 leading-none">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-fit flex flex-col gap-2">
                                {(password || muted != user?.isMuted || skipPrompt != user?.skipPrompt || image != user?.image) && <div className="w-full flex flex-row items-center justify-between text-white">
                                    <div onClick={handleUpdate} className={"ml-auto w-full md:w-fit flex flex-row items-center gap-2 cursor-cointer justify-center px-2 py-1 rounded-md bg-blue-500 border-blue-600 cursor-pointer hover:bg-blue-400 hover:border-blue-500 border-2 transition-all duration-300"}>
                                        <IoSave size={25} />
                                        Save profile
                                    </div>
                                </div>}
                                <div onClick={() => router.push("/home")} className="flex md:hidden w-full justify-center rounded-md text-sm flex-row items-center gap-2 bg-slate-800 text-white hover:text-slate-800 hover:bg-red-500 px-4 py-2 transition-all duration-200 cursor-pointer">
                                    <FaHome size={15} />
                                    Go Home
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full flex flex-col gap-4 md:gap-4 justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-slate-900 font-bold text-lg px-4">Your informations :</p>
                                <p className="text-slate-500 font-bold text-lg px-4 mb-2">Account :</p>
                                <div className="w-full pl-4 text-sm text-slate-900 font-semibold items-center grid grid-cols-2 md:grid-cols-[10%_90%] gap-2">
                                    <p className="">
                                        Role :
                                    </p>
                                    <p className={`${user?.roles == "admin" ? "text-red-500" : "text-green-500"} font-bold flex flex-row items-center gap-2`}>
                                        <Icon />
                                        {user?.roles}
                                    </p>
                                    <p>
                                        Name :
                                    </p>
                                    <p>
                                        {user?.name}
                                    </p>
                                    <p>
                                        Email :
                                    </p>
                                    <p>
                                        {user?.email}
                                    </p>
                                    <p>
                                        Password :
                                    </p>
                                    <input ref={passwordRef} onChange={(e) => setPassword(e.currentTarget.value)} type="password" placeholder="******" className="w-full md:w-48 border-slate-900 border-[1px] rounded-md focus:outline-none px-2" name="" id="" />
                                </div>
                                {password && <div className="w-full pl-4 text-sm text-slate-900 font-semibold items-center grid grid-cols-2 md:grid-cols-[10%_90%] gap-2">
                                    <p>
                                        Confirm :
                                    </p>
                                    <input onChange={(e) => setConfirmPassword(e.currentTarget.value)} type="password" className={`${password != confirmPassword ? "border-red-500" : "border-green-500"} w-full md:w-48 border-[1px] rounded-md focus:outline-none px-2`} name="" id="" />
                                </div>}
                                <p className="text-slate-500 font-bold text-lg px-4 mt-2">Application :</p>
                                <div className="w-full pl-4 flex flex-row items-center gap-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(e) => setMuted(e.currentTarget.checked)} checked={muted} className="sr-only peer" />
                                        <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-slate-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-slate-800"></div>
                                    </label>
                                    <span className="text-sm font-medium text-slate-900">Muted Billboard</span>
                                </div>
                                <div className="w-full pl-4 flex flex-row items-center gap-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(e) => setSkipPrompt(e.currentTarget.checked)} checked={skipPrompt} className="sr-only peer" />
                                        <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-slate-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-slate-800"></div>
                                    </label>
                                    <span className="text-sm font-medium text-slate-900">Skip welcome prompt</span>
                                </div>
                            </div>
                            <div onClick={() => router.push("/home")} className="hidden md:flex w-fit rounded-md text-sm flex-row items-center gap-2 bg-slate-800 text-white hover:text-slate-800 hover:bg-red-500 px-4 py-2 transition-all duration-200 cursor-pointer">
                                <FaHome size={15} />
                                Go Home
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full h-full flex flex-col gap-4 md:overflow-hidden md:px-16">
                        <div className="relative w-full grid grid-cols-3 items-center rounded-lg bg-slate-200 p-1 mx-auto">
                            <div onClick={() => setActiveTab("Notifications")} className="w-full relative flex items-center gap-2 cursor-pointer text-slate-800 font-semibold px-4 py-2 rounded-md text-sm">
                                <div className="flex flex-row gap-2 items-center justify-center w-full z-30">
                                    <IoNotifications className="md:max-w-[20%] min-w-[20%]" size={15} />
                                    <p className="truncate text-ellipsis hidden md:block">Notifications</p>
                                </div>
                            </div>
                            <div onClick={() => setActiveTab("Uploads")} className="w-full relative flex items-center gap-2 cursor-pointer text-slate-800 font-semibold px-4 py-2 rounded-md text-sm">
                                <div className="flex flex-row gap-2 items-center justify-center w-full z-30">
                                    <IoCloudUploadSharp className="md:max-w-[20%] min-w-[20%]" size={15} />
                                    <p className="truncate text-ellipsis hidden md:block">Uploads</p>
                                </div>
                            </div>
                            <div onClick={() => setActiveTab("Favorites")} className="w-full relative flex items-center gap-2 cursor-pointer text-slate-800 font-semibold px-4 py-2 rounded-md text-sm">
                                <div className="flex flex-row gap-2 items-center justify-center w-full z-30">
                                    <FaStar className="md:max-w-[20%] min-w-[20%]" size={15} />
                                    <p className="truncate text-ellipsis hidden md:block">Favorites</p>
                                </div>
                            </div>
                            <div className={`absolute w-1/3 top-0 bottom-0 p-1 transition-all duration-500 rounded-lg overflow-hidden ${activeTab == "Notifications" ? "left-0" : activeTab == "Uploads" ? "left-1/3" : "left-2/3"}`}>
                                <div className="w-full h-full bg-white shadow-xl rounded-md"></div>
                            </div>
                        </div>
                        <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col gap-2 p-2 rounded-md">
                            {(activeTab == "Notifications" && notifications) && (isEmpty(notifications) ?
                                <div className="w-full text-slate-600 font-bold text-center">No notification</div>
                                :
                                notifications.map((notification: any) => (
                                    <div key={notification.id} className="flex flex-row gap-4 items-center justify-start w-full rounded-md border-[1px] border-white shadow-md">
                                        <div className="w-auto">
                                            <IoIosCheckmarkCircle className={`${notification.type === "success" ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                                            <IoIosInformationCircle className={`${notification.type === "info" ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                                            <IoIosWarning className={`${notification.type === "warning" ? "inline-block" : "hidden"} m-2 text-orange-500`} size={30} />
                                            <RiIndeterminateCircleFill className={`${notification.type === "error" ? "inline-block" : "hidden"} m-2 text-red-500`} size={30} />
                                        </div>
                                        <div className="w-[80%]">
                                            <p className="text-slate-900 font-semibold text-sm max-w-[95%] row-span-2 truncate text-ellipsis">{notification.content}</p>
                                            <p className="text-xs">{new Date(notification.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )))}
                            {(activeTab == "Uploads" && uploads) && (isEmpty(uploads) ?
                                <div className="w-full text-slate-600 font-bold text-center">No upload</div>
                                :
                                uploads.map((upload: any) => (
                                    <div key={upload.id} className="flex flex-row gap-4 items-center justify-start w-full rounded-md border-[1px] border-white shadow-md">
                                        <div className="w-auto">
                                            <IoIosCheckmarkCircle className={`${upload?.uploadedBy ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                                            <MdPending className={`${upload?.userName ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                                        </div>
                                        <div className="w-[80%]">
                                            <p className="text-slate-900 font-semibold text-sm max-w-[95%] row-span-2 truncate text-ellipsis">{upload.title}</p>
                                            <p className="text-xs">{new Date(upload.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )))}
                            {(activeTab == "Favorites" && favorites) && (isEmpty(favorites) ?
                                <div className="w-full text-slate-600 font-bold text-center">No favorites</div>
                                :
                                favorites.map((favorite: any) => (
                                    <div key={favorite.id} className="flex flex-row gap-4 items-center justify-between px-4 w-full rounded-md border-[1px] border-white shadow-md">
                                        <div className="w-[80%] flex flex-row items-center gap-4 py-1">
                                            <img src={favorite?.thumbUrl} className="rounded-md h-14" alt="" />
                                            <div className="w-full flex flex-col">
                                                <p className="text-slate-900 font-semibold text-sm max-w-[95%] row-span-2 truncate text-ellipsis">{favorite.title}</p>
                                                <p className="leading-none text-sm font-light">{favorite?.type} - {favorite?.type == "Movies" ? favorite?.duration : `${favorite?.seasons.split(",").length} Season${favorite?.seasons.split(",").length > 1 ? "s" : ""}`}</p>
                                            </div>
                                        </div>
                                    </div>
                                )))}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                closeOnClick
                draggable
                theme="colored" />
        </div >
    )
}

export default Account;