import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res)

    if (currentUser?.roles != "admin") return res.status(403).end()

    if (req.method == "GET") {
        try {
            const { searchText } = req.query

            if (isUndefined(searchText)) {
                const pendingAccounts = await prismadb.user.findMany({
                    where: {
                        roles: ""
                    }
                });

                return res.status(200).json(pendingAccounts);
            } else {
                const users = await prismadb.user.findMany({
                    where: {
                        AND: [
                            {
                                name: {
                                    search: searchText?.toString()
                                },
                                email: {
                                    search: searchText?.toString()
                                }
                            },
                            {
                                roles: ""
                            }]
                    }
                })

                return res.status(200).json(users)
            }

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