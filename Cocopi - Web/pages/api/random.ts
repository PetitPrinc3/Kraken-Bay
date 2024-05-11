import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end()
    }

    try {
        await serverAuth(req, res);
        const movieCount = await prismadb.media.count({
            where: {
                type: "Movies"
            }
        })
        const randomIndex = Math.floor(Math.random() * movieCount)
        const randomMovies = await prismadb.media.findMany({
            take: 1,
            skip: randomIndex,
            where: {
                type: "Movies"
            }
        });

        return res.status(200).json(randomMovies[0]);

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}