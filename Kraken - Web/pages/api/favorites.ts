import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
        const { currentUser }: any = await serverAuth(req, res);

        if (req.method == "GET") {
            try {
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

        if (req.method == 'POST') {
            const { mediaId } = req.body;
            let existingMovie = await prismadb.media.findUnique({
                where: {
                    id: mediaId,
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

            favoriteIds.push(mediaId)
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
            const { mediaId } = req.body;
            let existingMovie = await prismadb.media.findUnique({
                where: {
                    id: mediaId,
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

            const index = favoriteIds.indexOf(mediaId)
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

        res.status(405).end()
    } catch {
        return res.status(403).end()
    }


}