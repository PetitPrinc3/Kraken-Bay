import React from "react";

interface MobileMenuProps {
    visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
    if (!visible) {
        return null;
    }

    return (
        <div className="bg-black bg-opacity-80 w-56 absolute top-10 md:top-14 left-0 py-5 flex-col border-2 rounded-md border-gray-800 flex">
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