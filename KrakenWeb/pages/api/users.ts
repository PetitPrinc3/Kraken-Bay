import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";
import { isNull, isUndefined } from "lodash";
import fs from 'fs/promises'
import mime from '@/lib/mime';
import path from "path";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { currentUser }: any = await serverAuth(req, res);

        if (req.method == 'GET') {
            if (currentUser?.roles != "admin") return res.status(403).end()

            const { searchText, userId } = req.query

            if (!isUndefined(userId)) {
                const user = await prismadb.user.findUnique({
                    where: { id: userId as string }
                })
                return res.status(200).json(user)
            } else if (!isUndefined(searchText)) {
                const users = await prismadb.user.findMany({
                    where: {
                        name: {
                            search: searchText as string
                        },
                        email: {
                            search: searchText as string
                        }
                    }
                })
                return res.status(200).json(users)
            } else {
                const users = await prismadb.user.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                })
                return res.status(200).json(users)
            }
        }

        if (req.method == 'DELETE') {
            if (currentUser.roles == "admin") {
                const { userId } = req.query
                if (isUndefined(userId)) {
                    await prismadb.user.deleteMany({
                        where: {
                            NOT: {
                                id: currentUser.id
                            }
                        }
                    })
                    return res.status(200).json("DB Purged.")
                } else {
                    const target = await prismadb.user.delete({
                        where: {
                            id: userId as string
                        }
                    })

                    if (isUndefined(target)) {
                        return res.status(400).json("Invalid entry.")
                    } else {
                        return res.status(200).json("Entry deleted.")
                    }

                }
            } else {
                return res.status(403).end()
            }
        }

        if (req.method == "POST") {
            try {
                const { userData } = req.body
                if (currentUser?.roles != "admin") {
                    userData.id = currentUser.id
                    userData.roles = currentUser.roles
                }

                if (!isUndefined(userData.hashedPassword)) {
                    userData.hashedPassword = await bcrypt.hash(userData.hashedPassword, 12)
                }

                if (isUndefined(userData?.id)) {
                    try {
                        const user = await prismadb.user.create({
                            data: userData
                        })
                        return res.status(200).json(user)
                    } catch {
                        return res.status(400).json("Invalid data")
                    }
                }

                const user = await prismadb.user.findUnique({
                    where: {
                        id: userData.id as string
                    }
                })

                if (isNull(user)) {
                    try {
                        const new_user = await prismadb.user.create({
                            data: userData
                        })
                        return res.status(200).json(new_user)
                    } catch {
                        return res.status(400).json("Invalid data")
                    }
                }

                if (!isUndefined(userData.image) && !isNull(userData.image) && typeof userData.image != "string") {
                    try {
                        const imageBuffer = Buffer.from(userData.image.imageBuffer.data)
                        const filePath = `${process.env.MEDIA_STORE_PATH}/Images/UserProfiles/${userData.id + path.extname(userData.image.fileName)}`
                        await fs.writeFile(filePath, imageBuffer)
                        const fileType = await mime(filePath)
                        if (fileType.mime != "Image") {
                            await fs.rm(filePath)
                            return res.status(400).json(`Invalid image : ${fileType.header + ":" + fileType.mime}`)
                        }
                        if (!isUndefined(user.image) && (!isNull(user.image)) && user.image != `${process.env.MEDIA_SRV_URL}/Images/UserProfiles/${userData.id + path.extname(userData.image.fileName)}`) {
                            try {
                                !isUndefined(process.env.MEDIA_STORE_PATH) && await fs.rm(process.env.MEDIA_STORE_PATH + user.image?.split(process.env.MEDIA_SRV_URL as string)[1])
                            } catch {

                            }
                        }
                        userData.image = `${process.env.MEDIA_SRV_URL}/Images/UserProfiles/${userData.id + path.extname(userData.image.fileName)}`
                    } catch (err) {
                        console.log(err)
                        return res.status(400).json("Image update impossible.")
                    }
                }

                const update = await prismadb.user.update({
                    where: {
                        id: userData.id as string
                    },
                    data: userData
                })
                return res.status(200).json(update)
            } catch (err) {
                console.log(err)
            }

        }

        return res.status(405).end();

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}