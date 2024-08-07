import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";
import fs from 'fs'
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { isNull, isUndefined } from "lodash";
import ffprobe from '@ffprobe-binary/ffprobe'

const genreIds: { [key: string]: string } = {
    "12": "Adventure",
    "14": "Fantasy",
    "16": "Animation",
    "18": "Drama",
    "27": "Horror",
    "28": "Action",
    "35": "Comedy",
    "36": "History",
    "37": "Western",
    "53": "Thriller",
    "80": "Crime",
    "99": "Documentary",
    "878": "Science Fiction",
    "9648": "Mystery",
    "10402": "Music",
    "10749": "Romance",
    "10751": "Family",
    "10752": "War",
    "10759": "Action & Adventure",
    "10762": "Kids",
    "10763": "News",
    "10764": "Reality",
    "10765": "Sci-Fi & Fantasy",
    "10766": "Soap",
    "10767": "Talk",
    "10768": "War & Politics",
    "10770": "TV Movie",
}

const getLanguage = (abv: string) => {
    switch (abv) {
        case "fre":
            return "french"
        case "fra":
            return "french"
        case "eng":
            return "english"
        case "ang":
            return "english"
        case "spa":
            return "spanish"
        case "por":
            return "portuguese"
        case "srp":
            return "serbian"
        case "jpn":
            return "japanese"
        case "ara":
            return "arabic"
        case "dan":
            return "danish"
        case "dut":
            return "dutch"
        case "est":
            return "estonian"
        case "fin":
            return "finnish"
        case "ger":
            return "german"
        case "hun":
            return "hungarian"
        case "ita":
            return "italian"
        case "rum":
            return "romanian"
        case "nor":
            return "norwegian"
        case "rus":
            return "russian"
        case "swe":
            return "swedish"
        case "tur":
            return "turkish"
        default:
            return ""
    }
}

function getInfo(file: string) {
    const spawn = require('child_process').spawnSync
    const { stdout: FFlanguages } = spawn(ffprobe, ['-loglevel', 'quiet', '-show_entries', 'stream=index:stream_tags=language', '-select_streams', 'a', '-of', 'compact=p=0:nk=1', file], { encoding: 'utf8' })

    const languages: string[] = []
    for (let _ of FFlanguages.split("\n")) {
        const abr = _.split("|")[1]
        if (!isUndefined(abr)) {
            const language = getLanguage(abr.trim())
            if (!languages.includes(language)) {
                languages.push(language)
            }
        }
    }

    const { stdout: FFsubtitles } = spawn(ffprobe, ['-loglevel', 'quiet', '-show_entries', 'stream=index:stream_tags=language', '-select_streams', 's', '-of', 'compact=p=0:nk=1', file], { encoding: 'utf8' })

    const subtitles: string[] = []
    for (let _ of FFsubtitles.split("\n")) {
        const abr = _.split("|")[1]
        if (!isUndefined(abr)) {
            const language = getLanguage(abr.trim())
            if (!subtitles.includes(language)) {
                subtitles.push(language)
            }
        }
    }

    const { stdout: FFduration } = spawn(ffprobe, ['-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' })

    const getDuration = () => {
        const duration = parseInt(FFduration)
        var d = Math.floor(duration / (3600 * 24));
        var h = Math.floor(duration % (3600 * 24) / 3600);
        var m = Math.floor(duration % 3600 / 60);
        var s = Math.floor(duration % 60);

        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + " h " : "";
        var mDisplay = m > 0 ? m + " min " : "";

        return dDisplay + hDisplay + mDisplay;
    }

    return {
        languages: languages.join(", "),
        subtitles: subtitles.join(", "),
        duration: getDuration()
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {

        const presentFiles: { key: string, name: string, title: any, altTitle: string, type: string, languages?: string, subtitles?: string, path: string, seasons?: string, episodes?: any[], apiResult?: any[], isNew?: boolean }[] = []

        const existingMovies = await prismadb.media.findMany({
            where: {
                type: "Movies"
            }
        })

        const existingFiles: string[] = []

        for (let i = 0; i < existingMovies.length; i++) {
            existingFiles.push(existingMovies[i].videoUrl)
        }

        const filesList = fs.readdirSync(process.env.MEDIA_STORE_PATH + "/Movies", { withFileTypes: true })

        for (let i = 0; i < filesList.length; i++) {
            let title: string | null = null
            const keywords = filesList[i].name.split(".").join(" ").split("-").join(" ").split(" ")
            for (let word of keywords) {
                if (!(/\d/.test(word) && word.length > 2) && !["multi", "truefrench", "vff", "vfi", "vo", "hdlight", "4k", "webdrip", "mkv", "avi"].includes(word.toLowerCase())) {
                    title = title ? title + " " + word : word
                } else {
                    break
                }
            }
            if (!existingFiles.includes(`${process.env.MEDIA_SRV_URL}/Movies/${filesList[i].name}`)) {
                try {
                    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_SECRET}&query=${title?.toLowerCase() || ""}&include_adult=true&language=en-US&page=1`
                    const { data: apiResult } = await axios.get(url)
                    presentFiles.push({
                        key: uuidv4(),
                        name: filesList[i].name,
                        title: apiResult?.results[0].id,
                        altTitle: title?.toLowerCase() || "",
                        type: "Movies",
                        path: `/Movies/${filesList[i].name}`,
                        apiResult: apiResult?.results
                    })
                } catch {
                    const titleId = uuidv4()
                    presentFiles.push({
                        key: uuidv4(),
                        name: filesList[i].name,
                        title: titleId,
                        altTitle: title?.toLowerCase() || "",
                        type: "Movies",
                        path: `/Movies/${filesList[i].name}`,
                        apiResult: [{
                            id: titleId,
                            original_title: title
                        }]
                    })
                }
            }
        }

        const existingEpisodes = await prismadb.episodes.findMany()
        const existingSeries = await prismadb.media.findMany({ where: { type: "Series" } })

        const existingEps: string[] = []
        const existingSrs: string[] = []

        for (let i = 0; i < existingEpisodes.length; i++) {
            existingEps.push((existingEpisodes[i].videoUrl.split("/")).pop() || "")
        }
        for (let i = 0; i < existingSeries.length; i++) {
            existingSrs.push((existingSeries[i].videoUrl.split("/")).pop() || "")
        }

        const folderList = fs.readdirSync(process.env.MEDIA_STORE_PATH + "/Series", { withFileTypes: true })

        for (let i = 0; i < folderList.length; i++) {
            const newEps: { season: string, episode: string, url: string }[] = []
            const seasons: string[] = []
            fs.readdirSync(`${process.env.MEDIA_STORE_PATH}/Series/${folderList[i].name}`, { withFileTypes: true }).forEach(async (season) => {
                if (/SO*[0-9]*/.test(season.name)) {
                    const _ = fs.readdirSync(`${process.env.MEDIA_STORE_PATH}/Series/${folderList[i].name}/${season.name}`, { withFileTypes: true }).sort()
                    const episodes: string[] = []
                    for (let i of _) episodes.push(i.name)
                    for (let episode of episodes.sort()) {
                        const regex = new RegExp("[Ss][Oo]?([0-9]*)[Ee][Pp]?([0-9]*)")
                        const episodeInfos = regex.exec(episode)
                        if (!existingEps.includes(episode)) {
                            if (!seasons.includes(season.name.split("SO").join("").split(" ").join(""))) seasons.push(season.name.split("SO").join("").split(" ").join(""))
                            newEps.push({
                                season: season.name.split("SO").join("").split(" ").join(""),
                                episode: isNull(episodeInfos) ? (episodes.indexOf(episode) + 1).toFixed() : (+episodeInfos[2]).toFixed(),
                                url: `${process.env.MEDIA_SRV_URL}/Series/${folderList[i].name}/${season.name}/${episode}`,
                            })
                        }
                    }
                }
            })
            if (newEps.length != 0) {
                try {
                    const url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_SECRET}&query=${folderList[i].name?.toLowerCase() || ""}&include_adult=true&language=en-US&page=1`
                    const { data: apiResult } = await axios.get(url)
                    presentFiles.push({
                        key: uuidv4(),
                        name: folderList[i].name,
                        title: apiResult?.results[0].id,
                        altTitle: folderList[i].name,
                        type: "TV Show",
                        path: `/Series/${folderList[i].name}`,
                        seasons: seasons.sort().join(","),
                        episodes: newEps,
                        apiResult: apiResult?.results,
                        isNew: (await prismadb.media.findMany({ where: { altTitle: folderList[i].name } })).length == 0
                    })
                } catch {
                    const titleId = uuidv4()
                    presentFiles.push({
                        key: uuidv4(),
                        name: folderList[i].name,
                        title: titleId,
                        altTitle: folderList[i].name.toLowerCase(),
                        type: "TV Show",
                        path: `/Series/${folderList[i].name}`,
                        seasons: seasons.sort().join(","),
                        episodes: newEps,
                        apiResult: [{
                            id: titleId,
                            original_name: folderList[i].name
                        }],
                        isNew: (await prismadb.media.findMany({ where: { altTitle: folderList[i].name } })).length == 0
                    })
                }
            }
        }

        return res.status(200).json(presentFiles)

    }

    if (req.method == "POST") {

        const { files, action } = req.body

        if (action == "manual") {

        } else if (action == "auto") {

            const movies: any[] = []

            for (let i = 0; i < files.length; i++) {

                if (!isUndefined(files[i].title)) {

                    var mediaData
                    for (let j = 0; j < files[i].apiResult.length; j++) {
                        if (files[i].apiResult[j].id == files[i].title) {
                            mediaData = files[i].apiResult[j]
                        }
                    }
                    const posterUrl = `http://image.tmdb.org/t/p/w500${mediaData?.backdrop_path}`
                    const thumbUrl = `http://image.tmdb.org/t/p/w500${mediaData?.poster_path}`
                    const movieGenres: any[] = []
                    if (!isUndefined(mediaData?.genre_ids)) {
                        mediaData?.genre_ids.forEach((genre: string) => {
                            if (genreIds.hasOwnProperty(genre)) {
                                movieGenres.push(genreIds[genre])
                            }
                        });
                    }
                    const movieInfo = getInfo(`${process.env.MEDIA_STORE_PATH}${files[i].path}`)

                    if (files[i].type == "Movies") {
                        const initMovie = await prismadb.media.create({
                            data: {
                                title: mediaData.original_title,
                                altTitle: files[i].altTitle,
                                type: files[i].type,
                                description: mediaData.overview,
                                videoUrl: process.env.MEDIA_SRV_URL + files[i].path,
                                thumbUrl: thumbUrl,
                                posterUrl: posterUrl,
                                genre: movieGenres.join(", "),
                                uploadedBy: currentUser.email,
                                languages: movieInfo.languages,
                                subtitles: movieInfo.subtitles,
                                duration: movieInfo.duration
                            }
                        })

                        try {
                            fs.mkdir(`${process.env.MEDIA_STORE_PATH}/Images/${initMovie.id}`, (err) => { })

                            const poster = await (await fetch(posterUrl)).blob()
                            fs.writeFile(`${process.env.MEDIA_STORE_PATH}/Images/${initMovie.id}${mediaData?.backdrop_path}`, Buffer.from(await poster.arrayBuffer()), (err) => { })

                            const thumb = await (await fetch(thumbUrl)).blob()
                            fs.writeFile(`${process.env.MEDIA_STORE_PATH}/Images/${initMovie.id}${mediaData?.poster_path}`, Buffer.from(await thumb.arrayBuffer()), (err) => { })

                            const finalMovie = await prismadb.media.update({
                                where: {
                                    id: initMovie.id
                                },
                                data: {
                                    thumbUrl: `${process.env.MEDIA_SRV_URL}/Images/${initMovie.id}${mediaData?.poster_path}`,
                                    posterUrl: `${process.env.MEDIA_SRV_URL}/Images/${initMovie.id}${mediaData?.backdrop_path}`,
                                }
                            })

                            movies.push(finalMovie)
                        } catch {
                            movies.push(initMovie)
                        }

                    } else {
                        if (files[i].isNew) {
                            const initSerie = await prismadb.media.create({
                                data: {
                                    title: mediaData.original_name,
                                    altTitle: files[i].altTitle,
                                    type: "Series",
                                    description: mediaData.overview,
                                    videoUrl: files[i]?.episodes[0]?.url,
                                    thumbUrl: thumbUrl,
                                    posterUrl: posterUrl,
                                    genre: movieGenres.join(", "),
                                    seasons: files[i].seasons,
                                    uploadedBy: currentUser.email,
                                    languages: movieInfo.languages,
                                    subtitles: movieInfo.subtitles,
                                }
                            })

                            try {
                                fs.mkdir(`${process.env.MEDIA_STORE_PATH}/Images/${initSerie.id}`, (err) => { })

                                const poster = await (await fetch(posterUrl)).blob()
                                fs.writeFile(`${process.env.MEDIA_STORE_PATH}/Images/${initSerie.id}${mediaData?.backdrop_path}`, Buffer.from(await poster.arrayBuffer()), (err) => { })

                                const thumb = await (await fetch(thumbUrl)).blob()
                                fs.writeFile(`${process.env.MEDIA_STORE_PATH}/Images/${initSerie.id}${mediaData?.poster_path}`, Buffer.from(await thumb.arrayBuffer()), (err) => { })

                                const finalSerie = await prismadb.media.update({
                                    where: {
                                        id: initSerie.id
                                    },
                                    data: {
                                        thumbUrl: `${process.env.MEDIA_SRV_URL}/Images/${initSerie.id}${mediaData?.poster_path}`,
                                        posterUrl: `${process.env.MEDIA_SRV_URL}/Images/${initSerie.id}${mediaData?.backdrop_path}`,
                                    }
                                })

                                files[i].key = finalSerie.id
                            } catch {
                                files[i].key = initSerie.id
                            }

                        } else {
                            const existingSerie = await prismadb.media.findFirst({ where: { altTitle: files[i].altTitle } })
                            if (!isNull(existingSerie)) {
                                const getSo = () => {
                                    const seasons = (existingSerie.seasons + "," + files[i].seasons).split(",")
                                    const newSeasons: string[] = []
                                    for (let i of seasons) {
                                        if (!newSeasons.includes(i) && i != "") newSeasons.push(i)
                                    }
                                    return newSeasons.sort().join(",")
                                }
                                const updateSerie = await prismadb.media.update({
                                    where: {
                                        id: existingSerie?.id
                                    },
                                    data: {
                                        seasons: getSo(),
                                        uploadedBy: currentUser.email,
                                        languages: movieInfo.languages,
                                        subtitles: movieInfo.subtitles,
                                    }
                                })
                                files[i].key = updateSerie.id
                            } else {
                                return res.status(400).json("Parent serie not found.")
                            }
                        }
                        for (let episode of files[i]?.episodes) {
                            try {
                                await prismadb.episodes.create({
                                    data: {
                                        title: mediaData.original_name + " : SO " + episode.season + ", EP " + episode.episode,
                                        serieId: files[i].key,
                                        season: +episode.season,
                                        episode: +episode.episode,
                                        videoUrl: episode.url,
                                    }
                                })
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    }

                } else {
                    return res.status(400).json("Title not found")
                }

            }

            return res.status(200).json(movies)
        }
    }

}