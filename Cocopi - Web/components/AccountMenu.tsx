import { signOut } from "next-auth/react";
import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";

interface AccountMenuProps {
    visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
    const { data: user } = useCurrentUser();

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black bg-opacity-80 rounded-md w-56 absolute top-10 md:top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
                    <img className="w-8 rounded-md" src={`${!user?.image ? "/Assets/Images/default_profile.png" : user?.image}`} alt="" />
                    <a href="/account" className="text-white text-sm group-hover/item:underline">
                        {user?.name} ({user?.roles})
                    </a>
                </div>
                <hr className={`${user?.roles != "admin" ? "hidden" : ""} mx-4 bg-gray-600 border-0 h-px`} />
                <div className={`${user?.roles != "admin" ? "hidden" : ""} flex flex-col items-center`}>
                    <div className="px-3 group/item flex flex-row gap-3 items-center justify-center w-full">
                        <a className="text-white text-sm group-hover/item:underline" href="/admin">
                            Admin Pannel
                        </a>
                    </div>

                </div>
                <hr className={`${user?.roles == "admin" ? "" : "my-4"} bg-gray-600 border-0 h-px`} />
                <div onClick={() => signOut()} className="px-3 text-center text-white text-sm hoverunderline">
                    Sign Out
                </div>
            </div>
        </div>
    )
}

export default AccountMenu;