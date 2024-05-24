import useLatest from "@/hooks/useLatest"
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";

import { useEffect } from "react";

const Latest = () => {

    const { data: latest } = useLatest();
    const { isOpen, closeModal } = useInfoModal();
    useEffect(() => { document.title = "Kraken Bay • Latest" }, [])

    return (
        <div className={`${isOpen ? "overflow-y-hidden" : ""}`}>
            <InfoModal visible={isOpen} onClose={closeModal} />
            <Navbar />
            <div className="pt-[10vh] pb-10">
                <MovieList data={latest} title="Latest Uploads" />
            </div>
            <Footer />
        </div>
    )
}

export default Latest