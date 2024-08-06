import Input from "@/components/Input";
import { AdminLayout } from "@/pages/_app";
import { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddUser() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();

    const CreateUser = useCallback(async () => {
        try {
            axios.post('/api/register', {
                email,
                name,
                password,
                role
            }).catch((err) => {
                toast.error(`Something went wrong : ${err.response.data}`, { containerId: "AdminContainer" })
            }).then(() => {
                toast.success(`New ${role} created.`, { containerId: "AdminContainer" })
            })
        } catch (error) {
            console.log(error);
        }
    }, [email, name, password, role]);

    return (
        <AdminLayout parentName="Pending Access" pageName="Add User">
            <div className="h-fit flex flex-col gap-4 p-4 bg-slate-800 rounded-md">
                <div className="text-xl font-bold text-white">
                    Create new user :
                </div>
                <div className="w-full h-full flex flex-col gap-4">
                    <form className="w-full flex flex-col gap-4" action="">
                        <div className="w-full grid grid-cols-2 gap-4 p-auto items-center">
                            <Input
                                label="Username"
                                onChange={(ev: any) => setName(ev.target.value)}
                                id="name"
                                value={name}
                                type="username"
                                width="w-full"
                                isMandatory
                            />

                            <Input
                                label="Email"
                                onChange={(ev: any) => setEmail(ev.target.value)}
                                id="email"
                                type="email"
                                value={email}
                                width="w-full"
                                isMandatory
                            />
                            <Input
                                label="Password"
                                onChange={(ev: any) => setPassword(ev.target.value)}
                                id="password"
                                type="password"
                                value={password}
                                width="w-full"
                                isMandatory
                            />
                            <div className="capitalize rounded-md px-6 h-full w-full text-white bg-neutral-700 ">
                                <select onChange={(e) => setRole(e.currentTarget.value)} className="w-full h-full bg-neutral-700 focus:outline-none" name="" id="" value={role}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <div className="w-full flex flex-row items-center justify-between h-10">
                        <div onClick={() => { router.push(".") }} className="w-28 px-2 py-1 rounded-md bg-slate-500 cursor-pointer flex flex-row items-center gap-2 hover:bg-slate-400 transition-all duration-200" >
                            <FaArrowLeft />
                            Access
                        </div>
                        <button onClick={CreateUser} className={`${role == "admin" ? "bg-red-500 hover:bg-red-400" : "bg-green-500 hover:bg-green-400"} w-28 px-2 py-1 rounded-md transition-all duration-200`}>Create {role}</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}