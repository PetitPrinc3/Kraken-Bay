import React from "react";
import { isEmpty, isNull, isUndefined } from 'lodash';
import MovieCard from "./MovieCard";

interface MovieListProps {
    data: Record<string, any>[];
    title: string;
}


const MovieList: React.FC<MovieListProps> = ({ data, title }) => {

    if (isUndefined(data) || isEmpty(data) || isNull(data[0])) {
        return (
            <div className="relative px-4 md:px-12 mt-4 space-y-8">
                <div>
                    <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
                        {title}
                    </p>
                    <div className="relative grid grid-cols-4 gap-2 animate-pulse transition-all duration-300">
                        <div className="bg-zinc-800 w-full h-[30vw] md:h-[12vw] flex flex-col items-center p-0 m-0 cursor-pointer object-cover rounded-md"></div>
                        <div className="bg-zinc-800 w-full h-[30vw] md:h-[12vw] flex flex-col items-center p-0 m-0 cursor-pointer object-cover rounded-md"></div>
                        <div className="bg-zinc-800 w-full h-[30vw] md:h-[12vw] flex flex-col items-center p-0 m-0 cursor-pointer object-cover rounded-md"></div>
                        <div className="bg-zinc-800 w-full h-[30vw] md:h-[12vw] flex flex-col items-center p-0 m-0 cursor-pointer object-cover rounded-md"></div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="relative px-4 md:px-12 mt-4 space-y-8">
                <div>
                    <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">
                        {title}
                    </p>
                    <div className="relative grid grid-cols-4 gap-2 transition-all duration-300">
                        {data.map((movie) => movie.id && (
                            <MovieCard key={movie.id} data={movie} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default MovieList;
