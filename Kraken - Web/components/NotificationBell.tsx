import useNewNotifications from "@/hooks/useNewNotifications";
import axios from "axios";
import { isUndefined } from "lodash";
import { useRef, useState, useCallback } from "react";
import { BsBell } from "react-icons/bs";
import { IoIosInformationCircle, IoIosWarning, IoIosCheckmarkCircle } from "react-icons/io";
import { RiIndeterminateCircleFill } from "react-icons/ri";

const NotificationBell = () => {
    const [visible, setVisible] = useState(false)
    const [hasNew, setHasNew] = useState(true)
    const { data: notifications } = useNewNotifications();
    const notificatioPanel = useRef(null)

    const handleBlur = useCallback((e: any) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setVisible(false);
            }
        });
    }, [setVisible]);

    const viewNotifications = () => {
        if (visible) {
            setVisible(false)
            setHasNew(false)
            axios.delete("/api/newNotifications")
        } else {
            setVisible(true)
            notificatioPanel.current?.focus()
            console.log(notificatioPanel.current)
        }
    }

    if (isUndefined(notifications)) {
        return (
            <>
                <div className="hidden md:block relative text-white cursor-pointer" onClick={() => viewNotifications()}>
                    <BsBell />
                </div>
            </>
        )
    }

    return (
        <div className="relative">
            <div className="hidden md:block relative text-white cursor-pointer" onClick={() => viewNotifications()}>
                <BsBell />
                <div className={`${notifications.length > 0 && hasNew ? "absolute" : "hidden"} top-0 right-0 rounded-full bg-red-500 h-2 p-1`}></div>
            </div>
            <div ref={notificatioPanel} onBlur={handleBlur} tabIndex={0}>
                {visible && (
                    <div className="hidden md:block">
                        <div className="absolute right-0 -bottom-4 border-b-8 border-b-white border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
                        <div className={`absolute flex flex-col items-center mt-4 ${notifications.length > 0 ? "pt-2" : ""} right-0 w-[50vw] lg:w-[30vw] bg-black bg-opacity-80 rounded-md rounded-tr-none border-2 border-white`} >
                            {notifications.map((notification: any) => (
                                <div key={notification.id} className="flex flex-row items-center justify-start w-full">
                                    <IoIosCheckmarkCircle className={`${notification.type === "success" ? "inline-block" : "hidden"} m-2 text-green-500`} size={30} />
                                    <IoIosInformationCircle className={`${notification.type === "info" ? "inline-block" : "hidden"} m-2 text-blue-500`} size={30} />
                                    <IoIosWarning className={`${notification.type === "warning" ? "inline-block" : "hidden"} m-2 text-orange-500`} size={30} />
                                    <RiIndeterminateCircleFill className={`${notification.type === "error" ? "inline-block" : "hidden"} m-2 text-red-500`} size={30} />
                                    <p className="text-white max-w-[80%] row-span-2 truncate text-ellipsis">{notification.content}</p>
                                </div>
                            ))}
                            {notifications.length > 0 && (<hr className="w-[90%] border-1 mt-2 border-zinc-400" />)}
                            <a href="/account" className="text-white my-2 hover:underline">View all notifications</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotificationBell;