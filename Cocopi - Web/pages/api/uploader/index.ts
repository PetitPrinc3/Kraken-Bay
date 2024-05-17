import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') return res.status(400)

    const { uploadProps } = req.body

    const upload = await prismadb.PendingMedia.create({
        data: {
            id: uploadProps.id,
            title: uploadProps.title,
            type: "Movies",
            description: uploadProps.description,
            videoUrl: uploadProps.video,
            thumbUrl: uploadProps.thumb,
            posterUrl: uploadProps.poster,
            genre: uploadProps.genres,
            userId: uploadProps.userId,
            userName: uploadProps.userName,
        }
    })

    return res.status(200).json(upload)

}