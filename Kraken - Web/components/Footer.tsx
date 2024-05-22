import useCurrentUser from "@/hooks/useCurrentUser";
import useMediaCount from "@/hooks/useMediaCount";

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
            <div className="relative flex flex-col gap-4 items-center">
                <p className="text-2xl font-extrabold">Welcome to Kraken Bay {user?.name} !</p>
                <div className="flex flex-row gap-2">
                    <p>We proudly host </p>
                    <p>{mediaCount}</p>
                    <p>movies & TV shows !</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;