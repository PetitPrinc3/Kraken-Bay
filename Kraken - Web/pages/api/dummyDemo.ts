import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth";
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end()
    }

    const { currentUser }: any = await serverAuth(req, res);

    if (currentUser?.roles != "admin") return res.status(403).end()

    try {
        await prismadb.media.deleteMany({})
        await prismadb.episodes.deleteMany({})

        const mediaCount = Math.floor(Math.random() * 100) + 10

        for (let i = 0; i < mediaCount; i++) {
            const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western", "Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Kids", "Mystery", "News", "Reality", "Sci-Fi & Fantasy", "Soap", "Talk", "War & Politics", "Western"]
            const type = ["Movies", "Series"][Math.floor(Math.random() * 2)]
            const duration = Math.floor(Math.random() * 120)
            const genre: string[] = []
            const seasons: number[] = []
            for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
                genre.push(genres[Math.floor(Math.random() * genres.length)])
            }
            for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
                const season = Math.floor(Math.random() * 5) + 1
                if (!seasons.includes(season)) seasons.push(season)
            }
            seasons.sort()

            const media = await prismadb.media.create({
                data: {
                    title: "Big Buck Dummy",
                    altTitle: "Big Buck Bunny",
                    type: type,
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor volutpat ipsum, at ultrices magna. Aliquam sed sem tempus, ullamcorper urna quis, hendrerit elit. Aliquam vestibulum ipsum accumsan, tempor magna faucibus, dignissim est. Morbi pharetra sodales consequat. Etiam lobortis elit sem, nec varius sapien fermentum nec. Duis maximus elit ut lorem porttitor aliquam. Nulla sed lectus ante. Maecenas ullamcorper, orci vitae convallis malesuada, nisl neque venenatis urna, et suscipit nunc leo non lorem. Aliquam erat volutpat. Aliquam feugiat bibendum gravida. Aliquam erat volutpat. Maecenas eu consectetur enim, non vestibulum enim. Etiam in mi vitae lacus maximus blandit eget ut ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam luctus volutpat urna at tempor. Suspendisse vehicula, odio a scelerisque porttitor, urna dolor condimentum lectus, aliquet porttitor ex neque volutpat justo.",
                    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
                    thumbUrl: "/Assets/Images/Dummy/Big Buck Dummy.jpg",
                    posterUrl: "/Assets/Images/Dummy/Big Buck Poster.png",
                    duration: duration > 60 ? (duration - duration % 60) / 60 + " h " + duration % 60 + " min" : duration + " min",
                    seasons: seasons.join(","),
                    genre: genre.join(", ")
                }
            })

            if (type == "Series") {
                for (let j = 0; j < seasons.length; j++) {
                    for (let k = 0; k < Math.floor(Math.random() * 8 + 12); k++) {
                        await prismadb.episodes.create({
                            data: {
                                title: `Dummy Serie : So ${seasons[j]}, Ep ${k + 1}`,
                                serieId: media.id,
                                season: seasons[j],
                                episode: k + 1,
                                videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
                            }
                        })
                    }
                }
            }
        }

        return res.status(200).end()

    } catch (err) {
        return res.status(400).end()
    }
}