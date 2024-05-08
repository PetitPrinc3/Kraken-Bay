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
        <div className="absolute top-16 flex flex-col items-center bg-zinc-900 border-2 border-black p-3 rounded-xl max-h-[70vh] overflow-y-scroll overflow-x-hidden scrollbar-hide">
            <div className="relative block w-full top-0">
                {data.map((movie) => (
                    <a key={movie?.id} className="relative text-white bg-zinc-800 border-2 border-zinc-400 p-4 m-2 rounded-md flex flex-row gap-4 items-center max-w-[20vw]" href={movie?.videoUrl}>
                        <img className="w-[20%] overflow-hidden" src={movie?.thumbUrl} alt="Poster" />
                        <p>
                            {movie?.title}
                        </p>
                    </a>
                ))}

            </div>
        </div>
    )
}

export default SearchResult;