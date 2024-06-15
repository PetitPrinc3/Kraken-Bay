import { AdminLayout } from "@/pages/_app";
import { FaChevronRight } from "react-icons/fa6";

export default function Help() {
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
                <div className="w-fit flex flex-row gap-4 items-center font-semibold text-white cursor-pointer py-2 px-4 rounded-lg bg-slate-600">
                    <p>Automatic Media detection</p>
                    <FaChevronRight />
                </div>
            </div>
        </AdminLayout>
    )
}