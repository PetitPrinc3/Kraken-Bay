import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'
import { uploadData } from '@/lib/uploadData';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const options: formidable.Options = {}
    const uploadDir = path.join(uploadData.getUploadPath(), "/thumb/")
    fs.mkdir(uploadDir, { recursive: true }, (error) => { if (error && error.code != 'EEXIST') { console.log(error) } })
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
    }).catch((err) => { res.status(400).end() })
    return res.status(200).json(uploadFile.file.video[0].newFilename)
}

export default handler;