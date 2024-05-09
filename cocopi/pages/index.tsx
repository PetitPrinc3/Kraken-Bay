import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMoviesList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Home() {
  const { data: movies = [] } = useMovieList("Movies");
  const { data: series = [] } = useMovieList("Series");
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModal();
  return (
    <>
      <div className={`${isOpen ? "overflow-hidden" : ""}`}>
        <InfoModal visible={isOpen} onClose={closeModal} />
        <Navbar />
        <Billboard />
        <div className="pb-40">
          <MovieList title="My List" data={favorites} />
          <MovieList title="Movies" data={movies} />
          <MovieList title="Series" data={series} />
        </div>
      </div>
    </>
  );
}
