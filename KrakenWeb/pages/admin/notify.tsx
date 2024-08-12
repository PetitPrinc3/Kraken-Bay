import { AdminLayout } from "@/pages/_app";
import { useState } from "react";
import { IoIosInformationCircle, IoIosWarning, IoIosCheckmarkCircle } from "react-icons/io";
import { RiIndeterminateCircleFill } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Notify() {
    const [email, setEmail] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState("info")
    const [everyone, setEveryone] = useState(false)

    const sendNotification = async () => {
        await axios.post("/api/notifications", { recipient: everyone ? "all" : email, content: desc, type: type }).then(() => {
        }).then((res) => {
            toast.success("User notified !", { containerId: "AdminContainer" })
            setEmail("")
            setDesc("")
            setType("info")
            setEveryone(false)
            return
        }).catch((err) => {
            toast.error(`Oops, something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
        })
    }

    return (
        <AdminLayout pageName="notify" >
            <div className="flex flex-col gap-4 justify-between items-start p-2 bg-slate-800 rounded-md">
                <div className="w-full text-white text-md font-semibold p-2">
                    Notification :
                </div>
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full pl-1 flex flex-row items-center gap-4">
                        <label className="flex flex-row items-center cursor-pointer">
                            <input type="checkbox" onChange={(e) => { setEveryone(e.currentTarget.checked) }} checked={everyone} className="sr-only peer" />
                            <div className={`relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-slate-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${type === "success" ? "peer-checked:bg-green-500" : type === "info" ? "peer-checked:bg-blue-500" : type === "warning" ? "peer-checked:bg-orange-500" : type === "error" ? "peer-checked:bg-red-500" : "peer-checked:bg-white"}`} />
                        </label>
                        <span className="text-sm font-medium text-slate-400">Notify everyone</span>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="h-full w-full text-white flex flex-row gap-2 md:gap-4 items-center">
                            <div onClick={() => { if (everyone) setEveryone(false) }} className={`w-full h-full rounded-md transition-all duration-200 ${everyone ? "bg-slate-700 text-slate-400" : "bg-slate-600 text-white placeholder:text-slate-400"}`}>
                                <input onChange={(e) => setEmail(e.currentTarget.value)} value={email} type="text" className={`${everyone && "placeholder:text-slate-800"} w-full h-ful bg-transparent px-6 py-2 focus:outline-none`} placeholder={everyone ? "Everyone" : "Email"} />
                            </div>
                        </div>
                        <div className="capitalize rounded-md px-6 h-full w-full text-white bg-slate-600">
                            <select onChange={(e) => setType(e.currentTarget.value)} className="w-full h-full bg-slate-600 focus:outline-none" name="" id="" value={type}>
                                <option value="success">Success</option>
                                <option value="info">Info</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full">
                        <textarea
                            onChange={(e: any) => { setDesc(e.currentTarget.value) }}
                            value={desc}
                            id=""
                            className="block h-24 w-full resize-none rounded-md px-4 pt-4 pb-1 text-md text-white bg-slate-600 appearance-none focus:outline-none focus:ring-0 peer"
                            placeholder="Notification content"
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col gap-2 items-start">
                    <div className="w-full text-white text-md font-semibold p-2">
                        Preview :
                    </div>
                    <div className="bg-slate-900 rounded-md w-full h-fit">
                        <div className="flex flex-row items-center justify-start w-full">
                            <IoIosCheckmarkCircle className={`${type === "success" ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                            <IoIosInformationCircle className={`${type === "info" ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                            <IoIosWarning className={`${type === "warning" ? "inline-block" : "hidden"} m-2 text-orange-500`} size={30} />
                            <RiIndeterminateCircleFill className={`${type === "error" ? "inline-block" : "hidden"} m-2 text-red-500`} size={30} />
                            <p className="text-white max-w-[80%] row-span-2 truncate text-ellipsis">{desc}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <button onClick={sendNotification} className="w-20 p-1 px-2 rounded-md bg-purple-600 border-2 border-purple-700 text-sm hover:bg-purple-500 transition-all duration-100">Send</button>
                </div>
            </div>
        </AdminLayout>
    )
}