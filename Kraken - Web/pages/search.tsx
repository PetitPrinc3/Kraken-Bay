import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import { BsSearch } from "react-icons/bs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";
import useMedia from "@/hooks/useMedia";



export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const { isOpen, closeModal } = useInfoModal();
    const { data: media, mutate: mutateMedia } = useMedia({ searchText: searchParams.get("q") || undefined })

    const search = async (e: any) => {
        searchParams.set("q", e.currentTarget.value as string)
        if (searchParams.get("q") == "") {
            router.replace(pathname)
        } else {
            router.replace(`${pathname}?${searchParams}`)
        }

        await mutateMedia()
    }

    return (
        <div>
            <Navbar />
            <InfoModal visible={isOpen} onClose={closeModal} />
            <div className="text-white w-full flex flex-col items-center pt-[10vh] md:pt-[15vh]">
                <div className="flex flex-row items-center gap-4 w-[90%] md:w-[50%] bg-zinc-600 border-2 border-zinc-900 rounded-full m-2 p-2">
                    <BsSearch className="m-1" size={20} />
                    <input
                        onChange={search}
                        className="w-full bg-zinc-600 focus:outline-none"
                        type="text"
                        placeholder="Search Kraken Bay !" />
                </div>
            </div>
            <div className="my-10">
                <MovieList data={media} title="" />
            </div>
        </div>
    )
}