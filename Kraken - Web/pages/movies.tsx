import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import { BsSearch } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";
import useGenresList from "@/hooks/useGenresList";
import { GoPlus } from "react-icons/go";
import { isUndefined } from "lodash";
import Footer from "@/components/Footer";
import useMedia from "@/hooks/useMedia";


export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export class genre {
    id: string;
    genre: string;
    isClicked: boolean;

    constructor(id: string, genre: string, isClicked: boolean = false) {
        this.id = id
        this.genre = genre
        this.isClicked = isClicked
    }
    public updateState(isClicked: boolean) {
        this.isClicked = isClicked
        return this
    }
}

export class genreList {
    genreList: genre[];

    constructor(genreList: genre[] = []) {
        this.genreList = genreList;
    }
    public push(g: genre) {
        this.genreList.push(g);
    }
    public exists(g: genre) {
        for (let exGenre of this?.genreList) {
            if (exGenre?.genre == g.genre) {
                return true
            }
        }
        return false
    }

    public index(g: genre) {
        for (let exGenre of this?.genreList) {
            if (exGenre?.id == g.id) {
                return this?.genreList.indexOf(exGenre)
            }
        }
        return 0
    }
}

const Movies = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());
    const [gDispList, setGDispList] = useState(new genreList())
    const { isOpen, closeModal } = useInfoModal();
    const { data: genresList } = useGenresList();
    const [genres, setGenres] = useState<string | undefined>(undefined)
    const { data: media, mutate: mutateMedia } = useMedia({ searchText: searchParams.get("q") || undefined, mediaGenres: genres })
    const searchInput: any = useRef(null)

    useEffect(() => { document.title = "Kraken Bay • Movies" }, [])

    const getList = () => {
        return gDispList?.genreList
    }

    const updateList = (genre: genre) => {
        const gList = gDispList.genreList
        if (gList.includes(genre)) {
            const index = gList.indexOf(genre)
            gList[index] = gList[index].updateState(!genre?.isClicked)
        }
        setGDispList((gDispList) => new genreList(gList))
    }

    const searchMovies = async (st: string = "") => {
        searchParams.set("q", st)
        if (st == "") {
            searchParams.delete("q")
            router.replace(pathname as string)
        } else {
            router.replace(`${pathname}?${searchParams}`)
        }
        await mutateMedia()
    }

    const genreMovies = async (genre: genre) => {
        updateList(genre)
        let gArray: string[] = []
        for (let g of gDispList?.genreList) {
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
        genresList.map((g: genre) => {
            const dG = new genre(g?.id, g?.genre, false)
            const iList = gDispList
            if (!iList?.exists(dG)) {
                iList?.genreList.push(dG)
                setGDispList(iList)
            }
        })
    }

    return (
        <div>
            <Navbar />
            <InfoModal visible={isOpen} onClose={closeModal} />
            <div className="text-white w-full flex flex-col items-center pt-[10vh] md:pt-[15vh]">
                <div className="flex flex-row items-center gap-4 w-[90%] md:w-[50%] bg-zinc-600 border-2 border-zinc-900 rounded-full m-2 p-2">
                    <BsSearch className="m-1" size={20} />
                    <input
                        value={searchParams.get("q") || undefined}
                        onChange={e => {
                            searchMovies(e.currentTarget.value)
                        }}
                        ref={searchInput}
                        className="w-full bg-zinc-600 focus:outline-none"
                        type="text"
                        placeholder="Search Kraken Bay !" />
                </div>
            </div>
            <div>
                <div className="flex flex-wrap items-center justify-center w-full gap-2 px-[20%] my-10">
                    {gDispList?.genreList.map((e) => (
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
            <div className="mb-10">
                <MovieList data={media} title="" />
            </div>
            <Footer />
        </div >
    )
}
export default Movies;