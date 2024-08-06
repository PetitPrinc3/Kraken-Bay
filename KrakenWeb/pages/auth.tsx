import axios from "axios";
import Input from "@/components/Input"
import { useCallback, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { isNull } from "lodash";
import { useRouter } from "next/router";

const Auth = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [variant, setVariant] = useState('Login')
    const router = useRouter();

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant == 'Login' ? 'Register' : 'Login')
    }, []);

    useEffect(() => { document.title = `Kraken Bay • ${variant}` }, [variant])

    const Login = useCallback(async () => {
        toast.clearWaitingQueue()
        const loading = toast.loading("Loging...", {
            position: "bottom-right",
            autoClose: 1000,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
        })
        try {
            signIn('credentials', {
                redirect: false,
                callbackUrl: "/home",
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

    const Register = useCallback(async () => {
        try {
            toast.clearWaitingQueue()
            const loading = toast.loading("Creating your account...", {
                position: "bottom-center",
                autoClose: 1000,
                closeOnClick: true,
                draggable: true,
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
                        <form onKeyDown={(e) => { if (e.key === "Enter") { variant == "Login" ? Login() : Register() } }} action="">
                            <h2 className="text-white text-4xl mb-8 font-semibold">
                                {variant == 'Login' ? 'Sign in' : 'Register'}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {variant == 'Register' && (
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
                        <button onClick={variant == "Login" ? Login : Register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                            {variant == 'Login' ? 'Log in' : 'Sign up'}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant == 'Login' ? 'First time using Netflix ?' : 'Already have an account ?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant == 'Login' ? 'Create an account' : 'Log In'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                closeOnClick
                draggable
                theme="colored"
            />
        </div>
    );
}

export default Auth