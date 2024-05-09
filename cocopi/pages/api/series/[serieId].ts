import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res);
        const { serieId } = req.query;

        if (typeof serieId != 'string') {
            throw new Error('Invalid ID');
        }

        if (!serieId) {
            throw new Error('Invalid ID');
        }

        const serie = await prismadb.Serie_EP.findUnique({
            where: {
                id: serieId,
            }
        })

        if (!serie) {
            throw new Error('Invalid ID')
        }

        return res.status(200).json(serie)

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}