import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import { useEffect } from "react";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";
import Footer from "@/components/Footer";
import useMedia from "@/hooks/useMedia";
import Billboard from "@/components/Billboard";

const Series = () => {
    const { isOpen, closeModal } = useInfoModal();
    const { data: media } = useMedia({ mediaType: "Series" })

    useEffect(() => { document.title = "Kraken Bay • Series" }, [])

    return (
        <div>
            <Navbar />
            <Billboard mediaType="Series" />
            <InfoModal visible={isOpen} onClose={closeModal} />
            <div className="mb-10">
                <MovieList data={media} title="TV Shows" />
            </div>
            <Footer />
        </div >
    )
}
export default Series;