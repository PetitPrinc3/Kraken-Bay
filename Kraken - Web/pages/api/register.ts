import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { isUndefined } from "lodash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).end();
    }

    try {
        const { email, name, password } = req.body;
        const existingUser = await prismadb.User.findUnique({
            where: {
                email,
            }
        })

        if (existingUser) {
            return res.status(422).json({ error: 'Email taken' });
        }

        if (isUndefined(password) || typeof password != "string" || password == "") {
            return res.status(422).json({ error: 'Password required' })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prismadb.User.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
            }
        })

        return res.status(200).end()

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}