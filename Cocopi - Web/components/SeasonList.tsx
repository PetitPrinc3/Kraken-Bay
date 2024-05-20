import React, { useState } from "react";
import useMovie from "@/hooks/useMovie";
import axios from "axios";
import { useRouter } from "next/router";
import { BsFillPlayFill } from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { isUndefined } from "lodash";

interface SeasonListProps {
    serieId: string;
}

const dropOptions = (seasons: string) => {
    let options: string[] = seasons.split(",")
    return options;
}


const SeasonList: React.FC<SeasonListProps> = ({ serieId }) => {

    const { data: currentMovie } = useMovie(serieId)
    const season_data = dropOptions(currentMovie?.seasons);
    const [epDispList, setEpDispList] = useState([""]);
    const [firstLoad, setFirstLoad] = useState(true)
    const router = useRouter();

    if (isUndefined(epDispList)) return null

    const getEpList = async (so: string = season_data[0]) => {
        await axios.get('/api/episodeList', {
            params: {
                serieId: serieId,
                season: so,
            }
        }).then((data) => setEpDispList((epDispList) => data?.data))
    }

    return (
        <div
            onLoad={() => {
                if (firstLoad) {
                    getEpList();
                }
                setFirstLoad((firstLoad) => false)
            }}
            className="relative flex flex-col w-full">
            <div className="flex flex-row w-full m-auto">
                <p className="text-white text-xl md:text-2xl h-full lg:text-3xl font-bold left-0 m-auto ml-0">
                    Episodes
                </p>
                <select
                    onChange={(e) => {
                        getEpList(e.target.value);
                    }} className="text-white text-sm bg-zinc-800 border-2 border-zinc-400 rounded-sm w-[30%] m-auto mt-3 mr-0 focus:outline-none">
                    {season_data.map((season) => (
                        <option key={serieId + "SO" + season} value={season}>Season {season}</option>
                    ))}
                </select>
            </div>
            <div className="mt-4 w-full text-white">
                {
                    epDispList.map((ep: any) => (
                        <div
                            key={ep.id}
                            className="w-full flex flex-row items-center my-2 border-2 border-white cursor-pointer rounded-md">
                            <div
                                onClick={() => router.push(`/watch/show/${ep?.id}`)}
                                className="flex flex-row items-center gap-4 w-[90%] max-w-[90%]">
                                <img src={currentMovie?.thumbUrl} alt="Poster" className="h-[10vh] w-auto rounded-md" />
                                <div>{ep?.title}</div>
                                <BsFillPlayFill className="ml-auto text-zinc-900 border-2 border-white rounded-full bg-white" size={30} />
                            </div>
                            <MdFileDownload onClick={() => router.push(ep?.videoUrl)} className="mr-5 ml-5 text-zinc-900 border-2 border-white rounded-full bg-white" size={30} />
                        </div>
                    ))
                }
            </div>
        </div>


    )
}

export default SeasonList;
