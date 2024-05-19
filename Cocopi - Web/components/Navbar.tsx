import NavbarItem from "./Navbaritem";
import MobileMenu from "./MobileMenu";
import AccountMenu from "./AccountMenu";
import { BsChevronDown, BsBell } from 'react-icons/bs';
import { useState, useCallback, useEffect } from "react";
import SearchBar from "./SearchBar";
import UploadItem from "./UploadItem";
import NotificationBell from "./NotificationBell";

const TOP_OFFSET = 66;

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showBackground, setShowBackground] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= TOP_OFFSET) {
                setShowBackground(true);
            } else {
                setShowBackground(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current)
    }, [])

    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current)
    }, [])

    return (
        <nav className="w-full fixed z-40">
            <div className={`px-4 md:px-16 py-4 flex flex-row items-center transition duration-500 ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}`}>
                <a href="/home">
                    <img className="h-4 lg:h-7 cursor-pointer" src="/Assets/Images/logo.png" alt="" />
                </a>
                <div className="flex-row ml-8 gap-7 hidden lg:flex">
                    <NavbarItem label="Home" url="/home" />
                    <NavbarItem label="TV Shows" url="/series" />
                    <NavbarItem label="Movies" url="/movies" />
                    <NavbarItem label="Latest Uploads" url="/latest" />
                </div>
                <div onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
                    <p className="text-white text-sm">Browse</p>
                    <BsChevronDown className={`text-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
                    <MobileMenu visible={showMobileMenu} />
                </div>
                <div className="flex flex-row ml-auto gap-4 md:gap-7 items-center">
                    <UploadItem />
                    <NotificationBell />
                    <SearchBar />
                    <div onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="flex items-center w-6 h-6 lg:h-10 rounded-md overflow-hidden">
                            <img src="/Assets/Images/default_profile.png" alt="" />
                        </div>
                        <BsChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`} />
                        <AccountMenu visible={showAccountMenu} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;