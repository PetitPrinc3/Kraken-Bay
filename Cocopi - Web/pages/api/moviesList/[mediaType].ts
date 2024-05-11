import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res)
        let { mediaType } = req.query;

        if (typeof mediaType != 'string') {
            throw new Error('Invalid type');
        }
        if (!mediaType) {
            throw new Error('Invalid type');
        }
        if (mediaType == "Any") {
            const movies = await prismadb.media.findMany({
                take: 8,
            });

            return res.status(200).json(movies)
        }

        const movies = await prismadb.media.findMany({
            take: 8,
            where: {
                type: mediaType,
            }

        });

        return res.status(200).json(movies)
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}