import { useState, useEffect } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";

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

    return {
        props: {},
    };
}

const Tutorial = () => {
    const [activeImage, setActiveImage] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const [version, setVersion] = useState("")
    const [dragX, setDragX] = useState(0)
    const [dragY, setDragY] = useState(0)
    const slides = version === "windows" ? [{
        src: "Assets/Images/Tutorial/Step1PC.png",
        title: "Step 1 : Open your file explorer",
        desc: <p>Open windows file explorer pressing &quot;WIN&quot;+&quot;E&quot;</p>
    },
    {
        src: "Assets/Images/Tutorial/Step2PC.png",
        title: "Step 2 : Join SMB Share",
        desc: <p>In the navigation bar, type &quot;\\kraken.local&quot; and hit enter. <br /><br /> You may be prompted for credentials. If so, use the following : <br />  • Username : <span className="text-red-500 underline">kraken</span> <br /> • Password : <span className="text-red-500 underline">kraken</span> </p>
    },
    {
        src: "Assets/Images/Tutorial/Step3PC.png",
        title: "Step 3 : Discover and enjoy !",
        desc: <p>You should now have reached the two available shares : Movies & TV Shows. <br /> You can now find all of the available media and watch them as you please with full languages and subtitles support. <br /><br />We recommend using <a href="/Assets/VLC/vlc.exe" className="text-red-500 underline">VLC Media Player</a>.</p>
    }] : [{
        src: "Assets/Images/Tutorial/Step1Mobile.png",
        title: "Step 1 : Open VLC",
        desc: <p>Install and open the <a href="/Assets/VLC/vlc.apk" className="text-red-500 underline">VLC Media Player</a> apk.<br /><br /><span className="text-xs font-light">If you are using an Iphone, download the VLC app from the AppStore and tag along.</span></p>
    },
    {
        src: "Assets/Images/Tutorial/Step2Mobile.png",
        title: "Step 2 : Join SMB Share",
        desc: <p>In the browse section, look under &quot;Local Network&quot; for the KRAKEN share. <br /><br /> You may be prompted for credentials. If so, use the following : <br />  • Username : <span className="text-red-500 underline">kraken</span> <br /> • Password : <span className="text-red-500 underline">kraken</span><br /><br /><span className="text-xs font-light underline">No visible share ?</span><span className="text-xs font-light"> : Make sure you are connected to the Kraken Bay wifi only and your GSM data is turned off. Give it a minute and you should be good to go !</span></p>
    },
    {
        src: "Assets/Images/Tutorial/Step3Mobile.png",
        title: "Step 3 : Enjoy !",
        desc: <p>You should now have reached the two available shares. <br /> You can find all of the available media here and watch them as you please with full format support.</p>
    }]


    const clickNext = () => {
        activeImage === slides.length - 1
            ? setActiveImage(0)
            : setActiveImage(activeImage + 1);
    };
    const clickPrev = () => {
        activeImage === 0
            ? setActiveImage(slides.length - 1)
            : setActiveImage(activeImage - 1);
    };

    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false)
            console.log(window.screen.width)
            if (window.screen.width < 800) {
                setVersion("mobile")
            }
            else {
                setVersion("windows")
            }
        }
    }, [firstLoad, version])

    const handleDrag = (endX: number, endY: number) => {
        const deltaX = endX - dragX
        const deltaY = endY - dragY

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                clickNext()
            } else {
                clickPrev()
            }
        }
        setDragX(0)
        setDragY(0)
    }

    return (
        <div className="w-[100vw] h-[100vh] overflow-hidden flex flex-col items-center">
            <div className="text-white text-3xl mt-8 flex flex-col gap-4 md:flex-row items-center w-full px-20 justify-between">
                <img src="/Assets/Images/logo.png" alt="" className="block max-w-40 max-h-14" />
                <p className="hidden md:block font-semibold">Get started <span className="hidden lg:inline-block">with Kraken</span> !</p>
                <div className="w-40 flex flex-row items-center gap-2">
                    <select className="w-full md:w-40 h-8 bg-neutral-700 rounded-md px-4 border-2 border-neutral-800 text-xs md:text-sm focus:outline-none" onChange={(e) => setVersion(e.currentTarget.value)} value={version} name="" id="">
                        <option value="windows">Windows</option>
                        <option value="mobile">Mobile</option>
                    </select>
                </div>
            </div>
            <div className="w-full h-full flex items-center">
                <div className="relative w-[95vw] md:w-[75vw] h-[70vh] md:h-[75vh] rounded-3xl mx-auto overflow-hidden shadow-2xl md:shadow-neutral-400">
                    <div className="h-full min-w-fit flex items-center">
                        {slides.map((data) => (
                            <div onTouchStart={(e) => { setDragX(e.changedTouches[0].clientX); setDragY(e.changedTouches[0].clientY) }} onTouchEnd={(e) => handleDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY)} key={data.title} className="relative w-[95vw] md:w-[75vw] cursor-default h-full grid grid-rows-[60%_40%] md:grid-cols-2 rounded-3xl transition-all duration-500 ease-in-out overflow-hidden" style={{ transform: `translateX(${(-(activeImage) * 100)}%` }}>
                                <div className="flex w-full h-full overflow-hidden md:h-[75vh] items-center bg-zinc-800">
                                    <img
                                        src={data.src}
                                        alt=""
                                        className="h-full object-cover md:object-contain mx-auto md:p-4"
                                    />
                                </div>
                                <div className="bg-black h-full md:h-[75vh] w-full overflow-y-scroll md:overflow-hidden flex flex-col gap-2 md:gap-8 md:rounded-r-3xl text-white px-6 md:px-10 py-4 md:py-8">
                                    <p className="font-semibold underline text-2xl text-red-500">{data.title}</p>
                                    {data.desc}
                                </div>

                            </div>
                        ))}
                    </div>
                    <div onClick={clickPrev} className="hidden md:flex absolute h-full w-[10%] left-0 top-0 opacity-0 hover:opacity-100 transition-all duration-200 items-center cursor-pointer text-white rounded-3xl">
                        <FaChevronLeft size={30} className="ml-4 mr-auto" />
                    </div>
                    <div onClick={clickNext} className="hidden md:flex absolute h-full w-[10%] right-0 top-0 opacity-0 hover:opacity-100 transition-all duration-200 items-center cursor-pointer text-white rounded-3xl">
                        <FaChevronRight size={30} className="mr-4 ml-auto" />
                    </div>
                    <div className="hidden md:block absolute bottom-4 left-0 right-0">
                        <div className="flex items-center justify-center gap-2">
                            {slides.map((_, idx) => (
                                <div key={idx} className={`transition-all w-2 h-2 bg-white rounded-full ${activeImage == idx ? "p-2" : "bg-opacity-50"}`}>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute md:hidden bottom-2 left-0 right-0">
                    <div className="flex items-center justify-center gap-2">
                        {slides.map((_, idx) => (
                            <div key={idx} className={`transition-all w-2 h-2 bg-white rounded-full ${activeImage == idx ? "p-2" : "bg-opacity-50"}`}>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutorial;