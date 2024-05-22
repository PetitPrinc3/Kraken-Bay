import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            const { currentUser } = await serverAuth(req, res);

            const notifications = await prismadb.Notification.findMany({
                where: {
                    recipient: currentUser?.email,
                    status: "unread"
                },
                orderBy: {
                    date: 'desc'
                }
            })

            return res.status(200).json(notifications);

        } catch (error) {
            throw new Error(error)
            return res.status(400).end()
        }
    }

    if (req.method == 'DELETE') {
        const { currentUser } = await serverAuth(req, res);

        const update = await prismadb.Notification.updateMany({
            where: {
                recipient: currentUser?.email,
                status: "unread"
            },
            data: {
                status: "read"
            }
        })

        return res.status(200).json(update)

    }

    return res.status(405).end()
}