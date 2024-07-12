import Tree from "@/components/Tree";
import { AdminLayout } from "@/pages/_app";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";

export default function Help() {

    const [mediaDetection, setMediaDetection] = useState(false)
    const [jsonLayout, setJsonLayout] = useState(false)

    return (
        <AdminLayout pageName="Help" >
            <div className="w-full h-fit max-h-full flex flex-col gap-4 p-4 bg-slate-800 rounded-md">
                <div className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Database schema</p>
                    <FaChevronRight />
                </div>
                <div className="flex flex-col gap-4 text-white">
                    <p className="w-full text-center text-2xl font-bold">The kraken database</p>
                    <div className="flex flex-row gap-4">
                        <table className="table-fixed text-xs">
                            <thead>
                                <tr className="font-semibold text-sm">
                                    Users
                                </tr>
                            </thead>
                            <tr className="">
                                <td className="pr-4 font-light" >id :</td>
                                <td className="text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >name :</td>
                                <td className="text-red-500">String</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >image :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >email :</td>
                                <td className="text-red-500">String</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >hashedPassword :</td>
                                <td className="text-red-500">String <span className="text-blue-500">(bcrypt)</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >createdAt :</td>
                                <td className="text-red-500">DateTime</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >updatedAt :</td>
                                <td className="text-red-500">DateTime</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >favoriteIds :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >uploadCount :</td>
                                <td className="text-red-500">Int<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >isMuted :</td>
                                <td className="text-red-500">Boolean</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >skipPrompt :</td>
                                <td className="text-red-500">Boolean</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >roles</td>
                                <td className="text-red-500">String <span className="text-blue-500">(&quot;admin&quot;, &quot;user&quot;, &quot;&quot;)</span></td>
                            </tr>
                        </table>
                        <table className="table-fixed text-xs">
                            <thead>
                                <tr className="font-semibold text-sm">
                                    Media
                                </tr>
                            </thead>
                            <tr className="">
                                <td className="pr-4 font-light" >id :</td>
                                <td className="text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >title :</td>
                                <td className="text-red-500">String</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >altTitle :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >languages :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >subtitles :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >type :</td>
                                <td className="text-red-500">String <span className="text-blue-500">(&quot;Movies&quot;, &quot;Series&quot;)</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >description :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >videoUrl :</td>
                                <td className="text-red-500">String</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >thumbUrl :</td>
                                <td className="text-red-500">String</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >posterUrl :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >genre :</td>
                                <td className="text-red-500">String <span className="text-blue-500">(separated by coma and space &quot; ,&quot;)</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >duration :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >seasons :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(Separated by coma &quot;,&quot;)</span></td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >createdAt :</td>
                                <td className="text-red-500">DateTime</td>
                            </tr>
                            <tr>
                                <td className="pr-4 font-light" >uploadedBy :</td>
                                <td className="text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(user email)</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div onClick={() => setJsonLayout(!jsonLayout)} className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>JSON Data formating</p>
                    <FaChevronRight className={jsonLayout ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${jsonLayout ? "flex" : "hidden"} flex-col gap-4`}>
                    <p className="w-full text-white">To successfully import data to the Users, Media or Episodes databases, your json files should be formated as follows :</p>
                    <div className="w-full flex lg:grid flex-col lg:grid-cols-3 gap-4 transition-all duration-200">
                        <div className="w-full h-full">
                            <div className="w-full bg-zinc-700 rounded-t-md flex flex-row items-center justify-end gap-2 py-3 px-4">
                                <p className="w-full text-left italic text-white">Users.json</p>
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="p-4 bg-black rounded-b-md">
                                <pre className="text-white text-sm font-extralight italic max-w-full overflow-hidden">
                                    {JSON.stringify({
                                        "Users": [{
                                            "id": "(optional)",
                                            "name": "kraken",
                                            "image": "/Assets/Images/UserProfiles/...",
                                            "email": "kraken@kraken.local",
                                            "hashedPassword": "Bcrypt hash",
                                            "createdAt": "(optional)",
                                            "updatedAt": "(optional)",
                                            "favoriteIds": "(optional)",
                                            "uploadCount": "Number",
                                            "isMuted": "Boolean",
                                            "roles": "admin or user",
                                            "skipPrompt": "Boolean"
                                        },
                                        { "...": "..." }]
                                    }, null, 4)}
                                </pre>
                            </div>
                        </div>
                        <div className="w-full h-full">
                            <div className="w-full bg-zinc-700 rounded-t-md flex flex-row items-center justify-end gap-2 py-3 px-4">
                                <p className="w-full text-left italic text-white">Media.json</p>
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="w-full p-4 bg-black rounded-b-md">
                                <pre className="text-white text-sm font-extralight italic max-w-full overflow-hidden">
                                    {JSON.stringify({
                                        "Titles": [{
                                            "id": "(optional)",
                                            "title": "Home Alone",
                                            "altTitle": "Maman j'ai raté l'avion",
                                            "languages": "french, english",
                                            "subtitles": "french, english",
                                            "type": "Movies or Series",
                                            "description": "Short overview.",
                                            "videoUrl": "/Assets/Movies/...",
                                            "thumbUrl": "/Assets/Images/...",
                                            "posterUrl": "/Assets/Images/...",
                                            "genre": "Horror, Thriller",
                                            "duration": "If type is Movies",
                                            "seasons": "If type is Series",
                                            "createdAt": "(optional)",
                                            "uploadedBy": "(optional)",
                                        },
                                        { "...": "..." }]
                                    }, null, 4)}
                                </pre>
                            </div>
                        </div>
                        <div className="w-full h-full">
                            <div className="w-full bg-zinc-700 rounded-t-md flex flex-row items-center justify-end gap-2 py-3 px-4">
                                <p className="w-full text-left italic text-white">Episodes.json</p>
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="w-full p-4 bg-black rounded-b-md">
                                <pre className="text-white text-sm font-extralight italic max-w-full overflow-hidden">
                                    {JSON.stringify({
                                        "Episodes": [
                                            {
                                                "id": "(optional)",
                                                "title": "How I Met Your Mother : SO 1, EP 1",
                                                "serieId": "Id of parent TV Show",
                                                "season": "number",
                                                "episode": "number",
                                                "videoUrl": "/Assets/Series/...",
                                                "createdAt": "(optional)",
                                                "userId": "(automatic)",
                                                "mediaId": "(automatic)",
                                                "pendingMediaId": "(automatic)"
                                            },
                                            { "...": "..." }]
                                    }, null, 4)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={() => setMediaDetection(!mediaDetection)} className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Automatic Media detection</p>
                    <FaChevronRight className={mediaDetection ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${mediaDetection ? "flex" : "hidden"} w-full flex-col gap-4 transition-all duration-200`}>
                    <p className="w-full text-center text-2xl font-bold text-white">How does it work ?</p>
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