import Tree from "@/components/Tree";
import useServerProps from "@/hooks/useServerProps";
import { AdminLayout } from "@/pages/_app";
import { isUndefined } from "lodash";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";

export default function Help() {

    const [mediaDetection, setMediaDetection] = useState(false)
    const [jsonLayout, setJsonLayout] = useState(false)
    const [dbSchema, setDbSchema] = useState(false)
    const { data: serverProps } = useServerProps()

    return (
        <AdminLayout pageName="Help" >
            <div className="w-full h-fit max-h-full flex flex-col gap-2 p-4 bg-slate-800 rounded-md">
                <div onClick={() => setDbSchema(!dbSchema)} className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Database schema</p>
                    <FaChevronRight className={dbSchema ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${dbSchema ? "flex" : "hidden"} flex-col gap-4 transition-all duration-200`}>
                    <p className="w-full text-center text-2xl font-bold text-white">The kraken database</p>
                    <div className="flex flex-row flex-wrap justify-center gap-4 text-white">
                        <table className="text-xs mb-auto">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>Users</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >name</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >image</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >email</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-green-500">(unique)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >hashedPassword</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(bcrypt)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >createdAt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >updatedAt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >favoriteIds</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >uploadCount</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">Int<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >isMuted</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">Boolean</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >skipPrompt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">Boolean</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >roles</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(&quot;admin&quot;, &quot;user&quot;, &quot;&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="px-2 bg-slate-900 font-light border-[1px] border-slate-500 text-center">
                                        Full text search on name & email
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-fixed border-[1px] mb-auto border-slate-500 text-xs">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>Media</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >title</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >altTitle</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >languages</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >subtitles</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >type</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(&quot;Movies&quot;, &quot;Series&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >description</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >videoUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >thumbUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >posterUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >genre</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(separated by coma and space &quot; ,&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >duration</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >seasons</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(Separated by coma &quot;,&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >createdAt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >uploadedBy</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(user email)</span></td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="px-2 bg-slate-900 font-light border-[1px] border-slate-500 text-center">
                                        Full text search on title, altTitle, description & genre<br />
                                        Full text search on title, altTitle, description, videoUrl & uploadedBy<br />
                                        Full text search on genre<br />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-fixed border-[1px] mb-auto border-slate-500 text-xs">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>Episodes</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >title</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >serieId</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(is an id of Media)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >season</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">Int</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >episode</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">Int</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >videoUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >createdAt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="px-2 bg-slate-900 font-light border-[1px] border-slate-500 text-center">
                                        Unique combination of serieId, season & episode
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-fixed border-[1px] mb-auto border-slate-500 text-xs">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>PendingMedia</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >title</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >type</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(&quot;Movies&quot;, &quot;Series&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >description</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >videoUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >thumbUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >posterUrl</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >genre</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(separated by coma and space &quot; ,&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >duration</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >seasons</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(Separated by coma &quot;,&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >createdAt</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >userName</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(uploader email)</span></td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="px-2 bg-slate-900 font-light border-[1px] border-slate-500 text-center">
                                        Full text search on title, description & userName
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-fixed border-[1px] mb-auto border-slate-500 text-xs">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>Genres</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >genre</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-fixed border-[1px] mb-auto border-slate-500 text-xs">
                            <thead className="border-slate-500 border-[1px] bg-slate-600">
                                <tr className="font-semibold text-sm text-center">
                                    <td colSpan={2}>Notification</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="">
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >id</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(uuid())</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >recipient</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >content</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String</td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >type</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String<span className="text-blue-300">?</span> <span className="text-blue-500">(&quot;success&quot;, &quot;info&quot;, &quot;error&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >status</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">String <span className="text-blue-500">(&quot;read&quot; or &quot;unread&quot;)</span></td>
                                </tr>
                                <tr>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] font-light" >date</td>
                                    <td className="pl-1 pr-4 border-slate-500 border-[1px] text-red-500">DateTime</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div onClick={() => setJsonLayout(!jsonLayout)} className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>JSON Data formating</p>
                    <FaChevronRight className={jsonLayout ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${jsonLayout ? "flex" : "hidden"} flex-col gap-4 transition-all duration-200`}>
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
                    Automatic Media detection
                    <FaChevronRight className={mediaDetection ? "rotate-90" : "rotate-0"} />
                </div>
                <div className={`${mediaDetection ? "flex" : "hidden"} flex-col gap-4 transition-all duration-200 my-2`}>
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
                                            <Tree name="EP1.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="EP2.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="..." />
                                        </Tree>
                                        <Tree name="SO 2">
                                            <Tree name="EP01.mkv" style={{ color: '#37ceff' }} />
                                            <Tree name="EP02.mkv" style={{ color: '#37ceff' }} />
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
                                    Drop your files in the &quot;<span className="italic font-extralight">{!isUndefined(serverProps) && serverProps.fileStore}</span>&quot; folder accordingly with this schema.
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