import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != "GET") {
        res.status(405).end()
    }

    try {
        const { currentUser } = await serverAuth(req, res);
        let favoriteIds = currentUser?.favoriteIds

        if (favoriteIds.includes(",")) {
            favoriteIds = favoriteIds.split(",")
        } else {
            favoriteIds = [favoriteIds]
        }

        const favoriteMovies = await prismadb.media.findMany({
            where: {
                id: {
                    in: favoriteIds,
                }
            }
        });

        return res.status(200).json(favoriteMovies);

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}