import React, { useEffect, useState, useCallback } from "react";
import useMedia from "@/hooks/useMedia";
import axios from "axios";
import { useRouter } from "next/router";
import { BsFillPlayFill } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { isEmpty, isUndefined } from "lodash";
import useEpisode from "@/hooks/useEpisode";

interface SeasonListProps {
    serieId: string;
}

const dropOptions = (seasons: string) => {
    let options: string[] = seasons.split(",")
    return options.sort();
}


const SeasonList: React.FC<SeasonListProps> = ({ serieId }) => {

    const { data: currentMovie } = useMedia({ mediaId: serieId })
    const season_data = dropOptions(currentMovie?.seasons);
    const [season, setSeason] = useState<string | undefined>(undefined)
    const { data: episodeList, mutate: mutatEpisodeList } = useEpisode({ serieId: serieId, season: season })
    const [firstLoad, setFirstLoad] = useState(true)
    const router = useRouter();

    useEffect(() => {
        if (firstLoad && !isEmpty(season_data)) {
            setSeason(season_data[0])
            mutatEpisodeList()
            setFirstLoad(false)
        }
    }, [firstLoad, season_data, mutatEpisodeList])

    const UpdateList = useCallback(async (e: any) => {
        setSeason(e.currentTarget.value);
        await mutatEpisodeList()
    }, [mutatEpisodeList])

    return (
        <div
            className="relative flex flex-col w-full">
            <div className="flex flex-row items-center justify-between w-full m-auto">
                <p className="text-white text-xl md:text-2xl h-full lg:text-3xl font-bold">
                    Episodes
                </p>
                <select
                    onChange={UpdateList} className="text-white text-sm bg-zinc-800 border-2 border-zinc-400 rounded-sm w-[30%] focus:outline-none">
                    {season_data.map((season) => (
                        <option key={serieId + "SO" + season} value={season}>Season {season}</option>
                    ))}
                </select>
            </div>
            <div className="mt-4 w-full text-white">
                {(episodeList || []).map((ep: any) => (
                    <div
                        key={ep.id}
                        className="w-full flex flex-row items-center my-2 border-2 border-white cursor-pointer rounded-md overflow-hidden">
                        <div
                            onClick={() => router.push(`/watch/${ep?.id}`)}
                            className="flex flex-row items-center gap-4 w-[90%] max-w-[90%]">
                            <img src={currentMovie?.thumbUrl} alt="Poster" className="h-[10vh] w-auto rounded-r-md" />
                            <div>{ep?.title}</div>
                            <BsFillPlayFill className="ml-auto text-zinc-900 border-2 border-white rounded-full bg-white flex-none" size={30} />
                        </div>
                        <MdFileDownload onClick={() => router.push(ep?.videoUrl)} className="mr-5 ml-5 text-zinc-900 border-2 border-white rounded-full bg-white flex-none" size={30} />
                    </div>
                ))}
            </div>
        </div>


    )
}

export default SeasonList;
