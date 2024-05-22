import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end()
    }

    try {
        await serverAuth(req, res);
        const mediaCount = await prismadb.media.count()

        return res.status(200).json(mediaCount);

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}