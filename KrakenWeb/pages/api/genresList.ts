import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        try {
            const genres = await prismadb.genres.findMany()
            return res.status(200).json(genres)
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }

    if (req.method == 'POST') {
        const { currentUser } = await serverAuth(req, res)
        if (currentUser.roles != "admin") return res.status(403).end()

        const media = await prismadb.media.findMany({})
        const genres: string[] = []

        for (let i = 0; i < media.length; i++) {
            media[i].genre.split(", ").forEach((genre) => {
                if (!genres.includes(genre)) {
                    genres.push(genre)
                }
            })
        }

        const setupGenres: { genre: string }[] = []
        genres.forEach((genre: string) => {
            setupGenres.push({ genre: genre })
        })

        await prismadb.genres.deleteMany()
        const newGenres = await prismadb.genres.createMany({
            data: setupGenres
        })

        return res.status(200).json(newGenres)
    }

    return res.status(405).end();
}
