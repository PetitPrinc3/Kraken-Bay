import { create } from 'zustand';

export interface MobileMenuProps {
    visible?: boolean;
    selected?: string;
    select: (title?: string) => void;
}

const useMobileMenuProps = create<MobileMenuProps>((set) => ({
    selected: "Browse",
    select: (title?: string) => set({ selected: title || "Browse" }),
}))

export default useMobileMenuProps;