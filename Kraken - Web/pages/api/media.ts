import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isNull, isUndefined } from "lodash";
import fs from 'fs/promises'
import mime from '@/lib/mime';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
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
                    for (let i = media.length; i == 0; i--) {
                        const randomIndex = Math.floor(Math.random() * i)
                        const _ = media[i]
                        media[i] = media[randomIndex]
                        media[randomIndex] = _
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

                return res.status(200).json(media)
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
                            fs.mkdir(`public/Assets/Images/${existingMedia.id}`, { recursive: true })
                        } catch (err: any) {
                            if (err?.code != 'EEXIST') {
                                console.log(err)
                            }
                        }
                        const filePath = `public/Assets/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.posterUrl.fileName.split(".").pop()}`
                        await fs.writeFile(filePath, posterBuffer.toString())
                        const fileType = await mime(filePath)
                        if (fileType.mime != "Image") {
                            await fs.rm(filePath)
                            return res.status(400).json(`Invalid poster : ${fileType.header + ":" + fileType.mime}`)
                        }
                        if (!isUndefined(currentUser.poster) && filePath != "public" + currentUser.poster) {
                            try {
                                await fs.rm("public" + existingMedia.posterUrl)
                            } catch {

                            }
                        }
                        mediaData.posterUrl = `/Assets/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.posterUrl.fileName.split(".").pop()}`
                    } catch (err) {
                        console.log(err)
                        return res.status(400).json("Poster update impossible.")
                    }
                }

                if (!isUndefined(mediaData?.thumbUrl) && !isNull(mediaData?.thumbUrl) && typeof mediaData?.thumbUrl != "string") {
                    try {
                        const thumbBuffer = Buffer.from(mediaData.thumbUrl.imageBuffer.data)
                        try {
                            fs.mkdir(`public/Assets/Images/${existingMedia.id}`, { recursive: true })
                        } catch (err: any) {
                            if (err?.code != 'EEXIST') {
                                console.log(err)
                            }
                        }
                        const filePath = `public/Assets/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.thumbUrl.fileName.split(".").pop()}`
                        await fs.writeFile(filePath, thumbBuffer.toString())
                        const fileType = await mime(filePath)
                        if (fileType.mime != "Image") {
                            await fs.rm(filePath)
                            return res.status(400).json(`Invalid thumb : ${fileType.header + ":" + fileType.mime}`)
                        }
                        if (!isUndefined(currentUser.thumb) && filePath != "public" + currentUser.thumb) {
                            try {
                                await fs.rm("public" + currentUser.thumb)
                            } catch {

                            }
                        }
                        mediaData.thumbUrl = `public/Assets/Images/${existingMedia.id}/${mediaData.id + "." + mediaData.thumbUrl.fileName.split(".").pop()}`
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