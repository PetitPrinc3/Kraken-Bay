import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';
import { isUndefined } from "lodash";
import path, { PlatformPath } from 'path';
import fs, { PathLike } from 'fs'
import { title } from "process";

const MoveFile = (origin: PathLike, destination: PathLike) => {
    fs.readdir(origin, (err, files) => {
        if (err) { }
        files.forEach((file) => {
            const oldPath = path.join(origin.toString(), file)
            const newPath = path.join(destination.toString(), file)
            const childStat = fs.lstatSync(oldPath)
            if (childStat.isDirectory()) {
                MoveFile(oldPath, newPath)
            } else if (childStat.isFile()) {
                fs.rename(oldPath, newPath, (err) => { })
            }

        })
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { currentUser }: any = await serverAuth(req, res)

    if (currentUser?.roles != "admin") return res.status(403).end()

    if (req.method == "GET") {
        try {
            const { searchText, uploadId } = req.query

            if (isUndefined(searchText) && isUndefined(uploadId)) {
                const pendigUploads = await prismadb.pendingMedia.findMany();
                return res.status(200).json(pendigUploads);
            } else if (!isUndefined(uploadId)) {
                if (typeof uploadId != 'string') {
                    throw new Error('Invalid ID');
                }
                if (!uploadId) {
                    throw new Error('Invalid ID');
                }
                const media = await prismadb.pendingMedia.findUnique({
                    where: {
                        id: uploadId,
                    }
                })
                return res.status(200).json(media)
            } else if (!isUndefined(searchText)) {
                const users = await prismadb.pendingMedia.findMany({
                    where: {
                        title: {
                            search: searchText?.toString()
                        },
                        description: {
                            search: searchText?.toString()
                        },
                        userName: {
                            search: searchText?.toString()
                        }
                    }
                })

                return res.status(200).json(users)
            }

        } catch (error) {
            return res.status(400).json(error)
        }
    }

    if (req.method == "PUT") {
        try {
            await serverAuth(req, res);
            const { uploadId } = req.body;

            if (typeof uploadId != 'string') {
                throw new Error("Invalid ID.")
            }

            const upload: any = await prismadb.pendingMedia.findUnique({
                where: {
                    id: uploadId
                }
            })

            const origin = path.join(process.cwd(), "/public/Assets/PendingUploads/", upload.id)
            const destination = path.join(process.cwd(), "/public/Assets/", upload.type, upload.id)
            fs.mkdir(path.join(destination, "thumb"), { recursive: true }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
            MoveFile(origin, destination)
            fs.rmdir(origin, { recursive: true }, (err) => { if (err?.code !== 'ENOENT') console.log(err) })


            const media = await prismadb.media.create({
                data: {
                    id: upload?.id,
                    title: upload?.title,
                    type: upload?.type,
                    description: upload?.description,
                    videoUrl: "/Assets/" + upload?.type + "/" + upload?.id + "/" + upload?.videoUrl,
                    thumbUrl: "/Assets/" + upload?.type + "/" + upload?.id + "/thumb/" + upload?.thumbUrl,
                    posterUrl: upload.posterUrl ? "/Assets/" + upload?.type + "/" + upload?.id + "/thumb/" + upload?.posterUrl : "/Assets/" + upload?.type + "/" + upload?.id + "/thumb/" + upload?.thumbUrl,
                    genre: upload?.genre,
                    uploadedBy: upload?.userName
                }
            })

            await prismadb.pendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            await prismadb.user.updateMany({
                where: {
                    email: upload?.userName,
                },
                data: {
                    uploadCount: { increment: 1 }
                }
            })

            return res.status(200).json(media)


        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == 'DELETE') {
        try {
            await serverAuth(req, res);
            const { uploadId } = req.body;

            const upload = await prismadb.pendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            const origin = path.join(process.cwd(), "/public/Assets/PendingUploads/", uploadId)
            fs.rmdir(origin, { recursive: true }, (err) => { if (err?.code !== 'ENOENT') console.log(err) })

            return res.status(200).json(upload)

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    return res.status(405).end()
}