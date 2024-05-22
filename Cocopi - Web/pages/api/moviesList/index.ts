import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty, isNull, isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res)
        const { mediaType, searchText, genre } = req.query;

        if (!isEmpty(genre)) {
            const movies = await prismadb.media.findMany({
                where: {
                    AND: [
                        {
                            type: mediaType
                        },
                        {
                            genre: {
                                search: genre
                            }
                        }
                    ]
                }
            })
            return res.status(200).json(movies)
        }

        if (isEmpty(searchText)) {
            const movies = await prismadb.media.findMany({
                where: {
                    type: mediaType
                }
            })
            return res.status(200).json(movies)
        }

        if (isEmpty(searchText)) {

        }

        const movies = await prismadb.media.findMany({
            where: {
                AND: [
                    {
                        title: {
                            search: searchText
                        },
                        altTitle: {
                            search: searchText
                        },
                        description: {
                            search: searchText
                        },
                        genre: {
                            search: searchText
                        }
                    }, {
                        type: mediaType
                    }
                ]
            }
        }
        );

        return res.status(200).json(movies)

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}