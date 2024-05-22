import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).end();
    }

    try {
        const { currentUser } = await serverAuth(req, res)
        const { data: muteValue } = req.body

        if (typeof muteValue != "string") {
            throw new Error("Invalid value.")
        }

        console.log(muteValue)

        const user = await prismadb.User.update({
            where: {
                id: currentUser.id,
            },
            data: {
                isMuted: {
                    set: muteValue == "true" ? true : false
                }
            }

        });

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}