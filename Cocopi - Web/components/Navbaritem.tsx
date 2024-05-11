import { useRouter } from "next/router";
import React from "react";

interface NavbarItemProps {
    label: string;
    url: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
    label,
    url
}) => {

    const router = useRouter();

    return (
        <div onClick={() => { router.push(url) }} className="text-white cursor-pointer hover:text-gray-300 transition">
            {label}
        </div>
    )
}

export default NavbarItem