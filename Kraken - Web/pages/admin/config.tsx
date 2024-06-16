import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";
import { FaImdb, FaShieldAlt } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import { MdWarning } from "react-icons/md";

export default function Config() {
    const { data: serverProps } = useServerProps()
    const [imdbKey, setImdbKey] = useState<string | undefined>(undefined)
    const [naSecret, setNaSecret] = useState<string | undefined>(undefined)
    const [jwtSecret, setJwtSecret] = useState<string | undefined>(undefined)

    const saveConfig = async () => {
        await axios.post("/api/serverProps", { imdbKey: imdbKey, naSecret: naSecret, jwtSecret: jwtSecret })
    }

    return (
        <AdminLayout pageName="Config">
            <div className="w-full h-fit flex flex-col gap-4 p-4 bg-slate-800 rounded-md">
                <div className="w-full flex flex-row items-center justify-between text-white">
                    <p className="text-2xl font-semibold">Kraken Configuration</p>
                    <div onClick={saveConfig} className={imdbKey || naSecret || jwtSecret ? "ml-auto flex flex-row items-center gap-2 cursor-cointer px-2 py-1 rounded-md bg-blue-500 border-blue-600 cursor-pointer hover:bg-blue-400 hover:border-blue-500 border-2 transition-all duration-300" : "hidden"}>
                        <IoMdSave />
                        Save config
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-8">
                    <div className="w-full flex flex-col gap-2 text-white">
                        <div className="flex flex-row items-center gap-2">
                            <BsDatabaseFillGear />
                            <p className="font-semibold text-xl">Databse configuration :</p>
                        </div>
                        <table className="w-fit border-separate border-spacing-x-2">
                            <tbody>
                                <tr>
                                    <td>Client : </td>
                                    <td className="capitalize text-red-500 font-semibold">{serverProps?.databaseConfig.split(":")[0]}</td>
                                </tr>
                                <tr>
                                    <td>Host : </td>
                                    <td className="text-red-500 font-semibold">{serverProps?.databaseConfig.split("@")[1].split("/")[0].split(":")[0]} ({serverProps?.databaseConfig.split("@")[1].split("/")[0].split(":")[1]})</td>
                                </tr>
                                <tr>
                                    <td>Username :</td>
                                    <td className="text-red-500 font-semibold">{serverProps?.databaseConfig.split(":")[1].split("//")[1]}</td>
                                </tr>
                                <tr>
                                    <td>Password :</td>
                                    <td className="text-red-500 font-semibold">{serverProps?.databaseConfig.split("@")[0].split("//")[1].split(":")[1]}</td>
                                </tr>
                                <tr>
                                    <td>Database :</td>
                                    <td className="text-red-500 font-semibold">{serverProps?.databaseConfig.split("/").pop()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr className="border-slate-400" />
                    <div className="w-full flex flex-col gap-2 text-white">
                        <div className="flex flex-row items-center gap-2">
                            <FaImdb />
                            <p className="font-semibold text-xl">Imdb API :</p>
                        </div>
                        <div className="w-full grid grid-cols-[5%_95%] items-center gap-2 px-2">
                            <p>Key : </p>
                            <textarea onChange={(e) => setImdbKey(e.currentTarget.value)} placeholder={serverProps?.imdbAPIKey} className="placeholder:overflow-auto focus:outline-none text-red-500 min-w-full h-full resize-none bg-transparent rounded-md border-[1px] border-slate-900 px-2"></textarea>
                        </div>
                    </div>
                    <hr className="border-slate-400" />
                    <div className="w-full flex flex-col gap-4 text-white">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center gap-2">
                                <FaShieldAlt />
                                <p className="font-semibold text-xl">Security :</p>
                            </div>
                            <div className="text-xs flex flex-row items-center gap-2 font-light leading-none">
                                <MdWarning className="text-orange-500" />
                                Changing these values will log you out.
                            </div>
                        </div>
                        <div className="grid grid-cols-[15%_85%] gap-2 items-center">
                            <p>Next-Auth URL :</p>
                            <p className="text-red-500 font-semibold">{serverProps?.nextAuthUrl}</p>
                            <p>Next-Auth Secret : </p>
                            <p className="capitalize text-red-500 font-semibold">
                                <input onChange={(e) => setNaSecret(e.currentTarget.value)} type="text" placeholder="************" className="bg-transparent w-full focus:outline-none" />
                            </p>
                            <p>JWT Secret : </p>
                            <p className="capitalize text-red-500 font-semibold">
                                <input onChange={(e) => setJwtSecret(e.currentTarget.value)} type="text" placeholder="************" className="bg-transparent w-full focus:outline-none" />
                            </p>
                        </div>
                        <table className="w-fit border-separate border-spacing-x-2">
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout >
    )
}