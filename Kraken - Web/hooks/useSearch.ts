import { create } from 'zustand';

export interface SearchStoreInterface {
    searchText?: string;
    isOpen: boolean;
    origin?: string;
    openSearch: (origin?: string) => void;
    setSearch: (searchText?: string) => void;
    closeSearch: () => void;
}

const useSearch = create<SearchStoreInterface>((set) => ({
    searchText: undefined,
    isOpen: false,
    origin: undefined,
    openSearch: (origin?: string) => set({ isOpen: true, origin: origin }),
    closeSearch: () => set({ isOpen: false, origin: undefined }),
    setSearch: (searchText?: string) => set({ searchText: searchText }),
}))

export default useSearch
