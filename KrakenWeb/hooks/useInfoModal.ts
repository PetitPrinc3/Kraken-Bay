import { create } from 'zustand';

export interface ModalStoreInterface {
    mediaId?: string;
    isOpen: boolean;
    openModal: (mediaId: string) => void;
    closeModal: () => void;
}

const useInfoModal = create<ModalStoreInterface>((set) => ({
    mediaId: undefined,
    isOpen: false,
    openModal: (mediaId: string) => set({ isOpen: true, mediaId }),
    closeModal: () => set({ isOpen: false, mediaId: undefined }),
}))

export default useInfoModal