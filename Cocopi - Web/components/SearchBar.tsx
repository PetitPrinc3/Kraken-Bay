import { useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import SearchResult from "./SearchResult";
import useSearch from "@/hooks/useSearch";

const SearchBar = () => {
    const [searchVisible, setSearch] = useState(false)
    const [SearchText, setSearchText] = useState('')
    const searchResult = useSearch(SearchText);
    const SearchInput: any = useRef(null)

    const setVisible = () => {
        setSearch((searchVisible) => !searchVisible)
        try {
            if (SearchInput.current != null) {
                SearchInput.current.focus()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const Search = async (text: string) => {
        setSearchText(text);
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                <div className="text-gray-200 flex flex-row gap-2 items-center hover:text-gray-300 cursor-pointer">
                    <BsSearch onClick={setVisible} />
                    <div>
                        <input
                            value={SearchText}
                            onChange={e => { Search(e.currentTarget.value) }}
                            ref={SearchInput}
                            className={`rounded-md transition duration-1000 focus:outline-none ${searchVisible ? "w-[15vw] px-2 bg-zinc-900 border-2 border-zinc-400" : "w-0 px-0 border-none"}`}
                            placeholder="Search for content"
                            type="text" />
                    </div>
                </div>
            </div>
            <div className={`${searchVisible ? "" : "hidden"}`}>
                <SearchResult data={searchResult?.data} />
            </div>
        </div>
    )
}


export default SearchBar;
