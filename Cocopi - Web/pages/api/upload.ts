import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, description, genres, userId, userName, thumbnail, poster, videoUrl } = req.body

    console.log(id, title)

    const upload = await prismadb.PendingMedia.create({
        data: {
            title: title,
            type: "Movies",
            description: description,
            videoUrl: videoUrl,
            thumbUrl: thumbnail,
            posterUrl: poster,
            genre: genres,
            userId: userId,
            userName: userName,
        }
    }).catch((err: any) => { return res.status(400).json(err) })

    return res.status(200).json(upload)

}