import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState } from "react"
import useCurrentUser from "@/hooks/useCurrentUser"
import { RiDashboardFill, RiUserSettingsFill, RiPassPendingFill } from "react-icons/ri";
import { BsFillCloudUploadFill, BsDatabaseFillGear } from "react-icons/bs";
import { BiSolidServer } from "react-icons/bi";
import { MdMovie, MdNotificationAdd, MdSearch } from "react-icons/md";
import { FaTools, FaHome, FaGithub, FaStar } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { VscCoffee } from "react-icons/vsc";
import { ToastContainer } from "react-toastify";

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
  const router = useRouter();
  const pendingUsers = 0
  const pendingUploads = 0
  return (
    <main className="min-w-full w-fit min-h-full h-fit grid md:grid-cols-[20%_80%] lg:grid-cols-[15%_85%] bg-slate-950">
      <div className="h-full w-full bg-slate-800 flex flex-col gap-4 py-2 z-50">
        <div className="relative grid grid-cols-[25%_75%] p-2 z-50">
          <div className="w-full m-auto p-2">
            <img className="max-w-full rounded-full bg-neutral-800" src={user?.image || "/Assets/Images/default_profile.png"} alt="" />
          </div>
          <div className="flex flex-col my-auto">
            <p className="font-bold text-2xl leading-none">{user?.name}</p>
            <p className="font-light text-red-500 text-sm leading-none">Administrator</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="mx-2 font-semibold text-sm text-neutral-400">Kraken Bay</p>
            <ul className="cursor-pointer px-2 space-y-1">
              <li onClick={() => { router.push("/admin") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "admin" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <RiDashboardFill size={dispSize} />
                Dashboard
              </li>
              <li onClick={() => { router.push("/admin/access") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "access" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <RiPassPendingFill size={dispSize} />
                Access
                <div className={`${pendingUsers > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                  <p className="m-auto rounded-full">{pendingUsers}</p>
                </div>
              </li>
              <li onClick={() => { router.push("/admin/notify") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "notify" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <MdNotificationAdd size={dispSize} />
                Notify
                <div className={`${pendingUsers > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                  <p className="m-auto rounded-full">{pendingUsers}</p>
                </div>
              </li>
              <li onClick={() => { router.push("/admin/uploads") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "uploads" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <BsFillCloudUploadFill size={dispSize} />
                Uploads
                <div className={`${pendingUploads > 0 ? "flex" : "hidden"} h-5 w-5 rounded-full bg-cyan-500 items-center text-xs text-white mr-0 ml-auto`}>
                  <p className="m-auto rounded-full">{pendingUploads}</p>
                </div>
              </li>
              <li onClick={() => { router.push("/admin/server") }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "server" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <BiSolidServer size={dispSize} />
                Server
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <p className="mx-2 font-semibold text-sm text-neutral-400">Databases</p>
            <ul className="cursor-pointer px-2">
              <li onClick={() => { }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <MdMovie size={dispSize} />
                Media DB
              </li>
              <li onClick={() => { }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <RiUserSettingsFill size={dispSize} />
                User DB
              </li>
              <li onClick={() => { }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <BsDatabaseFillGear size={dispSize} />
                Manage DBs
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-1">
            <p className="mx-2 font-semibold text-sm text-neutral-400">Settings</p>
            <ul className="cursor-pointer px-2">
              <li onClick={() => { }} className={`w-full rounded-md flex flex-row items-center gap-2 ${parentName == "" ? "bg-gradient-to-l from-red-500 from-5% to-transparent to-100%" : "hover:bg-red-500"} px-4 py-2 font-semibold transition-all duration-200`}>
                <FaTools size={dispSize} />
                Config
              </li>
              <li className="w-full rounded-md flex flex-row items-center gap-2 hover:bg-red-500 px-4 py-2 font-semibold transition-all duration-200">
                <FaHome size={dispSize} />
                Go Home
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full h-fit p-4 grid grid-rows[10%_90%] gap-4">
        <div className="w-full h-full min-h-14 flex flex-row items-center bg-slate-800 rounded-md px-4 py-3">
          <p className="ml-0 font-bold text-red-500 capitalize">
            {pageName}
          </p>
          <div className="h-8 w-[30%] lg:w-[20%] grid grid-cols-[15%_85%] bg-slate-400 rounded-md items-center ml-auto mr-0">
            <MdSearch className="m-auto" size={20} />
            <input type="text" placeholder="Search" className="bg-transparent focus:outline-none text-neutral-900 mr-2" />
          </div>
        </div>
        {children}
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
      <div className="absolute">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          newestOnTop={false}
          draggable
          pauseOnHover
          theme="colored"
          containerId={"AdminContainer"}
        />
      </div>
    </main>
  )
}