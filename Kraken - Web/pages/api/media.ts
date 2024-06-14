import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull, isUndefined } from "lodash";

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
                    take: parseInt(mediaLimit as string) || undefined,
                })
                return res.status(200).json(media)
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
            if (currentUser?.roles != "admin") return res.status(403).end()

            const mediaData = req.body

            if (isUndefined(mediaData.id)) {
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
            } else {
                const update = await prismadb.media.update({
                    where: {
                        id: mediaData.id as string
                    },
                    data: mediaData
                })
                return res.status(200).json(update)
            }
        }

        if (req.method == "DELETE") {
            if (currentUser.roles == "admin") {
                const { mediaId } = req.query

                if (isUndefined(mediaId)) {
                    await prismadb.media.deleteMany({})
                    await prismadb.serie_EP.deleteMany({})
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
                        await prismadb.serie_EP.deleteMany({
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