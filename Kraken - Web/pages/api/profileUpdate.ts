import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import path from 'path';
import fs from 'fs'
import serverAuth from '@/lib/serverAuth';
import { isNull } from 'lodash';
import prismadb from '@/lib/prismadb'

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { currentUser }: any = await serverAuth(req, res)
    const options: formidable.Options = {}
    let uploadDir = "public/Assets/Images/UserProfiles"
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

    const newFile = uploadFile.file.pic[0].newFilename
    if (!isNull(currentUser.image)) {
        const oldFile = path.basename(currentUser.image)
        if (oldFile !== newFile) {
            fs.rm(path.join(uploadDir, oldFile), (err) => { console.log(err) })
        }
    }

    console.log(newFile)

    const user = await prismadb.user.update({
        where: {
            email: currentUser.email
        },
        data: {
            image: "/Assets/Images/UserProfiles/" + newFile
        }
    })

    return res.status(200).json(user)
}

export default handler;