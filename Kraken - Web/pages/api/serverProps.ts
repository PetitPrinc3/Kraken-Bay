import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs'

import serverAuth from "@/lib/serverAuth";
import { isUndefined } from "lodash";

function setEnvValue(key: string, value: string) {
    const os = require("os")
    const ENV_VARS = fs.readFileSync(".env", "utf-8").split(os.EOL)
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key))
    }) || "undefined")

    if (target !== -1) {
        ENV_VARS.splice(target, 1, `${key}="${value}"`)
    } else {
        ENV_VARS.push(`${key}="${value}"`)
    }

    fs.writeFileSync(".env", ENV_VARS.join(os.EOL))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { currentUser }: any = await serverAuth(req, res);

    if (currentUser?.roles != "admin") return res.status(403).end()

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
                databaseConfig: process.env.DATABASE_URL,
                imdbAPIKey: process.env.IMDB_API_SECRET,
                nextAuthUrl: process.env.NEXTAUTH_URL,
            }

            return res.status(200).json(serverProps);
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }

    if (req.method == "POST") {

        const { imdbKey, naSecret, jwtSecret } = req.body

        try {
            if (!isUndefined(imdbKey)) {
                setEnvValue("IMDB_API_SECRET", imdbKey)
            }
            if (!isUndefined(naSecret)) {
                setEnvValue("NEXTAUTH_SECRET", naSecret)
            }
            if (!isUndefined(jwtSecret)) {
                setEnvValue("NEXTAUTH_JWT_SECRET", jwtSecret)
            }

            return res.status(200).end()
        } catch (err) {
            return res.status(400).json(err)
        }

    }

    return res.status(405).end()
}