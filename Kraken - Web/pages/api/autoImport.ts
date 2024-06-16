import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";
import fs from 'fs'
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { isUndefined } from "lodash";

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {

        const existingMovies = await prismadb.media.findMany({
            where: {
                type: "Movies"
            }
        })

        const existingFiles: string[] = []

        for (let i = 0; i < existingMovies.length; i++) {
            existingFiles.push(existingMovies[i].videoUrl)
        }

        const presentFiles: {
            key: string, name: string, title: string, type: string, path: string
        }[] = []
        fs.readdirSync("public/Assets/Movies", { withFileTypes: true }).forEach((file) => {
            let title: string | null = null
            const keywords = file.name.split(".").join(" ").split("-").join(" ").split(" ")
            for (let word of keywords) {
                if (!(/\d/.test(word) && word.length > 2) && !["multi", "truefrench", "vff", "vfi", "vo", "hdlight", "4k", "webdrip", "mkv", "avi"].includes(word.toLowerCase())) {
                    title = title ? title + " " + word : word
                } else {
                    break
                }
            }
            if (!existingFiles.includes(`/Assets/Movies/${file.name}`)) {
                presentFiles.push({
                    key: uuidv4(),
                    name: file.name,
                    title: title?.toLowerCase() || "",
                    type: "Movie",
                    path: `/Assets/Movies/${file.name}`,

                })
            }
        })

        return res.status(200).json(presentFiles)

    }

    if (req.method == "POST") {

        const files = req.body
        const movies: any[] = []

        for (let i = 0; i < files.length; i++) {
            const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(files[i].title)}&include_adult=true&language=en-US&page=1`;
            const options = {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.IMDB_API_SECRET}`
                }
            };

            const { data: apiResult } = await axios.get(url, options)

            if (!isUndefined(apiResult?.results[0])) {
                const posterUrl = `http://image.tmdb.org/t/p/w500${apiResult.results[0]?.backdrop_path}`
                const thumbUrl = `http://image.tmdb.org/t/p/w500${apiResult.results[0]?.poster_path}`
                const movieGenres: any[] = []
                apiResult.results[0]?.genre_ids.forEach((genre: string) => {
                    if (genreIds.hasOwnProperty(genre)) {
                        movieGenres.push(genreIds[genre])
                    }
                });

                const initMovie = await prismadb.media.create({
                    data: {
                        title: apiResult.results[0]?.original_title,
                        altTitle: files[i].title,
                        type: "Movies",
                        description: apiResult.results[0]?.overview,
                        videoUrl: files[i].path,
                        thumbUrl: thumbUrl,
                        posterUrl: posterUrl,
                        genre: movieGenres.join(", "),
                        uploadedBy: currentUser.email
                    }
                })

                fs.mkdir(`public/Assets/Images/${initMovie.id}`, (err) => { })

                const poster = await (await fetch(posterUrl)).blob()
                fs.writeFile(`public/Assets/Images/${initMovie.id}${apiResult.results[0]?.backdrop_path}`, Buffer.from(await poster.arrayBuffer()), (err) => { })

                const thumb = await (await fetch(thumbUrl)).blob()
                fs.writeFile(`public/Assets/Images/${initMovie.id}${apiResult.results[0]?.poster_path}`, Buffer.from(await thumb.arrayBuffer()), (err) => { })

                const finalMovie = await prismadb.media.update({
                    where: {
                        id: initMovie.id
                    },
                    data: {
                        thumbUrl: `/Assets/Images/${initMovie.id}${apiResult.results[0]?.poster_path}`,
                        posterUrl: `/Assets/Images/${initMovie.id}${apiResult.results[0]?.backdrop_path}`,
                    }
                })

                movies.push(finalMovie)
            }


        }

        return res.status(200).json(movies)
    }


}