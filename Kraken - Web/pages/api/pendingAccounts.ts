import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        try {
            await serverAuth(req, res);
            const { userId, userRole } = req.query;

            if (isUndefined(userId)) {
                const pendigAccounts = await prismadb.user.findMany({
                    where: {
                        roles: ""
                    }
                });

                return res.status(200).json(pendigAccounts);
            }

            if (typeof userId != 'string') {
                throw new Error("Invalid user.")
            }

            if (!isUndefined(userRole)) {
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

                return validateAccount;
            }


        } catch (error) {
            console.log(error);
            return res.status(400).end()
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