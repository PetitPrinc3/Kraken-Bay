import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {
        try {
            const bestUploaders: object[] = []
            const uploadersUpdate = await prismadb.user.findMany({})

            for (let i = 0; i < uploadersUpdate.length; i++) {
                const uploads = await prismadb.media.findMany({
                    where: {
                        uploadedBy: uploadersUpdate[i].email
                    }
                })
                await prismadb.user.update({
                    where: {
                        id: uploadersUpdate[i].id
                    },
                    data: {
                        uploadCount: uploads.length
                    }
                })
            }

            const uploaders = await prismadb.user.findMany({
                where: {
                    NOT: {
                        uploadCount: 0
                    }
                },
                orderBy: {
                    uploadCount: 'desc'
                },
                take: 3
            })

            for (let i = 0; i < uploaders.length; i++) {
                const latestUpload = await prismadb.media.findMany({
                    where: {
                        uploadedBy: uploaders[i].email
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                })

                if (latestUpload.length > 0) {
                    bestUploaders.push({
                        email: uploaders[i].email,
                        image: uploaders[i].image,
                        uploads: uploaders[i].uploadCount,
                        latestUpload: latestUpload[0].title
                    })
                } else {
                    bestUploaders.push({
                        email: uploaders[i].email,
                        image: uploaders[i].image,
                        uploads: uploaders[i].uploadCount,
                        latestUpload: undefined
                    })
                }
            }

            return res.status(200).json(bestUploaders)
        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == "PUT") {
        return res.status(405).end()
    }

    if (req.method == 'DELETE') {
        try {
            await serverAuth(req, res);
            const { userId } = req.body;

            const user = await prismadb.user.delete({
                where: {
                    id: userId,
                }
            })

            return res.status(200).json(user)
        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    res.status(405).end()
}