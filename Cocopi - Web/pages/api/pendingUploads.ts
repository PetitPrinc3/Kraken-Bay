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
    if (req.method == "GET") {
        try {
            const { currentUser } = await serverAuth(req, res);
            const { uploadId } = req.query;

            if (isUndefined(uploadId)) {
                const pendigUploads = await prismadb.PendingMedia.findMany();

                return res.status(200).json(pendigUploads);
            }

            if (typeof uploadId != 'string') {
                throw new Error("Invalid ID.")
            }

            const upload = await prismadb.PendingMedia.findUnique({
                where: {
                    id: uploadId
                }
            })

            const origin = path.join(process.cwd(), "/public/Assets/PendingUploads/", upload.id)
            const destination = path.join(process.cwd(), "/public/Assets/", upload.type, upload.id)
            fs.mkdir(path.join(destination, "thumb"), { recursive: true }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
            MoveFile(origin, destination)
            fs.rmdir(origin, (err) => console.log(err))


            const media = await prismadb.Media.create({
                data: {
                    id: upload?.id,
                    title: upload?.title,
                    type: upload?.type,
                    description: upload?.description,
                    videoUrl: "/Assets/" + upload?.type + "/" + upload?.id + "/" + upload?.videoUrl,
                    thumbUrl: "/Assets/" + upload?.type + "/" + upload?.id + "/thumb/" + upload?.thumbUrl,
                    posterUrl: upload.posterUrl ? "/Assets/" + "/" + upload?.id + upload?.type + "/thumb/" + upload?.posterUrl : "/Assets/" + upload?.type + "/" + upload?.id + "/thumb/" + upload?.thumbUrl,
                    genre: upload?.genre
                }
            })

            await prismadb.PendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            return res.status(200).json("Ok !")


        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    if (req.method == 'DELETE') {
        try {
            const { currentUser } = await serverAuth(req, res);
            const { uploadId } = req.body;

            const upload = await prismadb.PendingMedia.delete({
                where: {
                    id: uploadId,
                }
            })

            return res.status(200).json(upload)

        } catch (error) {
            console.log(error);
            return res.status(400).end()
        }
    }

    return res.status(405).end()
}