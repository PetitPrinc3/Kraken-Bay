import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'
import mime from '@/lib/mime'

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const options: formidable.Options = {}
    const uploadId = req.query.uploadId
    if (typeof uploadId != 'string') return res.status(400).json("Invalid ID")
    let uploadDir = path.join(process.cwd(), "public/Assets/PendingUploads", uploadId)
    fs.mkdir(uploadDir, { recursive: true }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
    uploadDir = path.join(uploadDir, "thumb")
    fs.mkdir(uploadDir, { recursive: true }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
    options.uploadDir = uploadDir;
    options.filename = (name, ext, path, form) => {
        return path.originalFilename || "";
    };
    options.maxFileSize = Infinity;

    const form = formidable(options)

    const uploadFile: any = await new Promise((resolve: (value?: {} | PromiseLike<{}>) => void, reject) => {
        form.parse(req, (err, fields, file) => {
            if (err) reject(err)
            resolve({ fields, file })
        })
    }).catch((err) => { res.status(400).json(err) })

    if (uploadFile.file?.Thumbnail) {
        var fileType = await mime(uploadFile.file.Thumbnail[0].filepath)
        if (fileType.mime != "Image") {
            fs.rm(uploadFile.file.Thumbnail[0].filepath, (err) => console.log(err))
            return res.status(400).json("Invalid file type.")
        }
    }

    if (uploadFile.file?.Poster) {
        var fileType = await mime(uploadFile.file.Poster[0].filepath)
        if (fileType.mime != "Image") {
            fs.rm(uploadFile.file.Poster[0].filepath, (err) => console.log(err))
            return res.status(400).json("Invalid file type.")
        }
    }

    return res.status(200).json(uploadFile)
}

export default handler;