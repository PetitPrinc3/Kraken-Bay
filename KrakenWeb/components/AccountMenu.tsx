import { signOut } from "next-auth/react";
import React from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";

interface AccountMenuProps {
    visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
    const { data: user } = useCurrentUser();
    const router = useRouter();

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black bg-opacity-80 rounded-md w-56 absolute top-10 md:top-14 right-0 py-5 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-3">
                <div className="px-3 group/item flex flex-row gap-3 items-center w-full">
                    <img className="w-8 rounded-md" src={user?.image || "/Assets/Images/default_profile.png"} alt="" />
                    <div onClick={() => router.push("/account")} className="text-white text-sm group-hover/item:underline">
                        {user?.name} ({user?.roles})
                    </div>
                </div>
                <hr className={`${user?.roles != "admin" ? "hidden" : ""} mx-4 bg-gray-600 border-0 h-px`} />
                <div className={`${user?.roles != "admin" ? "hidden" : ""} flex flex-col items-center`}>
                    <div className="px-3 group/item flex flex-row gap-3 items-center justify-center w-full">
                        <div className="text-white text-sm group-hover/item:underline" onClick={() => router.push("/admin")}>
                            Admin Pannel
                        </div>
                    </div>

                </div>
                <hr className={`${user?.roles == "admin" ? "" : "my-4"} bg-gray-600 border-0 h-px`} />
                <div onClick={async () => { await signOut({ callbackUrl: "/auth" }) }} className="px-3 text-center text-white text-sm hover:underline">
                    Sign Out
                </div>
            </div>
        </div>
    )
}

export default AccountMenu;