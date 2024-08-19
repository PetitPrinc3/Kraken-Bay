import React, { useState } from "react";

interface SwitchProps {
    state?: boolean
    disabled?: boolean
    onChange?: () => void
}


const Switch: React.FC<SwitchProps> = ({ state = false, disabled = false, onChange = () => { } }) => {

    const [isOn, toggle] = useState(state)

    return (
        <div className="w-full h-full md:py-1">
            <div onClick={() => { if (!disabled) { toggle(!isOn); onChange() } }} className="relative w-full grid grid-cols-2 items-cente mx-auto text-slate-800 font-light text-xs text-center">
                <div className={`w-full relative flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} p-0.5 py-1 mx-auto justify-center rounded-full z-30 ${!isOn ? "font-semibold" : "text-slate-500"} transition-all duration-200`}>
                    Off
                </div>
                <div className={`w-full relative flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"} pr-0.5 py-1 mx-auto justify-center rounded-full z-30 ${isOn ? "font-semibold" : "text-slate-500"} transition-all duration-200`}>
                    On
                </div>
                <div className={`absolute top-0 bottom-0 left-0 right-0 rounded-full ${disabled ? "bg-slate-400" : isOn ? "bg-green-400" : "bg-red-400"}`} />
                <div className={`absolute w-1/2 top-0 bottom-0 py-0.5 transition-all duration-500 rounded-lg overflow-hidden ${isOn ? "left-1/2 pr-0.5" : "left-0 pl-0.5"}`}>
                    <div className={`w-full h-full ${disabled ? "bg-slate-500" : isOn ? "bg-green-500" : "bg-red-500"} shadow-xl rounded-full`}></div>
                </div>
            </div>
        </div>
    )
}

export default Switch;