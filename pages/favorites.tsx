import { useEffect, useState } from "react";
import Header from "~/components/Header";
import LoaderSpinner from "~/components/LoaderSpinner";
import MediaCard from "~/components/MediaCard";
import Meta from "~/components/Meta";
import { MovieDetails } from "~/interface";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import {
  fetchFavorites,
  fetchMediaDetails,
  fetchUserLists,
} from "~/services/media.service";
import getThumbnail from "~/utils/getThumbnail.util";

export default function Favorites(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<MovieDetails[]>([]);

  console.log(favorites[0]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchFavorites()
        .then((response) => {
          setFavorites(response);
        })
        .catch((error) => console.log(error.message));
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full py-44 flex items-center justify-center">
        <Header />
        <LoaderSpinner />
      </div>
    );

  return (
    <AuthCheckLayout>
      <Meta title="mCini - My Favorites" />
      <Header />
      <main className="mt-[120px] px-5 max-w-[1500px] m-auto">
        <h1 className="text-2xl font-[500] mb-5">My Favorites</h1>
        {favorites.length < 1 ? (
          <h3 className="text-2xl opacity-50 text-center py-32">
            You have no favorites
          </h3>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
            {favorites.map((result: MovieDetails, index: number) => (
              <li key={index} className="w-full">
                <MediaCard
                  type="movie"
                  id={result.id}
                  description={result.description}
                  uid={result.uid}
                  poster={getThumbnail(result.image_store_id)}
                  title={result.title}
                  action=""
                  currentIndex={index}
                  maxIndex={index}
                  watchLevel={result.duration}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </AuthCheckLayout>
  );
}
