import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { update } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end();
    }

    try {
        await serverAuth(req, res)
        const { userId, muteValue } = req.query

        if (typeof muteValue != "string" || typeof userId != "string") {
            throw new Error("Invalid value.")
        }

        const user = await prismadb.User.update({
            where: {
                id: userId,
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