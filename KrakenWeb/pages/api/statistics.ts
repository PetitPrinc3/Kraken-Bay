import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await serverAuth(req, res)

    try {
        const statistics = []
        const date = new Date()

        for (let i = 0; i < 7; i++) {
            const users = await prismadb.user.count({
                where: {
                    createdAt: {
                        lt: date
                    }
                },
            })
            const movies = await prismadb.media.count({
                where: {
                    type: "Movies",
                    createdAt: {
                        lt: date
                    }
                },
            })
            const episodes = await prismadb.episodes.count({
                where: {
                    createdAt: {
                        lt: date
                    }
                }
            })

            const media = movies + episodes

            statistics.unshift({
                date: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
                users: users,
                media: media
            })
            date.setDate(date.getDate() - 1);
        }

        res.status(200).json(statistics)
    } catch (err) {
        return res.status(400).json(err)
    }
}