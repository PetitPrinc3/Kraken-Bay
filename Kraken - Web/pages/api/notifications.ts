import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            const { currentUser }: any = await serverAuth(req, res);

            const notifications = await prismadb.notification.findMany({
                where: {
                    recipient: currentUser?.email
                },
                orderBy: {
                    date: 'desc'
                }
            }).catch((err: any) => { return res.status(400).json(err) })

            return res.status(200).json(notifications);

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    return res.status(405).end()
}