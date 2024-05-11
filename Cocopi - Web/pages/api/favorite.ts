import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method == 'POST') {
            const { currentUser } = await serverAuth(req, res);
            const { movieId } = req.body;
            let existingMovie = await prismadb.media.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid Movie ID');
            }

            let favoriteIds = currentUser?.favoriteIds

            if (favoriteIds.includes(",")) {
                favoriteIds = favoriteIds.split(",")
            } else {
                favoriteIds = [favoriteIds]
            }

            favoriteIds.push(movieId)
            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: favoriteIds.join(","),
                }
            })

            return res.status(200).json(user)
        }

        if (req.method == 'DELETE') {
            const { currentUser } = await serverAuth(req, res);
            const { movieId } = req.body;
            let existingMovie = await prismadb.media.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid Movie ID');
            }

            let favoriteIds = currentUser?.favoriteIds

            if (favoriteIds.includes(",")) {
                favoriteIds = favoriteIds.split(",")
            } else {
                favoriteIds = [favoriteIds]
            }

            const index = favoriteIds.indexOf(movieId)
            favoriteIds.splice(index, 1)
            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: favoriteIds.join(","),
                }
            })

            return res.status(200).json(user)
        }

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}