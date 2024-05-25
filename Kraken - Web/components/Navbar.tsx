import NavbarItem from "@/components/Navbaritem";
import MobileMenu from "@/components/MobileMenu";
import AccountMenu from "@/components/AccountMenu";
import { BsChevronDown } from 'react-icons/bs';
import { useState, useCallback, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import UploadItem from "@/components/UploadItem";
import NotificationBell from "@/components/NotificationBell";
import { useRef } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";

const TOP_OFFSET = 66;

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showBackground, setShowBackground] = useState(false);
    const accountMenu = useRef<HTMLDivElement>(null)
    const mobileMenu = useRef(null)
    const router = useRouter();
    const { data: user } = useCurrentUser()

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
        if (!showAccountMenu) {
            accountMenu.current?.focus()
        }
    }, [showAccountMenu, accountMenu])

    const handleAccountBlur = useCallback((e: any) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setShowAccountMenu(false);
            }
        });
    }, [setShowAccountMenu]);

    const handleMobileBlur = useCallback((e: any) => {
        const currentTarget = e.currentTarget;
        requestAnimationFrame(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setShowMobileMenu(false);
            }
        });
    }, [setShowMobileMenu]);

    if (isUndefined(user)) return null

    return (
        <nav className="w-full fixed z-40">
            <div className={`px-4 md:px-16 py-4 flex flex-row items-center transition duration-500 ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}`}>
                <div onClick={() => router.push("/home")}>
                    <img className="h-4 lg:h-8 cursor-pointer" src="/Assets/Images/logo.png" alt="" />
                </div>
                <div className="flex-row ml-8 gap-7 hidden lg:flex">
                    <NavbarItem label="Home" url="/home" />
                    <NavbarItem label="TV Shows" url="/series" />
                    <NavbarItem label="Movies" url="/movies" />
                    <NavbarItem label="Latest Uploads" url="/latest" />
                </div>
                <div onBlur={handleMobileBlur} ref={mobileMenu} tabIndex={0} onClick={toggleMobileMenu} className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative">
                    <p className="text-white text-sm">Browse</p>
                    <BsChevronDown className={`text-white transition ${showMobileMenu ? 'rotate-180' : 'rotate-0'}`} />
                    <MobileMenu visible={showMobileMenu} />
                </div>
                <div className="flex flex-row ml-auto gap-4 md:gap-7 items-center">
                    <UploadItem />
                    <NotificationBell />
                    <SearchBar />
                    <div onBlur={handleAccountBlur} ref={accountMenu} tabIndex={0} onClick={toggleAccountMenu} className="flex flex-row items-center gap-2 cursor-pointer relative">
                        <div className="flex items-center w-6 h-6 lg:h-10 rounded-md overflow-hidden">
                            <img src={user?.image || "/Assets/Images/default_profile.png"} alt="" />
                        </div>
                        <BsChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`} />
                        <div>
                            <AccountMenu visible={showAccountMenu} />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;