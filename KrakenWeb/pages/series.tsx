import Navbar from "@/components/Navbar";
import MovieList from "@/components/MovieList";
import { useEffect } from "react";
import useInfoModal from "@/hooks/useInfoModal";
import InfoModal from "@/components/InfoModal";
import Footer from "@/components/Footer";
import useMedia from "@/hooks/useMedia";
import Billboard from "@/components/Billboard";
import useGenresList from "@/hooks/useGenresList";
import { isUndefined, isEmpty, isNull } from "lodash";

const Series = () => {
    const { isOpen, closeModal } = useInfoModal();
    const { data: genres } = useGenresList();

    useEffect(() => {
        if (!isUndefined(genres)) {
            while (genres.length > 5) {
                genres.splice(Math.floor(Math.random() * genres.length), 1)

            }
        }
    })

    const { data: genre1 } = useMedia({ mediaType: "Series", mediaGenres: !isUndefined(genres) && genres.length > 0 ? genres[0].genre : undefined, mediaLimit: 4 })
    const { data: genre2 } = useMedia({ mediaType: "Series", mediaGenres: !isUndefined(genres) && genres.length > 1 ? genres[1].genre : undefined, mediaLimit: 4 })
    const { data: genre3 } = useMedia({ mediaType: "Series", mediaGenres: !isUndefined(genres) && genres.length > 2 ? genres[2].genre : undefined, mediaLimit: 4 })
    const { data: media } = useMedia({ mediaType: "Series" })

    useEffect(() => { document.title = "Kraken Bay • TV Shows" }, [])

    return (
        <div>
            <Navbar />
            <Billboard mediaType="Series" />
            <InfoModal visible={isOpen} onClose={closeModal} />
            <div className="mb-10">
                {(!isUndefined(genres) && !isEmpty(genre1) && (!isUndefined(genre1) && !isNull(genre1[0])) && genres.length > 0) && <MovieList data={genre1} title={!isUndefined(genres) ? genres[0].genre : ""} />}
                {(!isUndefined(genres) && !isEmpty(genre2) && (!isUndefined(genre2) && !isNull(genre2[0])) && genres.length > 1) && <MovieList data={genre2} title={!isUndefined(genres) ? genres[1].genre : ""} />}
                {(!isUndefined(genres) && !isEmpty(genre3) && (!isUndefined(genre3) && !isNull(genre3[0])) && genres.length > 2) && <MovieList data={genre3} title={!isUndefined(genres) ? genres[2].genre : ""} />}
                <MovieList data={media} title="TV Shows" />
            </div>
            <Footer />
        </div >
    )
}
export default Series;