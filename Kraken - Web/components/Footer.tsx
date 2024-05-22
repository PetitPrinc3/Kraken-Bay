import useCurrentUser from "@/hooks/useCurrentUser";
import useMediaCount from "@/hooks/useMediaCount";

const Footer = () => {

    const { data: user } = useCurrentUser();
    const { data: mediaCount } = useMediaCount();

    return (
        <div className="flex flex-col gap-4 items-center text-zinc-400 bg-zinc-950 h-[40vh] p-10">
            <p className="text-2xl font-extrabold">Welcome to Kraken Bay {user?.name} !</p>
            <div className="flex flex-row gap-2">
                <p>We proudly host </p>
                <p>{mediaCount}</p>
                <p>movies & TV shows !</p>
            </div>
        </div>
    )
}

export default Footer;