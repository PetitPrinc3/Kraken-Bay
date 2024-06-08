import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (req.method == "GET") {
        try {
            const pendingAccounts = await prismadb.user.findMany({
                where: {
                    roles: ""
                }
            });

            return res.status(200).json(pendingAccounts);

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == "PUT") {
        const { userId, userRole } = req.body

        try {
            if (typeof userId == 'string' && typeof userRole == 'string') {
                const validateAccount = await prismadb.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        roles: {
                            set: userRole as string
                        }
                    }
                })

                return res.status(200).json(validateAccount);
            } else {
                throw new Error("Invalid parameters.")
            }
        } catch {
            return res.status(400)
        }
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