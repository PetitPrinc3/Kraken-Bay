import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import useSearch from "@/hooks/useSearch";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const SearchBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = new URLSearchParams(useSearchParams());

    const { isOpen, origin, searchText, setSearch, openSearch, closeSearch } = useSearch()
    const [reload, setReload] = useState(true)
    const searchInput: any = useRef(null)

    const search = async (text: string) => {
        setSearch(text)
        searchParams.set("q", text)
        if (searchParams.get("q") == "") {
            router.replace(origin || pathname)
        } else {
            router.replace(`search?${searchParams}`)
        }
    }

    useEffect(() => {
        if (reload) {
            setReload(false)
            searchInput.current.focus()
        }
    }, [reload, searchText, closeSearch])

    return (
        <div onBlur={closeSearch}>
            <div className="flex flex-col gap-2">
                <div className="text-gray-200 flex flex-row gap-2 items-center hover:text-gray-300 cursor-pointer">
                    <BsSearch onClick={() => { openSearch(pathname); searchInput.current.focus() }} />
                    <div>
                        <input
                            onChange={e => { search(e.currentTarget.value) }}
                            ref={searchInput}
                            defaultValue={searchText}
                            className={`rounded-md transition duration-1000 focus:outline-none hidden md:inline-block ${isOpen ? "w-[30vw] md:w-[15vw] px-2 bg-zinc-900 border-2 border-zinc-400" : "w-0 px-0 border-none"}`}
                            placeholder="Search for content"
                            type="text" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SearchBar;
