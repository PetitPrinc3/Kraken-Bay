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

        if (action === "toggleAP") {
            if (process.platform.startsWith("win")) return res.status(400).json("OS platform incompatible.")
            const { stdout: status } = spawn("systemctl", ["status", "linux-router"], { encoding: "utf8" })
            if (status === null) return null
            for (let line of status.split("\n")) {
                if (line.trim().startsWith("Active")) {
                    if (line.split(":")[1].trim().split(" ")[0].trim() == "active") {
                        try {
                            spawn("systemctl", ["stop", "linux-router"], { encoding: "utf8" })
                            return res.status(200).end()
                        } catch (err) {
                            return res.status(400).end()
                        }
                    } else {
                        try {
                            spawn("systemctl", ["start", "linux-router"], { encoding: "utf8" })
                            return res.status(200).end()
                        } catch (err) {
                            return res.status(400).end()
                        }
                    }
                }
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

        if (action === "poweroff") {
            if (process.platform.startsWith("win")) {
                try {
                    spawn("shutdown", ["/s", "/t", "00"], { encoding: "utf8" })
                    return res.status(200).end()
                } catch (err) {
                    return res.status(400).json(err)
                }
            } else {
                try {
                    spawn("poweroff", { encoding: "utf8" })
                    return res.status(200).end()
                } catch (err) {
                    return res.status(400).json(err)
                }
            }
        }

        if (action === "toggleSql") {
            const { stdout: stats } = spawn("docker", ["container", "ls", "-a", "--format", "json"], { encoding: "utf-8" })
            if (stats === null) return null
            let state, id
            for (let container of stats.split("\n").filter((i: string) => i != "")) {
                container = JSON.parse(container.trim())
                if (container?.Names == "krakenSql") {
                    id = container?.ID
                    state = container?.State == "running"
                }
            }
            await spawn("docker", ["container", "stop", id])
            await spawn("docker", ["container", "start", id])
            return res.status(200).end()
        }

        if (action === "toggleSrv") {
            const { stdout: stats } = spawn("docker", ["container", "ls", "-a", "--format", "json"], { encoding: "utf-8" })
            if (stats === null) return null
            let state, id
            for (let container of stats.split("\n").filter((i: string) => i != "")) {
                container = JSON.parse(container.trim())
                if (container?.Names == "krakenSrv") {
                    id = container?.ID
                    state = container?.State == "running"
                }
            }
            if (state) {
                await spawn("docker", ["container", "stop", id])
                return res.status(200).end()
            } else {
                await spawn("docker", ["container", "start", id])
                return res.status(200).end()
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
                                    return Math.round(eval(strength) * 100)
                                }
                            }
                        }
                    }
                    return null
                }
            }

            const powCmd = () => {
                if (process.platform.startsWith("win")) {
                    const { stdout: level } = spawn('wmic', ['Path', 'Win32_Battery', 'Get', 'EstimatedChargeRemaining'], { encoding: "utf8" })
                    const { stdout: status } = spawn('wmic', ['Path', 'Win32_Battery', 'Get', 'BatteryStatus'], { encoding: "utf8" })
                    return {
                        level: level === null ? null : level.split("\n")[1].trim(),
                        status: status === null ? null : status.split("\n")[1].trim() == "2" ? true : false
                    }
                }
                else {
                    const { stdout: infos } = spawn('upower', ['-i', '/org/freedesktop/UPower/devices/DisplayDevice'], { encoding: "utf8" })
                    let level, status = null
                    if (infos === null) return {
                        level: level,
                        status: status
                    }
                    for (let line of infos.split("\n")) {
                        if (line.trim().startsWith("state")) {
                            status = line.split(":")[1].trim() == "charging" ? true : false
                        }
                        if (line.trim().startsWith("percentage")) {
                            level = line.split(":")[1].trim().split("%")[0].trim()
                        }
                    }
                    return {
                        level: level,
                        status: status
                    }
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
                const { stdout: status } = spawn("systemctl", ["status", "smbd"], { encoding: "utf8" })
                if (status === null) return null
                for (let line of status.split("\n")) {
                    if (line.trim().startsWith("Active")) {
                        return line.split(":")[1].trim().split(" ")[0].trim() == "active" ? true : false
                    }
                }
            }

            const krakenApService = () => {
                if (process.platform.startsWith("win")) return undefined
                const { stdout: status } = spawn("systemctl", ["status", "linux-router"], { encoding: "utf8" })
                if (status === null) return null
                for (let line of status.split("\n")) {
                    if (line.trim().startsWith("Active")) {
                        return line.split(":")[1].trim().split(" ")[0].trim() == "active" ? true : false
                    }
                }
            }

            const diskUse = () => {
                if (process.platform.startsWith("win")) {
                    const { stdout: wmic } = spawn("wmic", ["LOGICALDISK", "GET", "FreeSpace,Size,Name"], { encoding: "utf8" })
                    if (diskUse === null) return null
                    for (let line of wmic.split("\n")) {
                        if (line.includes("C:")) {
                            const used = +(line.trim().split(" ")[0]) / (1024 ** 3)
                            const free = +(line.trim().split(" ")[line.trim().split(" ").length - 1]) / (1024 ** 3)
                            return `${used.toFixed(1)}/${free.toFixed(1)}`
                        }
                    }
                } else {
                    let dsk_pth = process.env.MEDIA_STORE_PATH
                    const { stdout: df } = spawn("df", { encoding: "utf-8" })
                    if (df === null || isUndefined(dsk_pth)) return null
                    while (dsk_pth.length > 0 && !df.includes(dsk_pth)) {
                        dsk_pth = dsk_pth?.slice(0, -1)
                    }
                    for (let line of df.split("\n")) {
                        if (line.includes(dsk_pth)) {
                            const data = line.split(" ").filter((i: string) => i != "")
                            return `${(+data[3] / (1000 ** 2)).toFixed(1)}/${((+data[2] + +data[3]) / (1000 ** 2)).toFixed(1)}`
                        }
                    }
                }
            }

            const containers = () => {
                const { stdout: stats } = spawn("docker", ["container", "ls", "-a", "--format", "json"], { encoding: "utf-8" })
                if (stats === null) return null
                let containers = {
                    krakenSql: {
                        id: "N/A",
                        state: false,
                        status: "N/A"
                    }, krakenSrv: {
                        id: "N/A",
                        state: false,
                        status: "N/A"
                    }
                }
                for (let container of stats.split("\n").filter((i: string) => i != "")) {
                    container = JSON.parse(container.trim())
                    if (container?.Names == "krakenSql") {
                        containers.krakenSql = {
                            id: container?.ID,
                            state: container?.State == "running",
                            status: container?.Status
                        }
                    }
                    if (container?.Names == "krakenSrv") {
                        containers.krakenSrv = {
                            id: container?.ID,
                            state: container?.State == "running",
                            status: container?.Status
                        }
                    }
                }
                return containers
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
                connectivity: netCmd(),
                battery: powCmd(),
                fileStore: process.env.MEDIA_STORE_PATH,
                diskUse: diskUse(),
                containers: containers()
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