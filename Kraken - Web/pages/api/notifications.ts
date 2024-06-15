import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { isEmpty } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {
        try {
            const { status } = req.query

            const notifications = await prismadb.notification.findMany({
                where: {
                    recipient: currentUser?.email,
                    status: status as string || undefined
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

    if (req.method == 'DELETE') {
        const { currentUser }: any = await serverAuth(req, res);

        const update = await prismadb.notification.updateMany({
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

    if (req.method == "POST") {
        if (currentUser.roles != "admin") return res.status(403).end()
        const { recipient, content, type } = req.body

        if (typeof recipient != "string") {
            return res.status(400).json("Invalid recipient.")
        }

        try {
            if (recipient == "all") {
                const user = await prismadb.user.findMany()
                for (let i = 0; i < user.length; i++) {
                    await prismadb.notification.create({
                        data: {
                            content: content,
                            type: type || "info",
                            status: "unread",
                            recipient: user[i].email,
                        }
                    });
                }
                return res.status(200).end()
            } else {
                const user = await prismadb.user.findUnique({
                    where: {
                        email: recipient
                    }
                })
                if (isEmpty(user)) {
                    console.log(recipient)
                    return res.status(400).json("Recipient not found.")
                }
                const notification = await prismadb.notification.create({
                    data: {
                        content: content,
                        type: type || "info",
                        status: "unread",
                        recipient: recipient,
                    }
                });
                return res.status(200).json(notification)
            }
        } catch (error) {
            return res.status(400).json("Invalid recipient.")
        }
    }

    return res.status(405).end()
}