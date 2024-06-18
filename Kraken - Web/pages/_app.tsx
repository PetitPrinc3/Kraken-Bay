import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react"
import useCurrentUser from "@/hooks/useCurrentUser"
import { RiDashboardFill, RiUserSettingsFill, RiPassPendingFill } from "react-icons/ri";
import { BsFillCloudUploadFill, BsDatabaseFillGear } from "react-icons/bs";
import { BiSolidServer } from "react-icons/bi";
import { MdOutlineVideoSettings, MdNotificationAdd } from "react-icons/md";
import { ImLifebuoy } from "react-icons/im";
import { FaTools, FaHome, FaGithub, FaStar } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { VscCoffee } from "react-icons/vsc";
import { ToastContainer } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { IoMenu } from "react-icons/io5";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export function AdminLayout({
  children,
  pageName,
  parentName = pageName
}: {
  children: React.ReactNode,
  pageName?: string
  parentName?: string,
}) {
  const { data: user } = useCurrentUser()
  const [dispSize, setDispSize] = useState(15)
  const [sidePanel, setSidePanel] = useState(false)
  const router = useRouter();
  const pendingUsers = 0
  const pendingUploads = 0

  return (
    <main className="min-w-full w-fit max-w-full min-h-full max-h-full flex flex-row md:grid md:grid-cols-[20%_80%] lg:grid-cols-[15%_85%] bg-slate-950 overflow-auto">
      <div className="flex flex-row">
        <div className={`h-full ${sidePanel ? "-translate-x-0" : "-translate-x-full"} w-[60%] transition-all duration-500 md:translate-x-0 md:w-full bg-slate-800 max-md:absolute flex flex-col gap-8 md:gap-4 py-2 z-10 overflow-hidden`}>
          <div className="w-full flex flex-row items-center">
            <div className="relative grid grid-cols-[40%_60%] md:grid-cols-[25%_75%] p-2 z-50">
              <div className="w-full m-auto p-2">
                <img className="max-w-full rounded-full bg-neutral-800" src={user?.image || "/Assets/Images/default_profile.png"} alt="" />
              </div>
              <div className="flex flex-col my-auto">
                <p className="font-bold text-2xl leading-none">{user?.name}</p>
                <p className="font-light text-red-500 text-sm leading-none">Administrator</p>
              </div>
            </div>
            <div className="w-fit flex md:hidden items-end text-slate-400 justify-end px-8 cursor-pointer">
              <RxCross2 onClick={() => setSidePanel(!sidePanel)} className={`${sidePanel ? "rotate-90" : "rotate-0"} transition-all duration-300`} size={30} />
            </div>
          </div>
          <div className="flex flex-col gap-8 md:gap-4 text-white">
            <div className="flex flex-col gap-1">
              <p className="mx-2 font-semibold text-sm text-neutral-400">Kraken Bay</p>
              <ul className="cursor-pointer px-2 space-y-1">
                <li onClick={() => { router.push("/admin") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "admin" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <RiDashboardFill size={dispSize} />
                  Dashboard
                </li>
                <li onClick={() => { router.push("/admin/access") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "Pending Access" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <RiPassPendingFill size={dispSize} />
                  Access
                  <div className={`${pendingUsers > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                    <p className="m-auto rounded-full">{pendingUsers}</p>
                  </div>
                </li>
                <li onClick={() => { router.push("/admin/notify") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "notify" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <MdNotificationAdd size={dispSize} />
                  Notify
                  <div className={`${pendingUsers > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                    <p className="m-auto rounded-full">{pendingUsers}</p>
                  </div>
                </li>
                <li onClick={() => { router.push("/admin/uploads") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "Pending Uploads" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <BsFillCloudUploadFill size={dispSize} />
                  Uploads
                  <div className={`${pendingUploads > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                    <p className="m-auto rounded-full">{pendingUploads}</p>
                  </div>
                </li>
                <li onClick={() => { router.push("/admin/server") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "server" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <BiSolidServer size={dispSize} />
                  Server
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <p className="mx-2 font-semibold text-sm text-neutral-400">Databases</p>
              <ul className="cursor-pointer px-2 space-y-1">
                <li onClick={() => { router.push("/admin/databases/manage") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "manage" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <BsDatabaseFillGear size={dispSize} />
                  Manage DBs
                </li>
                <li onClick={() => { router.push("/admin/databases/media") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "media" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <MdOutlineVideoSettings size={dispSize} />
                  Media DB
                </li>
                <li onClick={() => { router.push("/admin/databases/users") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "users" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <RiUserSettingsFill size={dispSize} />
                  User DB
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-1">
              <p className="mx-2 font-semibold text-sm text-neutral-400">Settings</p>
              <ul className="cursor-pointer px-2 space-y-1">
                <li onClick={() => { router.push("/admin/config") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "Config" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <FaTools size={dispSize} />
                  Config
                </li>
                <li onClick={() => { router.push("/admin/help") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "Help" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 transition-all duration-200`}>
                  <ImLifebuoy size={dispSize} />
                  Help
                </li>
                <li onClick={() => { router.push("/home") }} className="w-full rounded-md flex flex-row items-center gap-2 hover:bg-red-500 px-4 py-2 transition-all duration-200">
                  <FaHome size={dispSize} />
                  Go Home
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-fit p-4 grid grid-rows[10%_90%] gap-4">
        <div className="w-full h-full min-h-14 flex flex-row gap-4 items-center bg-slate-800 rounded-md px-4 py-3">
          <div onClick={() => setSidePanel(!sidePanel)} className="md:hidden text-slate-400">
            <IoMenu size={30} />
          </div>
          <p className="ml-0 font-bold text-red-500 capitalize">
            {pageName}
          </p>
          <div className="h-8 ml-auto mr-0">
            <img src="/Assets/Images/logo.png" className="max-h-full" alt="" />
          </div>
        </div>
        <div className="max-w-full overflow-hidden">
          {children}
        </div>
        <div className="flex flex-col items-center w-full h-fit rounded-md bg-slate-800 p-4">
          <div className="w-full px-[10%] grid grid-cols-4 text-xs text-white font-semibold">
            <div className="flex flex-col items-center">
              <a className="flex flex-col items-center hover:text-red-600 transition duration-300" href="https://github.com/PetitPrinc3">
                <FaGithub size={20} />
                <p className="hidden md:block mt-1">Follow Me</p>
              </a>
            </div>
            <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
              <a className="flex flex-col items-center" href="https://github.com/PetitPrinc3/Kraken-Web">
                <FaStar size={20} />
                <p className="hidden md:block mt-1">Star Me</p>
              </a>
            </div>
            <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
              <a className="flex flex-col items-center" href="mailto:arthur.reppelin@gmail.com">
                <RiMailSendLine size={20} />
                <p className="hidden md:block mt-1">Contact me</p>
              </a>
            </div>
            <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
              <a className="flex flex-col items-center" href="https://www.paypal.com/paypalme/AReppelin">
                <VscCoffee size={20} />
                <p className="hidden md:block mt-1">Buy me a Coffee</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute max-h-[30vh] overflow-hidden">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          closeOnClick
          draggable
          theme="colored"
          containerId={"AdminContainer"}
        />
      </div>
    </main>
  )
}