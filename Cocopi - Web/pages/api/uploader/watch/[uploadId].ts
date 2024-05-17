import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res);
        const { uploadId } = req.query;

        if (typeof uploadId != 'string') {
            throw new Error('Invalid ID');
        }

        if (!uploadId) {
            throw new Error('Invalid ID');
        }

        const movie = await prismadb.PendingMedia.findUnique({
            where: {
                id: uploadId,
            }
        })

        if (!movie) {
            throw new Error('Invalid ID')
        }

        return res.status(200).json(movie)

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}