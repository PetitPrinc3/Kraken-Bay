import useCurrentUser from "@/hooks/useCurrentUser";
import useMediaCount from "@/hooks/useMediaCount";

import { FaGithub, FaStar } from "react-icons/fa";
import { VscCoffee } from "react-icons/vsc";
import { RiMailSendLine } from "react-icons/ri";

const Footer = () => {

    const { data: user } = useCurrentUser();
    const { data: mediaCount } = useMediaCount();

    return (
        <div className="relative text-zinc-400 bg-zinc-950 h-[40vh] p-10">
            <div className="absolute flex flex-col items-center opacity-30 lg:opacity-100 right-0 w-[100vw] lg:w-[40vh] h-[40vh] p-[5vh] top-0 z-0">
                <div className="flex items-center">
                    <img className="h-[30vh]" src="/Assets/Images/kraken.png" alt="" />
                </div>
            </div>
            <div className="relative flex flex-col gap-4 items-center cursor-default">
                <p className="text-2xl font-extrabold">Welcome to Kraken Bay {user?.name} !</p>
                <div className="flex flex-row flex-wrap items-center text-center gap-2">
                    <p className="inline-block">We proudly host <span className="inline-block hover:text-red-600 transition-all duration-300">{mediaCount}</span> movies & TV shows !</p>
                </div>
            </div>
            <div className="flex flex-col items-center absolute left-0 bottom-14 w-full">
                <div className="w-full px-[20%] grid grid-cols-4">
                    <div className="flex flex-col items-center">
                        <a className="flex flex-col items-center hover:text-red-600 transition duration-300" href="https://github.com/PetitPrinc3">
                            <FaGithub size={25} />
                            <p className="hidden md:block mt-1">Follow Me</p>
                        </a>
                    </div>
                    <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
                        <a className="flex flex-col items-center" href="https://github.com/PetitPrinc3/Kraken-Web">
                            <FaStar size={25} />
                            <p className="hidden md:block mt-1">Star Me</p>
                        </a>
                    </div>
                    <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
                        <a className="flex flex-col items-center" href="mailto:arthur.reppelin@gmail.com">
                            <RiMailSendLine size={25} />
                            <p className="hidden md:block mt-1">Contact me</p>
                        </a>
                    </div>
                    <div className="flex flex-col items-center hover:text-red-600 transition duration-300">
                        <a className="flex flex-col items-center" href="https://www.paypal.com/paypalme/AReppelin">
                            <VscCoffee size={25} />
                            <p className="hidden md:block mt-1">Buy me a Coffee</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;