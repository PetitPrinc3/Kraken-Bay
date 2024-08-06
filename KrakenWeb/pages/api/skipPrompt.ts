import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).end();
    }

    try {
        const { currentUser }: any = await serverAuth(req, res)
        const { skipPrompt } = req.body
        await prismadb.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                skipPrompt: (skipPrompt as unknown as boolean)
            }
        });

        return res.status(200).json(currentUser)
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}