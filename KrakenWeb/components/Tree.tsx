import React, { memo, useRef, useEffect } from 'react'
import { FiMinusSquare, FiXSquare } from "react-icons/fi";
interface treeProps {
    name: string,
    children?: any,
    style?: any,
}

export const usePrevious = (value: any) => {
    const ref = useRef()
    useEffect(() => void (ref.current = value), [value])
    return ref.current
}

const Tree: React.FC<treeProps> = memo(function Tree({ children, name, style }) {
    const bind = useRef()
    const Icon = children ? FiMinusSquare : FiXSquare
    return (
        <div className="relative w-full h-full overflow-visible pl-4 text-ellipsis whitespace-nowrap overflow-x-hidden align-middle text-white fill-white transition-all duration-200">
            <div className='flex flex-row items-center'>
                <Icon className={`${children ? "opacity-100" : "opacity-30"} w-4 h-4 mr-4 cursor-pointer align-middle`} />
                <p className='align-middle inline-block' style={style}>{name}</p>
            </div>
            <div className={`overflow-visible transition-all duration-200 border-l-[1px] ml-[8px] ${children ? "mb-0" : "mb-0"} border-dashed border-l-gray-400`}>
                <div {...bind}>
                    {children}
                </div>
            </div>
        </div>
    )
})

export default Tree;