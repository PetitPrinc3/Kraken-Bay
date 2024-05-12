import useCurrentUser from "@/hooks/useCurrentUser";
import { isEmpty, isNull, isUndefined } from "lodash";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ImPlus } from "react-icons/im";

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

    return {
        props: {}
    }
}

const Profiles = () => {

    const router = useRouter();
    const { data: user } = useCurrentUser();

    return (
        <div className="flex items-center h-full justify-center">
            <div className="flex flex-col">
                <h1 className="text-3xl md:text-6xl text-white text-center">Who is watching ?</h1>
                <div className="flex items center justify-center gap-8 mt-10">
                    <div onClick={() => { router.push('/home') }}>
                        <div className="group flex-row w-44 mx-auto">
                            <div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
                                <img src={`${!user?.image ? "/Assets/Images/default_profile.png" : user?.image}`} alt="Profile" />
                            </div>
                            <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">{user?.name}</div>
                        </div>
                    </div>
                    <div onClick={() => { router.push('/home') }}>
                        <div className="group flex-row h-44 w-44">
                            <div className="rounded-md group-hover:bg-white">
                                <div className="w-44 h-44 rounded-full flex items-center justify-center cursor-pointer">
                                    <div className="flex items-center p-10 text-zinc-800 bg-zinc-400 rounded-full group-hover:text-white">
                                        <ImPlus className="m-auto" size={60} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">Add Profile</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profiles;