import axios from "axios";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UpdateUser = (userId: string, userRole: string, userName: string) => {
    axios.get("/api/pendingAccounts", { params: { userId: userId, userRole: userRole } })
    toast.success("User accepted : " + userName,
        {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
};

const RejectUser = (userId: string, userName: string) => {
    axios.delete("/api/pendingAccounts", { data: { userId } })
    toast.error("Rejected user : " + userName,
        {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
}

const PendingUser = (data: any) => {

    const user = data?.data
    const [role, setRole] = useState("user")

    return (
        <div className="flex flex-row items-center pr-5 w-full h-14 border-b-2 border-white">
            <div className="w-full h-full flex flex-row items-center gap-8">
                <img className="rounded-md h-14 w-14" src={user?.image || "/Assets/Images/default_profile.png"} alt="thumbnail" />
                <div className="w-[30%] flex flex-row items-center gap-2 overflow-hidden">
                    <p className="text-zinc-800 font-semibold">Username : </p>
                    <p className="text-white font-semibold text-ellipsis overflow-hidden">{user?.name}</p>
                </div>
                <div className="w-[30%] flex flex-row items-center gap-2 overflow-hidden">
                    <p className="text-zinc-800 font-semibold">Email : </p>
                    <p className="text-white font-semibold text-ellipsis overflow-hidden">{user?.email}</p>
                </div>
                <div className="flex flex-row items-center gap-2 mr-10 ml-auto">
                    <p className="text-zinc-800 font-semibold">Role : </p>
                    <select onChange={(e) => { setRole((role) => e.target.value) }} className="bg-zinc-600 rounded-md border-2 border-zinc-800 text-white focus:outline-none px-1" name="roles" id="roles">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-row items-center gap-5">
                <button>
                    <FaCheck onClick={(e) => { UpdateUser(user?.id, role, user?.name) }} className="text-green-500" size={20} />
                </button>
                <button>
                    <ImCross onClick={(e) => { RejectUser(user?.id, user?.name) }} className="text-red-600" size={15} />
                </button>
                <ToastContainer position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </div>
    )
}

export default PendingUser;

