import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isNull, isUndefined } from "lodash";
import fs from 'fs/promises'
import mime from '@/lib/mime';
import path from "path";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb'
        },
        responseLimit: false
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    try {
        if (req.method == 'GET') {
            const { mediaId, mediaType, mediaLimit, mediaGenres, searchText } = req.query;

            if (isUndefined(mediaId)) {
                const media = await prismadb.media.findMany({
                    where: {
                        AND: [
                            {
                                OR: [
                                    {
                                        title: {
                                            search: searchText as string || undefined
                                        }
                                    },
                                    {
                                        altTitle: {
                                            search: searchText as string || undefined
                                        }
                                    },
                                    {
                                        description: {
                                            search: searchText as string || undefined
                                        }
                                    },
                                    {
                                        videoUrl: {
                                            search: searchText as string || undefined
                                        }
                                    },
                                    {
                                        uploadedBy: {
                                            search: searchText as string || undefined
                                        }
                                    }
                                ]
                            },
                            {
                                type: mediaType as string || undefined
                            },
                            {
                                genre: {
                                    search: mediaGenres as string || undefined
                                }
                            }
                        ]
                    },
                })
                if (isUndefined(searchText)) {
                    const randomMedia: any[] = []
                    while (media.length > 0) {
                        randomMedia.splice(Math.floor(Math.random() * randomMedia.length), 0, media.splice(Math.floor(Math.random() * media.length), 1)[0])
                    }

                    if (!isUndefined(mediaLimit)) {
                        return res.status(200).json(randomMedia.splice(Math.floor(Math.random() * (randomMedia.length - +mediaLimit)), +mediaLimit))
                    } else {
                        return res.status(200).json(randomMedia)
                    }
                }
                if (!isUndefined(mediaLimit)) {
                    return res.status(200).json(media.splice(Math.floor(Math.random() * (media.length - +mediaLimit)), +mediaLimit))
                } else {
                    return res.status(200).json(media)
                }
            } else {
                const media = await prismadb.media.findUnique({
                    where: {
                        id: mediaId as string
                    }
                })

                if (!!media) return res.status(200).json(media)

                const episode = await prismadb.episodes.findUnique({
                    where: {
                        id: mediaId as string
                    }
                })

                return res.status(200).json(episode)

            }

        }

        if (req.method == "POST") {

            try {
                if (currentUser?.roles != "admin") return res.status(403).end()

                const mediaData = req.body

                if (isUndefined(mediaData?.id)) {
                    try {
                        const media = await prismadb.media.create({
                            data: mediaData
                        })
                        return res.status(200).json(media)
                    } catch {
                        return res.status(400).json("Invalid data")
                    }
                }

                const existingMedia = await prismadb.media.findUnique({
                    where: {
                        id: mediaData.id as string
                    }
                })

                if (isNull(existingMedia)) {
                    try {
                        const media = await prismadb.media.create({
                            data: mediaData
                        })
                        return res.status(200).json(media)
                    } catch {
                        return res.status(400).json("Invalid data")
                    }
                }

                if (!isUndefined(mediaData?.posterUrl) && !isNull(mediaData?.posterUrl) && typeof mediaData?.posterUrl != "string") {
                    try {
                        const posterBuffer = Buffer.from(mediaData.posterUrl.imageBuffer.data)
                        try {
                            fs.mkdir(`${process.env.MEDIA_STORE_PATH}/Images/${existingMedia.id}`, { recursive: true })
                        } catch (err: any) {
                            if (err?.code != 'EEXIST') {
                                console.log(err)
                            }
                        }
                        const filePath = path.normalize(`${process.env.MEDIA_STORE_PATH}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.posterUrl.fileName.split(".").pop()}`)
                        await fs.writeFile(filePath, posterBuffer)
                        const fileType = await mime(filePath)
                        if (fileType.mime != "Image") {
                            await fs.rm(filePath)
                            return res.status(400).json(`Invalid poster : ${fileType.header + ":" + fileType.mime}`)
                        }
                        if (!isUndefined(existingMedia.posterUrl) && existingMedia.posterUrl != `${process.env.MEDIA_SRV_URL}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.posterUrl.fileName.split(".").pop()}`) {
                            try {
                                !isUndefined(process.env.MEDIA_STORE_PATH) && await fs.rm(process.env.MEDIA_STORE_PATH + existingMedia.posterUrl?.split(process.env.MEDIA_SRV_URL as string)[1])
                            } catch {

                            }
                        }
                        mediaData.posterUrl = `${process.env.MEDIA_SRV_URL}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.posterUrl.fileName.split(".").pop()}`
                    } catch (err) {
                        console.log(err)
                        return res.status(400).json("Poster update impossible.")
                    }
                }

                if (!isUndefined(mediaData?.thumbUrl) && !isNull(mediaData?.thumbUrl) && typeof mediaData?.thumbUrl != "string") {
                    try {
                        const thumbBuffer = Buffer.from(mediaData.thumbUrl.imageBuffer.data)
                        try {
                            fs.mkdir(`${process.env.MEDIA_STORE_PATH}/Images/${existingMedia.id}`, { recursive: true })
                        } catch (err: any) {
                            if (err?.code != 'EEXIST') {
                                console.log(err)
                            }
                        }
                        const filePath = path.normalize(`${process.env.MEDIA_STORE_PATH}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.thumbUrl.fileName.split(".").pop()}`)
                        await fs.writeFile(filePath, thumbBuffer)
                        const fileType = await mime(filePath)
                        if (fileType.mime != "Image") {
                            await fs.rm(filePath)
                            return res.status(400).json(`Invalid thumb : ${fileType.header + ":" + fileType.mime}`)
                        }
                        if (!isUndefined(existingMedia.thumbUrl) && existingMedia.thumbUrl != `${process.env.MEDIA_SRV_URL}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.thumbUrl.fileName.split(".").pop()}`) {
                            try {
                                !isUndefined(process.env.MEDIA_STORE_PATH) && await fs.rm(process.env.MEDIA_STORE_PATH + existingMedia.thumbUrl?.split(process.env.MEDIA_SRV_URL as string)[1])
                            } catch {

                            }
                        }
                        mediaData.thumbUrl = `${process.env.MEDIA_SRV_URL}/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.thumbUrl.fileName.split(".").pop()}`
                    } catch (err) {
                        console.log(err)
                        return res.status(400).json("Thumbnail update impossible.")
                    }
                }

                const update = await prismadb.media.update({
                    where: {
                        id: existingMedia.id as string
                    },
                    data: mediaData
                })
                return res.status(200).json(update)
            } catch (err) {
                console.log(err)
            }

        }

        if (req.method == "DELETE") {
            if (currentUser.roles == "admin") {
                const { mediaId } = req.query

                if (isUndefined(mediaId)) {
                    await prismadb.media.deleteMany({})
                    await prismadb.episodes.deleteMany({})
                    return res.status(200).json("DB Purged.")
                } else {
                    const target = await prismadb.media.findUnique({
                        where: {
                            id: mediaId as string
                        }
                    })

                    if (isUndefined(target)) {
                        return res.status(400).json("Invalid entry.")
                    }

                    if (target?.type == "Movies") {
                        await prismadb.media.delete({
                            where: {
                                id: mediaId as string
                            }
                        })
                        return res.status(200).json("Movie deleted")
                    } else {
                        await prismadb.episodes.deleteMany({
                            where: {
                                serieId: target?.id
                            }
                        })
                        await prismadb.media.delete({
                            where: {
                                id: target?.id
                            }
                        })
                        return res.status(200).json("TV Show deleted")
                    }
                }
            } else {
                return res.status(403).end()
            }
        }

        return res.status(405).end();

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}