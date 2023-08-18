import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import LoaderSpinner from "~/components/LoaderSpinner";
import MediaCard from "~/components/MediaCard";
import Meta from "~/components/Meta";
import { Genre, Movie } from "~/interface";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import { fetchCategoriesMovies, fetchGenres } from "~/services/media.service";
import getThumbnail from "~/utils/getThumbnail.util";

export default function GenrePage(): JSX.Element {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresResult, setGenresResult] = useState<{
    genresIDs: number[];
    genresIDsString: string;
    genres: Genre[];
  }>();
  const [selectedGenre, setSelectedGenre] = useState<number | string>();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>();
  const [genrecategoryMovies, setGenreCategoryMovies] = useState<
    { title: string; content: Movie[] }[]
  >([]);

  useEffect(() => {
    (async () => {
      await fetchGenres()
        .then((response) => {
          if (!response) return;
          setGenres(response.genres);
          setGenresResult(response);
          setSelectedGenre(9999);
        })
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            toast.error(error.message);
        });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedGenre || !genresResult) return;

      let query_ =
        selectedGenre !== 9999
          ? `genres=${selectedGenre?.toString()}`
          : undefined;

      console.log(query_);
      console.log(selectedGenre);

      setLoading(true);
      await fetchCategoriesMovies(query_)
        .then((response) => {
          if (!response) return;
          const flattenedArray = response.flatMap((obj) => obj.content);
          console.log(flattenedArray);
          setMovies(flattenedArray);
        })
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            toast.error(error.message);
        });

      setLoading(false);
    })();
  }, [genresResult, selectedGenre]);

  console.log(genrecategoryMovies);

  return (
    <AuthCheckLayout>
      <Meta title="mCini - Genres" />
      <Header />
      <main className="mt-[100px]">
        <ul className="flex items-center gap-3 overflow-x-scroll max-w-[1500px] m-auto py-3 pr-[100px]">
          <Button
            onClick={() => setSelectedGenre(9999)}
            className={`bg-gray-800 rounded-sm ${
              selectedGenre === 9999 && "bg-primary"
            }`}
          >
            All
          </Button>
          {genres.map((genre: Genre, index: number) => (
            <Button
              onClick={() => setSelectedGenre(genre.id)}
              className={`bg-gray-800 rounded-sm ${
                selectedGenre === genre.id && "bg-primary text-white"
              }`}
              key={index}
            >
              {genre.name}
            </Button>
          ))}
        </ul>
      </main>
      <section className="pt-10">
        {loading ? (
          <div className="w-full py-32 flex items-center justify-center">
            <LoaderSpinner />
          </div>
        ) : (
          <ul className="max-w-[1500px] m-auto grid grid-cols-6 gap-10">
            {movies &&
              movies.map((movie: Movie, index: number) => (
                <MediaCard
                  key={index}
                  // action={item.action}
                  action="any"
                  type={movie.type}
                  id={movie.id}
                  uid={movie.uid}
                  poster={getThumbnail(movie.image_id)}
                  title={movie.title || ""}
                  currentIndex={index}
                  maxIndex={index}
                  showAltMode
                />
              ))}
          </ul>
        )}
        <></>
        {movies && movies.length <= 1 && (
          <h2 className="text-2xl text-center py-10 text-gray-500">
            No movies in selected genre
          </h2>
        )}
      </section>
      <Footer />
    </AuthCheckLayout>
  );
}
