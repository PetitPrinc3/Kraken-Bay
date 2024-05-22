import React from "react"
import { isEmpty } from "lodash"

interface SearchResultProps {
    data: Record<string, any>[]
}

const SearchResult: React.FC<SearchResultProps> = ({ data }) => {

    if (isEmpty(data)) {
        return null;
    }

    return (
        <div className="absolute top-16 left-[2vw] w-[96%] md:w-auto md:left-auto flex flex-col items-center bg-zinc-900 border-2 border-black p-3 rounded-xl max-h-[70vh] overflow-y-scroll overflow-x-hidden scrollbar-hide">
            <div className="relative block w-full top-0">
                {data.map((movie) => (
                    <a key={movie?.id} className="relative text-white bg-zinc-800 border-2 border-zinc-400 p-4 m-2 rounded-md flex flex-row gap-4 items-center w-auto md:w-[20vw]" href={movie?.videoUrl}>
                        <img className="w-[10%] md:w-[20%] overflow-hidden" src={movie?.thumbUrl} alt="Poster" />
                        <p className="w-auto md:w-[80%]">
                            {movie?.title}
                        </p>
                    </a>
                ))}

            </div>
        </div>
    )
}

export default SearchResult;