import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import useMedia from "@/hooks/useMedia";
import { isEmpty } from "lodash";

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
  const { data: movies = [] } = useMedia({ mediaType: "Movies", mediaLimit: "8" });
  const { data: series = [] } = useMedia({ mediaType: "Series", mediaLimit: "8" });
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModal();

  useEffect(() => { document.title = "Kraken Bay • Home" }, [])
  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-10">
        {!isEmpty(favorites) && <MovieList title="My List" data={favorites} />}
        <MovieList title="Movies" data={movies} />
        <MovieList title="Series" data={series} />
      </div>
      <Footer />
    </>
  );
}
