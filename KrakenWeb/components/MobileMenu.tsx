import { useRouter } from "next/router";
import React from "react";
import useMobileMenuProps, { MobileMenuProps } from "@/hooks/useMobileMenu";

const MobileMenu: React.FC<MobileMenuProps> = ({ visible, selected }) => {
    const router = useRouter();
    const { select } = useMobileMenuProps()

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black bg-opacity-80 w-56 absolute top-10 md:top-14 left-0 py-5 flex-col border-2 rounded-md border-gray-800 flex">
            <div className="flex flex-col gap-4">
                <div onClick={() => { select("Home"); router.push("/home") }} className="px-3 text-center text-white hover:underline">
                    Home
                </div>
                <div onClick={() => { select("Movies"); router.push("/movies") }} className="px-3 text-center text-white hover:underline">
                    Movies
                </div>
                <div onClick={() => { select("TV Shows"); router.push("/series") }} className="px-3 text-center text-white hover:underline">
                    TV Shows
                </div>
                <div onClick={() => { select("Latest"); router.push("/latest") }} className="px-3 text-center text-white hover:underline">
                    Latest
                </div>
                <div onClick={() => { select("Upload"); router.push("/upload") }} className="px-3 text-center text-white hover:underline">
                    Upload
                </div>
            </div>
        </div>
    )
}

export default MobileMenu;