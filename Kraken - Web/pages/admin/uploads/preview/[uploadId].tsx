import { isUndefined } from "lodash"
import { useRouter } from "next/router"
import { FaArrowLeft } from "react-icons/fa"
import { AdminLayout } from "@/pages/_app"
import axios from "axios"
import usePendingUploads from "@/hooks/usePendingUploads"
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    if (session.user.roles != "admin") {
        return {
            redirect: {
                destination: "/account",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}

export default function Preview() {
    const router = useRouter()
    const { uploadId } = router.query
    const { data: data } = usePendingUploads({ uploadId: uploadId })
    console.log(data?.genre)

    const acceptUpload = async () => {
        await axios.put("/api/pendingUploads", { uploadId: uploadId })
        await axios.post("/api/notify", { recipient: data.uploadedBy, content: `Thank you for uploading ${data.title}`, type: "success" })
        router.push("..")
    }

    const rejectUpload = async () => {
        await axios.delete("/api/pendingUploads", { data: { uploadId } })
        await axios.post("/api/notify", { recipient: data.uploadedBy, content: `We decided to reject your upload for ${data.title}`, type: "success" })
        router.push("..")
    }

    if (isUndefined(data)) return null
    console.log(data)
    return (
        <AdminLayout parentName="Pending Uploads" pageName={"Preview : " + data?.title}>
            <div className="w-full h-fit grid grid-cols-[80%_20%] rounded-md">
                <div className="relative w-full h-full p-auto flex items-center bg-black rounded-l-md">
                    <video
                        className="focus:outline-none aspect-auto p-auto h-full w-full"
                        src={`/Assets/PendingUploads/${data?.id}/${data?.videoUrl}`}
                        height={"100%"}
                        width={"100%"}
                        controls
                    />
                    <div onClick={() => router.push("..")} className="absolute top-2 left-2 px-2 py-1 w-fit flex flex-row items-center text-white text-start cursor-pointer rounded-md hover:bg-slate-400 transition-all duration-300">
                        <FaArrowLeft />
                        <p className="px-2 font-semibold">Back</p>
                    </div>
                </div>
                <div className="h-fit min-h-full w-full flex flex-col justify-between items-center bg-slate-800 rounded-r-md cursor-default">
                    <div className="w-full h-fit p-2">
                        <div className="grid grid-cols-[20%_80%] gap-0 rounded-md border-2 border-slate-500 bg-slate-500">
                            <p className="text-white font-semibold bg-slate-500 py-2 px-3 h-full w-full [writing-mode:vertical-lr] rotate-180 text-center">Thumbnail</p>
                            <img src={`/Assets/PendingUploads/${data?.id}/thumb/${data?.thumbUrl}`} className="h-full rounded-r-md" alt="" />
                        </div>
                    </div>
                    <div className="w-full h-fit p-2">
                        <div className="grid grid-cols-[20%_80%] gap-0 rounded-md border-2 border-slate-500 bg-slate-500">
                            <p className="text-white font-semibold bg-slate-500 py-2 px-3 h-full w-full [writing-mode:vertical-lr] rotate-180 text-center">Poster</p>
                            <img src={`/Assets/PendingUploads/${data?.id}/thumb/${data?.posterUrl}`} className="h-full rounded-r-md" alt="" />
                        </div>
                    </div>
                    <div className="w-full h-fit p-2">
                        <div className="grid grid-cols-[20%_80%] gap-0 rounded-md border-2 border-slate-500 bg-slate-500">
                            <p className="text-white font-semibold bg-slate-500 py-2 px-3 h-full w-full [writing-mode:vertical-lr] rotate-180 text-center">Genres</p>
                            <div className="w-full h-full bg-slate-800 text-white font-semibold p-4 rounded-r-md">
                                {data?.genre}
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fit p-2">
                        <div className="grid grid-cols-[20%_80%] gap-0 rounded-md border-2 border-slate-500 bg-slate-500">
                            <p className="text-white font-semibold bg-slate-500 py-2 px-3 h-full w-full [writing-mode:vertical-lr] rotate-180 text-center">Descritpion</p>
                            <div className="w-full h-full bg-slate-800 text-white font-semibold p-4 rounded-r-md text-xs">
                                {data?.description}
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fit p-2 grid grid-cols-2 gap-4">
                        <button onClick={acceptUpload} className="w-full py-1 px-2 rounded-md ml-auto bg-green-500 hover:bg-green-400 transition-all duration-200">Accept</button>
                        <button onClick={rejectUpload} className="w-full py-1 px-2 rounded-md mr-auto bg-red-700 hover:bg-red-600 transition-all duration-200">Reject</button>
                    </div>
                </div>

            </div>
        </AdminLayout >
    )
}