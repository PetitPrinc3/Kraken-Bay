import Tree from "@/components/Tree";
import { AdminLayout } from "@/pages/_app";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";

export default function Help() {

    const [mediaDetection, setMediaDetection] = useState(false)

    return (
        <AdminLayout pageName="Help" >
            <div className="w-full h-fit max-h-full flex flex-col gap-4 p-4 bg-slate-800 rounded-md">
                <div className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Database schema</p>
                    <FaChevronRight />
                </div>

                <div className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>JSON Data formating</p>
                    <FaChevronRight />
                </div>
                <div onClick={() => setMediaDetection(!mediaDetection)} className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Automatic Media detection</p>
                    <FaChevronRight className={mediaDetection ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${mediaDetection ? "h-full opacity-100" : "h-0 opacity-0"} w-full flex flex-col gap-4 transition-all duration-200`}>
                    <p className="w-full text-center text-2xl font-semibold text-white">How does it work ?</p>
                    <div className="flex flex-col md:grid md:grid-cols-[30%_70%]">
                        <div className="w-fit h-fit">
                            <Tree name="/Assets">
                                <Tree name="/Movies">
                                    <Tree name="Movie 1.mp4" style={{ color: '#37ceff' }} />
                                    <Tree name="Movie 2.mkv" style={{ color: '#37ceff' }} />
                                    <Tree name="Movie 3.avi" style={{ color: '#37ceff' }} />
                                    <Tree name="..." />
                                </Tree>
                                <Tree name="/Series">
                                    <Tree name="Serie 1">
                                        <Tree name="SO 1">
                                            <Tree name="EP 1.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="EP 2.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="..." />
                                        </Tree>
                                        <Tree name="SO 2">
                                            <Tree name="EP 1.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="EP 2.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="..." />
                                        </Tree>
                                    </Tree>
                                    <Tree name="Serie 2">
                                        <Tree name="..." />
                                    </Tree>
                                </Tree>
                            </Tree>
                        </div>
                        <div className="w-full h-full px-4 flex flex-col items-center text-white">
                            <ul className="list-disc my-auto">
                                <li className="mt-4" >
                                    Drop your files in the &quot;<span className="italic font-extralight">Kraken - Web/public/Assets</span>&quot; folder accordingly with this schema.
                                </li>
                                <li className="mt-4" >
                                    Run the automatic media detection from the admin panel :
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    The software will scan for files that are not registered in the Media and Episodes databases.
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    It will determine a title based on the name of the file.
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    If connected to network, it will fetch possible titles from The Movie Database.
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    It will return the list of newly detected media and let you choose a title for each.
                                </li>
                                <li className="mt-4" >
                                    Click on &quot;<span className="italic font-extralight">Import Files</span>&quot; and the software will process each file based on its type :
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    For movies, it will fetch informations from The Movie Database including poster and thumbnail.
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit" size={10} />
                                    For TV Shows, it will fetch informations from The Movie Database including poster and thumbnail if the serie is new.
                                </li>
                                <li className="ml-2 list-none flex flex-row items-center gap-2">
                                    <FaChevronRight className="min-w-fit min-h-fit text-transparent" size={10} />
                                    Otherwise, it will import newly found episodes and update the TV Show record.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}