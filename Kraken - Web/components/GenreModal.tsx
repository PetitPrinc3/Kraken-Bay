import React, { useState } from "react"
import { UploadPropsInterface } from "@/hooks/useUploadProps"
import { Genre, GenreList } from "@/lib/genres"

import { GoPlus } from "react-icons/go"
import { RxCross2 } from "react-icons/rx"

import useGenresList from "@/hooks/useGenresList"
import { isEmpty, isUndefined } from "lodash"

interface GenreModalProps {
    uploadProps: UploadPropsInterface,
}

const GenreModal: React.FC<GenreModalProps> = ({ uploadProps }) => {
    const [genreList, setGenreList] = useState<GenreList>(new GenreList())
    const [viewGenres, toggleViewGenres] = useState(false)
    const { data: dbGenres } = useGenresList()

    if (isUndefined(dbGenres)) return null

    if (isEmpty(genreList.list)) {
        const tmpList = new GenreList
        dbGenres.map((g: any) => {
            const genre = new Genre(g?.id, g?.genre, false)
            tmpList.push(genre)
        })
        setGenreList(genreList => new GenreList(tmpList.list))
    }

    const selectGenre = (genre: Genre) => {
        genreList.updateState(genre)
        setGenreList(genreList => new GenreList(genreList.list))
        uploadProps.setGenre(genreList.displayList())
    }

    return (
        <div className="flex flex-row items-center w-[20%] md:w-[15%] mr-4 md:mx-auto">
            <div
                className={`flex flex-col h-14 w-full gap-4 cursor-pointer ${uploadProps.genres ? "justify-left border-r-2 border-r-green-600" : "items-center border-2 border-dashed"} rounded-md pt-4 pb-4 md:px-4 md:pt-3 md:pb-4 text-md text-gray-400 bg-neutral-700 border-zinc-600 hover:bg-neutral-600 hover:border-zinc-500 transition duration-300 mx-0 my-auto`}
                onClick={() => { toggleViewGenres((viewGenres) => true) }}>
                <p className="hidden md:block truncate text-ellipsis">{uploadProps.genres || "Select Genres"}<span className={`${uploadProps.genres ? "hidden" : "inline-block"} text-sm text-red-500`}>*</span></p>
                <div className={`flex flex-col ${!uploadProps.genres && "items-center"} w-full overflow-hidden p-auto m-auto md:hidden`}>
                    <GoPlus className={`${uploadProps.genres ? "hidden" : "block"}`} />
                    <p className={`${uploadProps.genres ? "flex" : "hidden"} ml-2`}>{uploadProps.genres}</p>
                </div>

            </div>
            <div className={`${viewGenres ? "absolute" : "hidden"} top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 z-30`}>
                <div className="w-full h-full flex flex-row items-center justify-center">
                    <div className="fixed w-full h-full z-20" onClick={() => { toggleViewGenres((viewGenres) => false) }} />
                    <div className="w-[90%] md:w-[40%] z-40 flex-col items-center bg-neutral-700 rounded-md border-2 border-neutral-800 px-4 pb-2 pt-4">
                        <div className="w-full flex flex-row items-center">
                            <p className="text-white text-left font-semibold text-2xl ml-0 mr-auto">Choose :</p>
                            <RxCross2 className="cursor-pointer" onClick={() => { toggleViewGenres((viewGenres) => false) }} />
                        </div>
                        <hr className="w-[90%] border-1 border-neutral-800 my-2" />
                        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-4 my-4">
                            {genreList.list.map((e: any) => (
                                <div key={e?.id}>
                                    <input onClick={() => { selectGenre(e) }} id={e?.id} className="hidden" type="checkbox" />
                                    <label htmlFor={e?.id} className={`${genreList.list[genreList.index(e)]?.isClicked ? "bg-white border-white" : "bordrer-zing-400"} flex flex-row items-center gap-2 cursor-pointer text-xs md:text-base text-zinc-400 py-1 px-2 rounded-full border-2 transition duration-300`}>
                                        <p>
                                            {e?.genre}
                                        </p>
                                        <GoPlus className={`font-extrabold transition duration-300 ${genreList.list[genreList.index(e)]?.isClicked ? "transform rotate-[135deg]" : ""}`} size={15} />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GenreModal;