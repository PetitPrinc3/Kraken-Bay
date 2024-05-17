import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const options: formidable.Options = {}
    const uploadId = req.query.uploadId
    if (typeof uploadId != 'string') return res.status(400).json("Invalid ID")
    const uploadDir = path.join(process.cwd(), "public/Assets/PendingUploads", uploadId)
    fs.mkdir(uploadDir, { recursive: false }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
    options.uploadDir = uploadDir;
    options.filename = (name, ext, path, form) => {
        return path.originalFilename || "";
    };
    options.maxFileSize = Infinity;

    const form = formidable(options)

    const uploadFile = await new Promise((resolve: (value?: {} | PromiseLike<{}>) => void, reject) => {
        form.parse(req, (err, fields, file) => {
            if (err) reject(err)
            resolve({ fields, file })
        })
    }).catch((err) => { res.status(400).json(err) })
    return res.status(200).json("Video file uploaded.")
}

export default handler;