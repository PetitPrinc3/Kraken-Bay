import useLatest from "@/hooks/useLatest"
import MovieList from "@/components/MovieList";
import Navbar from "@/components/Navbar";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";

const Latest = () => {

    const { data: latest } = useLatest();
    const { isOpen, closeModal } = useInfoModal();

    return (
        <div className={`${isOpen ? "overflow-y-hidden" : ""}`}>
            <InfoModal visible={isOpen} onClose={closeModal} />
            <Navbar />
            <div className="pt-[10vh]">
                <MovieList data={latest} title="Latest Uploads" />
            </div>
        </div>
    )
}

export default Latest