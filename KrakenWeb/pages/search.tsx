import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import { BsSearch } from "react-icons/bs";
import { useSearchParams, useRouter } from "next/navigation";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";
import useMedia from "@/hooks/useMedia";
import { useCallback, useRef, useState } from "react";
import useSearch from "@/hooks/useSearch";
import useGenresList from "@/hooks/useGenresList";
import { isUndefined } from "lodash";
import { GoPlus } from "react-icons/go";
import { FaChevronCircleRight } from "react-icons/fa";
import { Genre, GenreList } from "@/lib/genres"
import Footer from "@/components/Footer";

export default function Search() {
    const router = useRouter();
    const searchParams = new URLSearchParams(useSearchParams());
    const { isOpen, closeModal } = useInfoModal();
    const { searchText } = useSearch()
    const searchInput = useRef<HTMLInputElement>(null)
    const [gDispList, setGDispList] = useState(new GenreList())
    const { data: genresList } = useGenresList();
    const [genres, setGenres] = useState<string | undefined>(undefined)
    const [dropDown, setDropDown] = useState(false)
    const { data: media, mutate: mutateMedia } = useMedia({ searchText: searchParams.get("q") || undefined, mediaGenres: genres })

    const defaultValue = useCallback(() => {
        return searchText
    }, [searchText])

    const search = async (text: string) => {
        if (searchInput.current && searchInput.current?.value != text) searchInput.current.value = text
        searchParams.set("q", text)
        if (searchParams.get("q") != "") {
            router.replace(`search?${searchParams}`)
        } else {
            searchParams.delete("q")
            router.replace("search")
        }
    }

    const getList = () => {
        return gDispList?.list
    }

    const updateList = (genre: Genre) => {
        const gList = gDispList.list
        if (gList.includes(genre)) {
            const index = gList.indexOf(genre)
            gList[index] = gList[index].updateState(!genre?.isClicked)
        }
        setGDispList((gDispList) => new GenreList(gList))
    }


    const genreMovies = async (genre: Genre) => {
        updateList(genre)
        let gArray: string[] = []
        for (let g of gDispList?.list) {
            if (g?.isClicked) {
                gArray.push("+" + g?.genre)
            }
        }

        setGenres(gArray.join(" "))
        await mutateMedia()
    }

    if (isUndefined(genresList)) {
        return null
    } else {
        genresList.map((g: Genre) => {
            const dG = new Genre(g?.id, g?.genre, false)
            const iList = gDispList
            if (!iList?.exists(dG)) {
                iList?.list.push(dG)
                setGDispList(iList)
            }
        })
    }

    return (
        <div>
            <Navbar />
            <InfoModal visible={isOpen} onClose={closeModal} />
            <div className="text-white w-full flex flex-col items-center px-4 md:px-0 pt-[10vh] md:pt-[15vh]">
                <div className="flex flex-row items-center gap-4 w-full md:w-[50%] bg-zinc-600 border-2 border-zinc-900 rounded-full m-2 p-2">
                    <BsSearch className="m-1" size={20} />
                    <input
                        key={searchText}
                        ref={searchInput}
                        defaultValue={defaultValue()}
                        onChange={e => { search(e.currentTarget.value) }}
                        className="w-full bg-zinc-600 focus:outline-none"
                        type="text"
                        placeholder="Search Kraken Bay !" />
                </div>
            </div>
            <div className="px-4 md:px-2">
                <div onClick={() => setDropDown(!dropDown)} className={`flex md:hidden flex-row items-center gap-4 px-4 py-1 rounded-full bg-zinc-600 border-2 border-zinc-900 ${isUndefined(genres) || genres == "" ? "text-neutral-400" : "text-white"}`}>
                    <FaChevronCircleRight className="transition-all duration-500 flex-none" style={{ transform: `${dropDown ? "rotate(90deg)" : "rotate(0)"}` }} />
                    <p className="w-full overflow-hidden truncate text-ellipsis">Genres <span className="font-light text-xs text-neutral-400">{genres?.split(" +").join(", ").split("+").join("")}</span></p>
                </div>
                <div className={`${dropDown ? "flex" : "hidden md:flex"} flex-wrap items-center justify-center w-full gap-2 px-[5%] my-10`}>
                    {getList().map((e) => (
                        <div key={e?.id}>
                            <input onClick={() => { genreMovies(e) }} id={e?.id} className="hidden" type="checkbox" />
                            <label htmlFor={e?.id} className={`${getList()[gDispList.index(e)].isClicked ? "bg-white border-white" : "bordrer-zing-400"} flex flex-row items-center gap-2 cursor-pointer text-zinc-400 py-1 px-2 rounded-full border-2 transition duration-300`}>
                                <p>
                                    {e?.genre}
                                </p>
                                <GoPlus className={`font-extrabold transition duration-300 ${e?.isClicked ? "transform rotate-[135deg]" : ""}`} size={15} />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="my-10">
                <MovieList data={media} title="" />
            </div>
            <Footer />
        </div>
    )
}