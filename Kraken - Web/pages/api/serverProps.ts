import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'GET') {
        return res.status(405).end()
    }

    try {
        await serverAuth(req, res);
        const os = require("os")
        const SMB2 = require("smb2")
        let smbStatus = false

        const serverProps = {
            osUptime: os.uptime(),
            osPlatform: process.platform,
            osBuild: os.release(),
            osHostName: os.hostname(),
            serverUptime: process.uptime(),
            smbStatus: smbStatus,
        }

        return res.status(200).json(serverProps);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}