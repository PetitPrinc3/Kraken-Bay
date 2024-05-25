import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res);
        const { mediaId } = req.query;

        if (typeof mediaId != 'string') {
            throw new Error('Invalid ID');
        }

        if (!mediaId) {
            throw new Error('Invalid ID');
        }

        const media = []

        const movie = await prismadb.media.findUnique({
            where: {
                id: mediaId,
            }
        })

        if (!isNull(movie)) media.push(movie)

        const serie = await prismadb.serie_EP.findUnique({
            where: {
                id: mediaId,
            }
        })

        if (!isNull(serie)) media.push(serie)

        if (isEmpty(media)) {
            return res.status(400).json("Invalid ID")
        } else {
            return res.status(200).json(media[0])
        }


    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}