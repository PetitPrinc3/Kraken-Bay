import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

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

        const user = await prismadb.notification.create({
            data: {
                content: content,
                type: type || "info",
                status: "unread",
                recipient: recipient,
            }
        });

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}