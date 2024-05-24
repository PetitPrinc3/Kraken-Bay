import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMoviesList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";
import Footer from "@/components/Footer";
import { useEffect } from "react";

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

  useEffect(() => { document.title = "Kraken Bay • Home" }, [])
  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-10">
        <MovieList title="My List" data={favorites} />
        <MovieList title="Movies" data={movies} />
        <MovieList title="Series" data={series} />
      </div>
      <Footer />
    </>
  );
}
