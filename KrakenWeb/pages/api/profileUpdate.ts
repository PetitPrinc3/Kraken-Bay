import type { NextApiRequest, NextApiResponse } from 'next'
import { isNull } from 'lodash';
import formidable from 'formidable';
import fs from 'fs'
import path from 'path';
import serverAuth from '@/lib/serverAuth';
import prismadb from '@/lib/prismadb'
import mime from '@/lib/mime';

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

    var fileType = await mime(uploadFile.file.pic[0].filepath)
    if (fileType.mime != "Image") {
        fs.rm(uploadFile.file.pic[0].filepath, (err) => console.log(err))
        return res.status(400).json("Invalid file type.")
    }

    const newFile = uploadFile.file.pic[0].newFilename
    if (!isNull(currentUser.image)) {
        const oldFile = path.basename(currentUser.image)
        if (oldFile !== newFile) {
            fs.rm(path.join(uploadDir, oldFile), (err) => { console.log(err) })
        }
    }

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