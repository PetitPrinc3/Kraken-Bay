import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res)
        const { searchText } = req.query;

        if (typeof searchText != 'string') {
            throw new Error('Invalid search');
        }

        const movies = await prismadb.media.findMany({
            where: {
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
            }
        });

        return res.status(200).json(movies)

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}