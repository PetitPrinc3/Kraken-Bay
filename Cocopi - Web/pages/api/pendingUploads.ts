import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            const { currentUser } = await serverAuth(req, res);
            const { uploadId } = req.query;

            if (isUndefined(uploadId)) {
                const pendigUploads = await prismadb.PendingMedia.findMany();

                return res.status(200).json(pendigUploads);
            }

            if (typeof uploadId != 'string') {
                throw new Error("Invalid ID.")
            }

            const upload = await prismadb.PendingMedia.findUnique({
                where: {
                    id: uploadId
                }
            })

            const media = await prismadb.Media.create({
                data: upload
            })

            await prismadb.PendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            return res.status(200).json(media)


        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == 'DELETE') {
        try {
            const { currentUser } = await serverAuth(req, res);
            const { uploadId } = req.body;

            const upload = await prismadb.PendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            return res.status(200).json(upload)

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    return res.status(405).end()
}