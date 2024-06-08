import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {
        try {
            const existingMedia = await prismadb.media.findMany();

            return res.status(200).json(existingMedia);

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == "PUT") {
        return res.status(405).end()
    }

    if (req.method == 'DELETE') {
        try {
            await serverAuth(req, res);
            const { mediaId } = req.body;

            const media = await prismadb.media.delete({
                where: {
                    id: mediaId,
                }
            })

            return res.status(200).json(media)
        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    res.status(405).end()
}