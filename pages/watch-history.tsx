import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import Button from "~/components/Button";
import Header from "~/components/Header";
import LoaderSpinner from "~/components/LoaderSpinner";
import MediaCard from "~/components/MediaCard";
import Meta from "~/components/Meta";
import { MovieDetails } from "~/interface";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import {
  fetchMediaDetails,
  fetchUserLists,
  removeFromWatchlist,
} from "~/services/media.service";
import getThumbnail from "~/utils/getThumbnail.util";

export default function WatchHistory(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [watchHistory, setWatchHistory] = useState<MovieDetails[]>([]);

  console.log(watchHistory[0]);

  useEffect(() => {
    (async () => {
      await fetchLists();
    })();
  }, []);

  async function fetchLists() {
    setLoading(true);
    await fetchUserLists()
      .then(async (response) => {
        if (!response) return;
        console.log(response);
        let bookmarks = response.movie_bookmarks;
        let bookmarksIDs: number[] = [];
        for (let a = 0; a < bookmarks.length; a++) {
          const element = bookmarks[a];
          bookmarksIDs.push(element.movie_id);
        }
        if (bookmarksIDs.length < 1) return;
        await fetchMediaDetails(bookmarksIDs.toString(), "movie")
          .then((response: MovieDetails[]) => setWatchHistory(response))
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
    setLoading(false);
  }

  const removeFromWatchHistory = async (id: number) => {
    const confirmRemove = confirm(
      "Are you sure you want to remove this movie from your watch list?"
    );

    confirmRemove &&
      (await removeFromWatchlist("movie", id)
        .then(() => {
          toast.success("Removed from watchlist");
          fetchLists();
        })
        .catch((error) => toast.error(error)));
  };

  if (loading)
    return (
      <div className="w-full h-full py-44 flex items-center justify-center">
        <Header />
        <LoaderSpinner />
      </div>
    );

  return (
    <AuthCheckLayout>
      <Meta title="mCini - My Watch History" />
      <Header />
      <main className="mt-[120px] px-5 max-w-[1500px] m-auto">
        <h1 className="text-2xl font-[500] mb-5">My Watch History</h1>
        {watchHistory.length < 1 ? (
          <h3 className="text-2xl opacity-50 text-center py-32">
            You have no watch history
          </h3>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
            {watchHistory.map((item: MovieDetails, index: number) => (
              <li key={index} className="w-full">
                <MediaCard
                  type="movie"
                  id={item.id}
                  description={item.description}
                  uid={item.uid}
                  poster={getThumbnail(item.image_store_id)}
                  title={item.title}
                  action=""
                  currentIndex={index}
                  maxIndex={index}
                  watchLevel={item.duration}
                />
                <Button
                  className="w-full mt-2 text-red-300 text-sm"
                  variant="text"
                  onClick={() => removeFromWatchHistory(item.id)}
                >
                  <FiTrash className="-mt-1" />
                  Remove from list
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AuthCheckLayout>
  );
}
