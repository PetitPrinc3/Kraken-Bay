import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            const { currentUser }: any = await serverAuth(req, res);
            const pendingUploads = await prismadb.pendingMedia.findMany({
                where: {
                    userName: currentUser.email
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            const existingUploads = await prismadb.media.findMany({
                where: {
                    uploadedBy: currentUser.email
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            for (let upload of existingUploads) {
                pendingUploads.push(upload as any)
            }

            return res.status(200).json(pendingUploads);
        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    return res.status(405).end()
}