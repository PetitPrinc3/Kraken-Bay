import { create } from 'zustand';

export interface ModalStoreInterface {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const useGenreModal = create<ModalStoreInterface>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}))

export default useGenreModal