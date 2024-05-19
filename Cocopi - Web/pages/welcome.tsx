import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import prismadb from '@/lib/prismadb'
import axios from "axios";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false,

            }
        }
    }

    if (session.user.skipPrompt) {
        return {
            redirect: {
                destination: '/home',
                permanent: false,

            }
        }
    }

    return {
        props: {}
    }
}

const Welcome = () => {

    const router = useRouter();
    const { data: user } = useCurrentUser();
    const [neverShow, setNeverShow] = useState(false)

    return (
        <div className="flex items-center h-full justify-center">
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl md:h-[20vh] md:text-6xl text-white text-center">Welcome</h1>
                <div className="flex items-center w-[90vw] md:w-[60vw] md:max-h-[50vh] bg-neutral-700 rounded-md border-2 border-zinc-500 text-white test-sm px-4 py-6 overflow-scroll scrollbar-hide">
                    <div className="flex flex-col list-disc">
                        <p>
                            This is a short introduction with valuable informations on how to properly use Cocopi. <br />
                            You will find here a certain amount of Movies and TV Shows that are hosted locally. <br />
                            Here are a few identified issues you may encouter : <br />
                            <br />

                        </p>
                        <ul className="list-disc pl-5">
                            <li>
                                Because of the format of certain files, you will find that some do not render correctly in the web player. <br />
                                I recommend you download the file and watch it locally on your own device.
                            </li>
                            <li>
                                Some functionalities are not yet implemented and may not work or crash. Please feel free to me send your feedback.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-[90vw] md:w-[60vw]  flex flex-row items-center">
                    <div className="flex flex-row gap-2 item-center text-sm text-zinc-400 font-semibold">
                        <input onChange={() => setNeverShow(!neverShow)} id="NeverShowAgain" type="checkbox" className="appearance-none w-3 h-3 mt-auto mb-1 rounded-sm bg-neutral-700 border-1 border-zinc-500 checked:bg-zinc-500 peer" />
                        <FaCheck className="absolute l-0 mr-auto w-3 h-3 mt-1 hidden peer-checked:block pointer-events-none" size={5} />
                        <label className="cursor-pointer" htmlFor="NeverShowAgain">Never show this again</label>
                    </div>
                    <button onClick={async () => {
                        if (neverShow) {
                            axios.post("/api/skipPrompt", { userId: user.id, skipPrompt: neverShow })
                        }
                        router.push('/home')
                    }}
                        className="ml-auto justify-end font-semibold text-white transition-all duration-500 py-2 px-4 rounded-md hover:bg-right-bottom bg-gradient-to-l from-white from-50% to-transparent to-50% bg-[length:200%_100%] hover:text-neutral-700">
                        Enter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Welcome;