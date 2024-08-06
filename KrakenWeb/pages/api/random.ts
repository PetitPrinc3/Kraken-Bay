import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end()
    }

    try {
        await serverAuth(req, res);
        const { mediaType } = req.query

        const movieCount = await prismadb.media.count({
            where: {
                type: mediaType as string || undefined
            }
        })
        const randomIndex = Math.floor(Math.random() * movieCount)
        const randomMovies: any = await prismadb.media.findMany({
            where: {
                type: mediaType as string || undefined
            },
            take: 1,
            skip: randomIndex
        });

        return res.status(200).json(randomMovies[0]);

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}