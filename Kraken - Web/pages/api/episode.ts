import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull, isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    try {
        if (req.method == 'GET') {
            const { serieId, season, episode, } = req.query;

            if (!isUndefined(serieId) && !isUndefined(season) && !isUndefined(episode)) {
                const ep = await prismadb.serie_EP.findUnique({
                    where:
                    {
                        Episode: {
                            serieId: serieId as string,
                            season: season as string,
                            episode: episode as string
                        }
                    }
                })

                return res.status(200).json(ep)
            } else {
                const ep = await prismadb.serie_EP.findMany({
                    where: {
                        serieId: serieId as string || undefined,
                        season: season as string || undefined,
                    },
                    orderBy: [
                        {
                            serieId: "asc"
                        },
                        {
                            episode: "asc"
                        },
                        {
                            season: "asc"
                        }
                    ]
                })

                return res.status(200).json(ep)
            }

        }


        if (req.method == "POST") {
            if (currentUser?.roles != "admin") return res.status(403).end()

            const episodeData = req.body

            if (isUndefined(episodeData.id)) {
                try {
                    const episode = await prismadb.serie_EP.create({
                        data: episodeData
                    })
                    return res.status(200).json(episode)
                } catch {
                    return res.status(400).json("Invalid data")
                }
            }

            const existingEpisode = await prismadb.serie_EP.findUnique({
                where: {
                    id: episodeData.id as string
                }
            })

            if (isNull(existingEpisode)) {
                try {
                    const episode = await prismadb.serie_EP.create({
                        data: episodeData
                    })
                    return res.status(200).json(episode)
                } catch {
                    return res.status(400).json("Invalid data")
                }
            } else {
                const update = await prismadb.serie_EP.update({
                    where: {
                        id: episodeData.id as string
                    },
                    data: episodeData
                })
                return res.status(200).json(update)
            }
        }

        if (req.method == "DELETE") {
            if (currentUser.roles == "admin") {
                const { episodeId } = req.query

                if (isUndefined(episodeId)) {
                    await prismadb.serie_EP.deleteMany({})
                    return res.status(200).json("DB Purged.")
                } else {
                    const target = await prismadb.serie_EP.findUnique({
                        where: {
                            id: episodeId as string
                        }
                    })

                    if (isUndefined(target)) {
                        return res.status(400).json("Invalid entry.")
                    }

                    await prismadb.serie_EP.delete({
                        where: {
                            id: target?.id
                        }
                    })
                    return res.status(200).json("TV Show deleted")
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