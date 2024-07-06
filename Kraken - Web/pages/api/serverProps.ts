import { NextApiRequest, NextApiResponse } from "next";
import fs, { stat } from 'fs'

import serverAuth from "@/lib/serverAuth";
import { isUndefined } from "lodash";
import path from "path";

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
        const { action } = req.query
        const os = require("os")
        const spawn = require('child_process').spawnSync

        if (action === "restartWEB") {
            if (process.platform.startsWith("win")) process.exit()
            try {
                spawn("systemctl", ["restart", "krakenWeb"], { encoding: "utf8" })
                return res.status(200).end()
            } catch (err) {
                return res.status(400).end()
            }
        }

        if (action === "restartSMB") {
            if (process.platform.startsWith("win")) return res.status(400).json("OS platform incompatible.")
            try {
                spawn("systemctl", ["restart", "smbd"], { encoding: "utf8" })
                return res.status(200).end()
            } catch (err) {
                return res.status(400).end()
            }
        }

        if (action === "restartAP") {
            if (process.platform.startsWith("win")) return res.status(400).json("OS platform incompatible.")
            try {
                spawn("systemctl", ["restart", "create_ap"], { encoding: "utf8" })
                return res.status(200).end()
            } catch (err) {
                return res.status(400).end()
            }
        }

        if (action === "reboot") {
            if (process.platform.startsWith("win")) {
                try {
                    spawn("shutdown", ["/r", "/t", "00"], { encoding: "utf8" })
                    return res.status(200).end()
                } catch (err) {
                    return res.status(400).json(err)
                }
            } else {
                try {
                    spawn("reboot", { encoding: "utf8" })
                    return res.status(200).end()
                } catch (err) {
                    return res.status(400).json(err)
                }
            }
        }

        try {

            const netCmd = () => {
                if (process.platform.startsWith("win")) {
                    const { stdout: brief } = spawn('netsh', ['wlan', 'show', 'interfaces'], { encoding: "utf8" })
                    if (brief === null) return null
                    for (let line of brief.split("\n")) {
                        if (line.trim().startsWith("Signal")) {
                            return parseInt(line.split(":")[1].trim())
                        }
                    }
                    return null
                } else {
                    const interfaces = os.networkInterfaces()
                    for (let iface in interfaces) {
                        if (iface.startsWith("wl")) {
                            const { stdout: brief } = spawn("iwconfig", [iface], { encoding: "utf8" })
                            if (brief === null) return null
                            for (let line of brief.split("\n")) {
                                if (line.trim().startsWith('Link Quality')) {
                                    const strength = line.trim().split("=")[1].split(" ")[0]
                                    if (Math.round(eval(strength) * 100) > 0) return Math.round(eval(strength) * 100)
                                }
                            }
                        }
                    }
                    return null
                }
            }

            const krakenWebService = () => {
                if (process.platform.startsWith("win")) return undefined
                const { stdout: status } = spawn("systemctl", ["status", "krakenWeb"], { encoding: "utf8" })
                if (status === null) return null
                for (let line of status.split("\n")) {
                    if (line.trim().startsWith("Active")) {
                        return line.split(":")[1].trim().split(" ")[0].trim() == "active" ? true : false
                    }
                }
            }

            const krakenSmbService = () => {
                if (process.platform.startsWith("win")) return undefined
                const { stdout: status } = spawn("systemctl", ["status", "krakenWeb"], { encoding: "utf8" })
                if (status === null) return null
                for (let line of status.split("\n")) {
                    if (line.trim().startsWith("Active")) {
                        return line.split(":")[1].trim().split(" ")[0].trim() == "active" ? true : false
                    }
                }
            }

            const krakenApService = () => {
                if (process.platform.startsWith("win")) return undefined
                const { stdout: status } = spawn("systemctl", ["status", "krakenWeb"], { encoding: "utf8" })
                if (status === null) return null
                for (let line of status.split("\n")) {
                    if (line.trim().startsWith("Active")) {
                        return line.split(":")[1].trim().split(" ")[0].trim() == "active" ? true : false
                    }
                }
            }

            const serverProps = {
                osUptime: os.uptime(),
                osPlatform: process.platform,
                osBuild: os.release(),
                osHostName: os.hostname(),
                serverUptime: process.uptime(),
                hotSpot: krakenApService(),
                smbStatus: krakenSmbService(),
                webService: krakenWebService(),
                databaseConfig: process.env.DATABASE_URL,
                tmdbAPIKey: process.env.TMDB_API_SECRET,
                nextAuthUrl: process.env.NEXTAUTH_URL,
                connectivity: netCmd()
            }

            return res.status(200).json(serverProps);
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    }

    if (req.method == "POST") {

        const { tmdbKey, naSecret, jwtSecret } = req.body

        try {
            if (!isUndefined(tmdbKey)) {
                setEnvValue("IMDB_API_SECRET", tmdbKey)
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