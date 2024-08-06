import { useRouter } from "next/router";
import React from "react";

interface MobileMenuProps {
    visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
    const router = useRouter();
    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black bg-opacity-80 w-56 absolute top-10 md:top-14 left-0 py-5 flex-col border-2 rounded-md border-gray-800 flex">
            <div className="flex flex-col gap-4">
                <div onClick={() => router.push("/home")} className="px-3 text-center text-white hover:underline">
                    Home
                </div>
                <div onClick={() => router.push("/movies")} className="px-3 text-center text-white hover:underline">
                    Movies
                </div>
                <div onClick={() => router.push("/series")} className="px-3 text-center text-white hover:underline">
                    TV Shows
                </div>
                <div onClick={() => router.push("/latest")} className="px-3 text-center text-white hover:underline">
                    Latest
                </div>
            </div>
        </div>
    )
}

export default MobileMenu;