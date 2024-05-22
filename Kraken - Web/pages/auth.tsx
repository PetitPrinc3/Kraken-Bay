import axios from "axios";
import Input from "@/components/Input"
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { isNull } from "lodash";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);

    if (session) {
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

const Auth = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [variant, setVariant] = useState('login')
    const router = useRouter();

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant == 'login' ? 'register' : 'login')
    }, []);

    const login = useCallback(async () => {

        const loading = toast.loading("Loging...", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })
        try {
            signIn('credentials', {
                redirect: false,
                email,
                password,
            }).then((res) => {
                if (!isNull(res?.error)) {
                    toast.update(loading, { render: res?.error ? res?.error : "Oops, something went terribly wrong...", type: "error", isLoading: false })
                }
                else {
                    toast.update(loading, { render: "Login successfull !", type: "success", isLoading: false })
                    router.push('/welcome')
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, [email, password, router])

    const register = useCallback(async () => {
        try {
            const loading = toast.loading("Creating your account...", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            axios.post('/api/register', {
                email,
                name,
                password
            }).then((res) => {
                toast.update(loading, { render: "You successfully registered. Your account will be validated by the administrators once reviewed. Thank you !", type: "success", isLoading: false })
                toggleVariant
            }).catch((err) => {
                toast.update(loading, { render: err?.response?.data?.error ? err?.response?.data?.error : "Oops, something went terribly wrong...", type: "error", isLoading: false })
                console.log(err)
            })
        } catch (error) {
            console.log(error);
        }
    }, [email, name, password, toggleVariant]);


    return (
        <div className="relative h-full w-full bg-[url('/Assets/Images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/Assets/Images/logo.png" alt="Coco" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <form onKeyDown={(e) => { if (e.key === "Enter") { variant == "login" ? login() : register() } }} action="">
                            <h2 className="text-white text-4xl mb-8 font-semibold">
                                {variant == 'login' ? 'Sign in' : 'Register'}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {variant == 'register' && (
                                    <Input
                                        label="Username"
                                        onChange={(ev: any) => setName(ev.target.value)}
                                        id="name"
                                        value={name}
                                        type="username"
                                    />
                                )}
                                <Input
                                    label="Email"
                                    onChange={(ev: any) => setEmail(ev.target.value)}
                                    id="email"
                                    type="email"
                                    value={email}
                                />
                                <Input
                                    label="Password"
                                    onChange={(ev: any) => setPassword(ev.target.value)}
                                    id="password"
                                    type="password"
                                    value={password}
                                />
                            </div>
                        </form>
                        <button onClick={variant == "login" ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                            {variant == 'login' ? 'Log in' : 'Sign up'}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant == 'login' ? 'First time using Netflix ?' : 'Already have an account ?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant == 'login' ? 'Create an account' : 'Log In'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default Auth