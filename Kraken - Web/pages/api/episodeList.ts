import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { isUndefined, orderBy, take } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        const { serieId, season } = req.query;
        const existingSerie = await prismadb.media.findUnique({
            where: {
                id: serieId as string,
            }
        })

        if (!existingSerie) {
            return res.status(400).json({ error: 'Invalid serie.' });
        }

        const existingEps = await prismadb.serie_EP.findMany({
            where: {
                AND: [
                    {
                        serieId: serieId as string,
                    },
                    {
                        season: season as string,
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