import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        const { serieId, season } = req.query;
        const existingSerie = await prismadb.Media.findUnique({
            where: {
                id: serieId,
            }
        })

        if (!existingSerie) {
            return res.status(400).json({ error: 'Invalid serie.' });
        }

        const existingEps = await prismadb.Serie_EP.findMany({
            where: {
                AND: [
                    {
                        serieId: serieId,
                    },
                    {
                        season: season,
                    }
                ]
            }
        })

        if (!existingEps) {
            return res.status(400).json({ error: 'No episodes for this serie.' });
        }

        return res.status(200).json(existingEps)

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}