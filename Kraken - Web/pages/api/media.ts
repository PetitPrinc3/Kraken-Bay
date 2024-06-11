import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull, isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    try {
        if (req.method == 'GET') {
            const { mediaId, searchText } = req.query;

            if (!isUndefined(searchText)) {
                const media = await prismadb.media.findMany({
                    where: {
                        title: {
                            search: searchText as string
                        },
                        altTitle: {
                            search: searchText as string
                        },
                        description: {
                            search: searchText as string
                        },
                        videoUrl: {
                            search: searchText as string
                        },
                        uploadedBy: {
                            search: searchText as string
                        }
                    }
                })
                return res.status(200).json(media)
            }

            if (isUndefined(mediaId)) {
                const media = await prismadb.media.findMany()
                return res.status(200).json(media)
            } else {
                if (typeof mediaId != 'string') {
                    throw new Error('Invalid ID');
                }

                if (!mediaId) {
                    throw new Error('Invalid ID');
                }

                const media = []

                const movie = await prismadb.media.findUnique({
                    where: {
                        id: mediaId,
                    }
                })

                if (!isNull(movie)) media.push(movie)

                const serie = await prismadb.serie_EP.findUnique({
                    where: {
                        id: mediaId,
                    }
                })

                if (!isNull(serie)) media.push(serie)

                if (isEmpty(media)) {
                    return res.status(400).json("Invalid ID")
                } else {
                    return res.status(200).json(media[0])
                }
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