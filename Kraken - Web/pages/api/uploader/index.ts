import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb'
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(400)

    const { currentUser }: any = await serverAuth(req, res);
    const { uploadProps, thumbName, postName } = req.body

    const upload = await prismadb.pendingMedia.create({
        data: {
            id: uploadProps.id,
            title: uploadProps.title,
            type: "Movies",
            description: uploadProps.description,
            videoUrl: uploadProps.video,
            thumbUrl: thumbName,
            posterUrl: postName,
            genre: uploadProps.genres,
            userId: currentUser.id,
            userName: currentUser.email,
        }
    })

    return res.status(200).json(upload)

}