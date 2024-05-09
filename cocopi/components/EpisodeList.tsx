import React from "react";
import { isEmpty } from 'lodash';
import { BsFillPlayFill } from "react-icons/bs";

interface EpisodeListProps {
    data: Record<string, any>[];
}


const EpisodeList: React.FC<EpisodeListProps> = ({ data }) => {
    if (isEmpty(data)) {
        return null;
    }

    return (
        <div className="relative">
            <div className="flex flex-col gap-2 w-[100%]">
                {data.map((movie) => (
                    <a href={movie.videoUrl} key={movie.id} className="m-2 p-2 border-2 border-zinc-950 rounded-sm">
                        <img src="" alt="" />
                        <p>
                            movie.title
                        </p>
                        <BsFillPlayFill />
                    </a>
                ))}
            </div>
        </div>
    )
}

export default EpisodeList;
