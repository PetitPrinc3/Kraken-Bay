import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isEmpty } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res)
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
                if (isEmpty(user)) return res.status(400).json("Recipient not found.")
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


    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}