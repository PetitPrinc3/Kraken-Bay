import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import path from 'path';

import prismadb from '@/lib/prismadb'
import { title } from 'process';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const options: formidable.Options = {}
    const uploadDir = path.join(process.cwd(), "/public/Assets/PendingUploads")
    options.uploadDir = uploadDir;
    options.filename = (name, ext, path, form) => {
        return path.originalFilename || "";
    };
    options.maxFileSize = Infinity;

    const form = formidable(options)

    const uploadFile = new Promise((resolve, reject) => {
        const uploadFile = form.parse(req, (err, fields, file) => {
            if (err) reject(err)
            resolve({ fields, file })
            return file
        })
        return uploadFile
    }).then((data) => data).catch((err) => { res.status(400).end() })

    return res.status(200).json(uploadDir)
}

export default handler;