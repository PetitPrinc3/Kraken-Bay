import { BsSearch } from "react-icons/bs";
import { useState, useRef } from "react";
import useSearch from "@/hooks/useSearch";

const SearchFull = () => {
    const [SearchText, setSearchText] = useState('')
    const searchResult = useSearch(SearchText);
    const SearchInput: any = useRef(null)

    const Search = async (text: string) => {
        setSearchText(text);
    }


    return (
        <div className="text-white w-full flex flex-col items-center py-[15vh]">
            <div className="flex flex-row items-center gap-4 w-[50%] bg-zinc-600 border-2 border-zinc-900 rounded-full m-2 p-2">
                <BsSearch />
                <input
                    value={SearchText}
                    onChange={e => { Search(e.currentTarget.value) }}
                    ref={SearchInput}
                    className="w-full bg-zinc-600 focus:outline-none"
                    type="text"
                    placeholder="Search Cocopi !" />
            </div>
        </div>
    )
}

export default SearchFull;