import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await serverAuth(req, res);

    if (req.method == 'GET') {
        try {
            const os = require("os")
            const execSync = require('child_process').execSync

            const hotSpot = execSync("cmd", { encoding: 'utf-8' }).split("\r\n")[0]
            const smbStatus = execSync("cmd", { encoding: 'utf-8' }).split("\r\n")[0]

            const serverProps = {
                osUptime: os.uptime(),
                osPlatform: process.platform,
                osBuild: os.release(),
                osHostName: os.hostname(),
                serverUptime: process.uptime(),
                hotSpot: false,
                smbStatus: false,
            }

            return res.status(200).json(serverProps);
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }

    return res.status(405).end()
}