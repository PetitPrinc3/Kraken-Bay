import React from "react";

interface MobileMenuProps {
    visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black w-56 absolute top-8 left-0 py-5 flex-col border-2 border-gray-800 flex">
            <div className="flex flex-col gap-4">
                <a href="/home" className="px-3 text-center text-white hover:underline">
                    Home
                </a>
                <a href="/series" className="px-3 text-center text-white hover:underline">
                    Series
                </a>
                <a href="/movies" className="px-3 text-center text-white hover:underline">
                    Films
                </a>
                <a href="/latest" className="px-3 text-center text-white hover:underline">
                    Latest
                </a>
            </div>
        </div>
    )
}

export default MobileMenu;