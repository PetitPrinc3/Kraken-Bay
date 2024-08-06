import useMedia from "@/hooks/useMedia";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md"
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Edit() {
    const router = useRouter()
    const { mediaId } = router.query
    const { data: media, mutate: mutateMedia } = useMedia({ mediaId: mediaId })
    const [title, setTitle] = useState("")
    const [poster, setPoster] = useState("")
    const [posterFile, setPosterFile] = useState<File>()
    const [thumb, setThumb] = useState("")
    const [thumbFile, setThumbFile] = useState<File>()
    const [altTitle, setAltTitle] = useState("")
    const [type, setType] = useState("")
    const [desc, setDesc] = useState("")
    const [genre, setGenre] = useState("")
    const [duration, setDuration] = useState("")
    const [seasons, setSeasons] = useState("")
    const [upBy, setUpBy] = useState("")
    const [languages, setLanguages] = useState("")
    const [subs, setSubs] = useState("")
    const [firstLoad, setFirstLoad] = useState(true)
    const posterRef = useRef<any>()
    const thumbRef = useRef<any>()

    useEffect(() => {
        if (!isUndefined(media?.title) && firstLoad) {
            setFirstLoad(false)
            setTitle(media.title)
            setAltTitle(media.altTitle)
            setType(media.type)
            setDesc(media.description)
            setGenre(media.genre)
            setDuration(media.duration)
            setSeasons(media.seasons)
            setUpBy(media.uploadedBy)
            setLanguages(media.languages)
            setSubs(media.subtitles)
            setPoster(media.posterUrl)
            setThumb(media.thumbUrl)
        }
    }, [title, altTitle, desc, genre, duration, seasons, upBy, languages, subs, firstLoad, media])

    const handleDelete = async () => {
        await axios.delete("/api/media", { params: { mediaId: mediaId } }).catch((err) => {
            toast.clearWaitingQueue()
            toast.error("Something went wrong.", { containerId: "AdminContainer" })
        }).then((data) => {
            if (!isUndefined(data)) {
                toast.clearWaitingQueue()
                toast.success("Entry removed.", { containerId: "AdminContainer" })
                mutateMedia()
                router.push("..")
            }
        })
    }

    const handleUpdate = async () => {

        const mediaData: {
            id: string,
            title: string,
            altTitle: string,
            posterUrl?: any,
            thumbUrl?: any,
            type: string,
            videoUrl: string,
            description: string,
            genre: string,
            duration: string,
            seasons: string,
            uploadedBy: string,
            languages: string,
            subtitles: string
        } = {
            id: mediaId as string,
            title: title,
            altTitle: altTitle,
            type: type,
            videoUrl: media.videoUrl,
            description: desc,
            genre: genre,
            duration: duration,
            seasons: seasons,
            uploadedBy: upBy,
            languages: languages,
            subtitles: subs
        }

        if (posterFile != undefined) {
            const posterData = posterFile as File
            const postBuffer = await posterData.arrayBuffer()
            const posterBuffer = Buffer.from(postBuffer)
            mediaData.posterUrl = { imageBuffer: posterBuffer, fileName: posterData.name }
        }

        if (thumbFile != undefined) {
            const thumbData = thumbFile as File
            const thumbBuffer = await thumbData.arrayBuffer()
            const thumbnailBuffer = Buffer.from(thumbBuffer)
            mediaData.thumbUrl = { imageBuffer: thumbnailBuffer, fileName: thumbData.name }
        }

        console.log(mediaData)

        await axios.post("/api/media", mediaData).catch((err) => {
            toast.error("Oops something went wrong...", { containerId: "AdminContainer" })
        }).then((data) => {
            if (!isUndefined(data)) {
                toast.success("Entry updated !", { containerId: "AdminContainer" })
            }
        })
        mutateMedia()
    }

    const changePoster = async (e: any) => {
        const image = posterRef.current?.files
        if (image.length != 1) {
            toast.error("What did you do ?!")
            posterRef.current.files = []
            setPoster("")
            return
        } else {
            setPoster(URL.createObjectURL(image[0]))
            setPosterFile(e.target.files[0])
        }
    }

    const changeThumb = async (e: any) => {
        const image = thumbRef.current?.files
        if (image.length != 1) {
            console.log(thumbRef.current?.files)
            toast.error("What did you do ?!")
            thumbRef.current.files = []
            setThumb("")
            return
        } else {
            setThumb(URL.createObjectURL(image[0]))
            setThumbFile(e.target.files[0])
        }
    }

    return (
        <AdminLayout parentName="media" pageName="Edit" >
            <div className={`${isUndefined(media) ? "animate-pulse" : ""} w-full h-fit flex flex-col gap-4 p-4 bg-slate-800 rounded-md`}>
                <div className="text-xl text-white font-semibold">
                    {media?.title} :
                </div>
                <div className="flex flex-row items-center gap-4 p-2 border-[1px] rounded-md justify-start h-fit text-white">
                    <p className="[writing-mode:vertical-lr] rotate-180">Images</p>
                    <div onClick={() => { posterRef.current.click() }} className="flex flex-col p-2 bg-slate-600 rounded-md cursor-pointer">
                        <input onChange={changePoster} ref={posterRef} type="file" className="hidden" accept="image/*" />
                        <img src={poster} className="h-20 object-contain" alt="No Poster" />
                        <p className="w-full text-center text-sm font-light underline">{media?.type} poster</p>
                    </div>
                    <div onClick={() => { thumbRef.current.click() }} className="flex flex-col p-2 bg-slate-600 rounded-md cursor-pointer">
                        <input onChange={changeThumb} ref={thumbRef} type="file" className="hidden" accept="image/*" />
                        <img src={thumb} className="h-20 object-contain" alt="No Thumb" />
                        <p className="w-full text-center text-sm font-light underline">{media?.type} thumbnail</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-4 p-2 border-[1px] rounded-md justify-start h-fit text-white">
                    <p className="[writing-mode:vertical-lr] rotate-180">Text</p>
                    <table className="w-full table-fixed border-separate border-spacing-y-2">
                        <thead className="font-semibold">
                            <tr className="">
                                <td className="w-[30%] md:w-[20%]">Field</td>
                                <td className="w-[70%] md:w-[80%]">Value</td>
                            </tr>
                        </thead>
                        <tbody className="font-light">
                            <tr>
                                <td>
                                    Title
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setTitle(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={title} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Alternative Title
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setAltTitle(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={altTitle} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Type
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setType(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={type} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Description
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <textarea onChange={(e) => setDesc(e.currentTarget.value)} className="w-full resize-none bg-transparent focus:outline-none" name="" id="" value={desc}></textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Genre
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setGenre(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={genre} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {media?.type == "Movies" ? "Duration" : "Seasons"}
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    {media?.type == "Movies"
                                        ? <input onChange={(e) => setDuration(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={duration} />
                                        : <input onChange={(e) => setSeasons(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={seasons} />
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Uploaded By
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setUpBy(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={upBy} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Languages
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setLanguages(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={languages} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Subtitles
                                </td>
                                <td className="w-full flex flex-row gap-2 items-center">
                                    <MdOutlineEdit />
                                    <input onChange={(e) => setSubs(e.currentTarget.value)} type="text" className="w-full bg-transparent focus:outline-none" name="" id="" value={subs} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-row items-center gap-4 p-2 border-[1px] rounded-md justify-start h-fit text-white">
                    <div className="">
                        Video
                    </div>
                    <a className="font-light truncate text-ellipsis" href={media?.videoUrl}>
                        {media?.videoUrl}
                    </a>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <div onClick={() => router.push("..")} className="py-1 px-2 rounded-md bg-blue-500 border-2 border-blue-400 hover:bg-blue-400 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                        Go Back
                    </div>
                    <div onClick={handleDelete} className="py-1 px-2 rounded-md bg-red-500 border-2 border-red-400 hover:bg-red-400 hover:border-red-300 transition-all duration-300 cursor-pointer">
                        Delete entry
                    </div>
                    <div onClick={handleUpdate} className="py-1 px-2 rounded-md bg-green-500 border-2 border-green-400 hover:bg-green-400 hover:border-green-300 transition-all duration-300 cursor-pointer">
                        Apply
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}