import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb'
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(400)

    const { currentUser } = await serverAuth(req, res);
    const { uploadProps } = req.body


    const upload = await prismadb.PendingMedia.create({
        data: {
            id: uploadProps.id,
            title: uploadProps.title,
            type: "Movies",
            description: uploadProps.description,
            videoUrl: uploadProps.video,
            thumbUrl: uploadProps.thumbnail,
            posterUrl: uploadProps.poster,
            genre: uploadProps.genres,
            userId: currentUser.id,
            userName: currentUser.email,
        }
    })

    return res.status(200).json(upload)

}