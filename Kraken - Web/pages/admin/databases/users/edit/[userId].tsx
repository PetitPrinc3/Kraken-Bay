import useUsers from "@/hooks/useUsers";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdOutlineEdit } from "react-icons/md"
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Edit() {
    const router = useRouter()
    const { userId } = router.query
    const { data: user, mutate: mutateUser } = useUsers({ userId: userId })
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [imageFile, setImageFile] = useState<File>()
    const [email, setEmail] = useState("")
    const [roles, setRoles] = useState("")
    const [favoriteIds, setFavoriteIds] = useState("")
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [skipPrompt, setSkipPrompt] = useState<boolean>(false)
    const [resetPassword, setResetPassword] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useState(true)
    const profileRef = useRef<any>()

    useEffect(() => {
        if (!isUndefined(user?.name) && firstLoad) {
            setFirstLoad(false)
            setName(user.name)
            setImage(user.image)
            setEmail(user.email)
            setRoles(user.roles)
            setFavoriteIds(user.favoriteIds)
            setIsMuted(user.isMuted)
            setSkipPrompt(user.skipPrompt)
        }
    }, [name, email, favoriteIds, isMuted, skipPrompt, firstLoad, user])

    const handleDelete = async () => {
        await axios.delete("/api/users", { params: { userId: userId } }).catch((err) => {
            toast.clearWaitingQueue()
            toast.error("Something went wrong.", { containerId: "AdminContainer" })
        }).then((data) => {
            if (!isUndefined(data)) {
                toast.clearWaitingQueue()
                toast.success("Entry removed.", { containerId: "AdminContainer" })
                mutateUser()
                router.push("..")
            }
        })
    }

    const handleUpdate = async () => {

        if (imageFile == undefined) {
            await axios.post("/api/users", {
                userData: {
                    id: userId,
                    name: name,
                    hashedPassword: resetPassword ? "kraken" : undefined,
                    email: email,
                    roles: roles,
                    videoUrl: user.videoUrl,
                    favoriteIds: favoriteIds,
                    isMuted: isMuted,
                    skipPrompt: skipPrompt,
                }
            }).catch((err) => {
                toast.error("Oops something went wrong...", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.success("Profile updated !", { containerId: "AdminContainer" })
                }
                setResetPassword(false)
            })
            await mutateUser()
        } else {
            const imageData = imageFile as File
            const buffer = await imageData.arrayBuffer()
            const imageBuffer = Buffer.from(buffer)
            await axios.post("/api/users", {
                userData: {
                    id: userId,
                    name: name,
                    image: { imageBuffer: imageBuffer, fileName: imageData.name },
                    hashedPassword: resetPassword ? "kraken" : undefined,
                    email: email,
                    roles: roles,
                    videoUrl: user.videoUrl,
                    favoriteIds: favoriteIds,
                    isMuted: isMuted,
                    skipPrompt: skipPrompt,
                }
            }).catch((err) => {
                toast.error("Oops something went wrong...", { containerId: "AdminContainer" })
            }).then((data) => {
                if (!isUndefined(data)) {
                    toast.success("Profile updated !", { containerId: "AdminContainer" })
                }
                setResetPassword(false)
            })
            await mutateUser()
        }
        setFirstLoad(true)
    }

    const changeProfile = async (e: any) => {
        const image = profileRef.current?.files
        if (image.length != 1) {
            toast.error("What did you do ?!")
            profileRef.current.files = []
            setImage("")
            return
        } else {
            setImage(URL.createObjectURL(image[0]))
            setImageFile(e.target.files[0])
        }
    }

    return (
        <AdminLayout parentName="user" pageName="Edit" >
            <div className={`${isUndefined(user) ? "animate-pulse" : ""} w-full h-fit flex flex-col gap-4 p-4 bg-slate-800 rounded-md`}>
                <div className="text-xl text-white font-semibold">
                    {user?.name} :
                </div>
                <div className="flex flex-row items-center gap-4 p-2 border-[1px] rounded-md justify-start h-fit text-white">
                    <p className="[writing-mode:vertical-lr] rotate-180">Images</p>
                    <div onClick={() => { profileRef.current.click() }} className="flex flex-col p-2 bg-slate-600 rounded-md cursor-pointer">
                        <input onChange={changeProfile} ref={profileRef} type="file" className="hidden" />
                        <img src={image} className="h-20 object-contain" alt="No Profile" />
                        <p className="w-full text-center text-sm font-light underline">Profile</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-4 p-2 border-[1px] rounded-md justify-start h-fit text-white">
                    <p className="[writing-mode:vertical-lr] rotate-180">Text</p>
                    <table className="w-full table-fixed border-separate border-spacing-y-2">
                        <thead className="font-semibold">
                            <tr className="">
                                <td className="w-[35%] md:w-[20%]">Field</td>
                                <td className="w-[65%] md:w-[80%]">Value</td>
                            </tr>
                        </thead>
                        <tbody className="font-light">
                            <tr>
                                <td>
                                    Name
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setName(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={name} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    email
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setEmail(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={email} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Roles
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setRoles(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={roles} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    FavoriteIds
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setFavoriteIds(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={favoriteIds} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    isMuted
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <input onChange={(e) => setIsMuted(e.currentTarget.checked)} type="checkbox" className="bg-transparent focus:outline-none" name="" id="" checked={isMuted} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    SkipPrompt
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <input onChange={(e) => setSkipPrompt(e.currentTarget.checked)} type="checkbox" className="bg-transparent focus:outline-none" name="" id="" checked={skipPrompt} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Reset Password
                                </td>

                                <td className="w-full flex flex-row gap-2 items-center">
                                    <input onChange={(e) => setResetPassword(e.currentTarget.checked)} type="checkbox" className="bg-transparent my-auto focus:outline-none" name="" id="" checked={resetPassword} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div onClick={() => router.push("..")} className="py-1 px-2 rounded-md bg-blue-500 border-2 border-blue-400 hover:bg-blue-400 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                        Go Back
                    </div>
                    <div onClick={handleDelete} className="py-1 px-2 rounded-md bg-red-500 border-2 border-red-400 hover:bg-red-400 hover:border-red-300 transition-all duration-300 cursor-pointer">
                        Delete entry
                    </div>
                    <div onClick={handleUpdate} className="py-1 px-2 rounded-md bg-green-500 border-2 border-green-400 hover:bg-green-400 hover:border-green-300 transition-all duration-300 cursor-pointer">
                        Apply
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}