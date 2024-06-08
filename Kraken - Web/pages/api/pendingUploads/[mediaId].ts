import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        try {
            await serverAuth(req, res);
            const { mediaId } = req.query;

            if (typeof mediaId != 'string') {
                throw new Error('Invalid ID');
            }

            if (!mediaId) {
                throw new Error('Invalid ID');
            }

            const media = await prismadb.pendingMedia.findUnique({
                where: {
                    id: mediaId,
                }
            })

            return res.status(200).json(media)


        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }

    return res.status(405).end();
}