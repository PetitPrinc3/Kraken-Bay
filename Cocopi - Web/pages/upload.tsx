import useCurrentUser from "@/hooks/useCurrentUser"
import { isUndefined } from "lodash";


export default function Upload() {

    const { data: user } = useCurrentUser();

    if (isUndefined(user)) {
        return null;
    }

    if (user?.roles[0] != "admin") {
        return (
            <div className="flex items-center">
                <div className="flex flex-col items-center m-auto w-20 h-20 bg-zinc-600 rounded-md">
                    <p>Test</p>
                </div>
            </div>
        )
    }

    console.log(user)

    return (
        <div>

        </div>
    )
}