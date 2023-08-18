import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "~/components/Header";
import { VODTypes } from "~/enums";
import Carousel, { sliderConfig } from "~/components/Carousel";
import LoaderSpinner from "~/components/LoaderSpinner";
import Footer from "~/components/Footer";
import DetailsHero from "~/components/DetailsHero";
import {
  addToFavorites,
  fetchFavorites,
  fetchMediaDetails,
  fetchSimilarMedia,
  fetchTrailer,
  fetchUserLists,
  removeFavorite,
} from "~/services/media.service";
import { toast } from "react-hot-toast";
import { Episode, SimilarMovie, UserLists } from "~/interface";
import getThumbnail from "~/utils/getThumbnail.util";
import durationToReadable from "~/utils/durationToReadable.util";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import MediaCard from "~/components/MediaCard";
import Slider from "react-slick";
import Meta from "~/components/Meta";

export default function Watch() {
  const { query } = useRouter();
  const [loading, setLoading] = useState(true);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [similarMedia, setSimilarMedia] = useState<SimilarMovie[]>();
  const [userLists, setUserLists] = useState<UserLists>();
  const [trailer, setTrailer] = useState("");
  const [mediaDetails, setMediaDetails] = useState<any>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodeIDs, setEpisodeIDs] = useState("");

  console.log(query);
  useEffect(() => {
    // console.log(userLists?.movie_bookmarks.length);
    (async () => {
      if (!query.type && !query.uid) return;
      setLoading(true);
      await fetchMediaDetails(query.uid as string, query.type as string)
        .then((response: any) => {
          setMediaDetails(response[0] ?? response);
          getEpisodesIDs();
        })
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            console.log(error.message);
        });
      setLoading(false);

      await fetchUserLists()
        .then((response) => {
          if (response) {
            setUserLists(response);
            checkIsFavorite();
          }
        })
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            console.log(error.message);
        });

      _();

      setTimeout(() => {
        _();
      }, 2000);

      await fetchSimilarMedia(query.type as string, query.uid as string)
        .then((response) => {
          setSimilarMedia(response);
        })
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            console.log(error.message);
        });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.type, query.uid]);

  async function _() {
    await fetchTrailer(query.uid as string, "series")
      .then((response) => setTrailer(response))
      .catch(
        (error) => {
          if (error.message !== "Request failed with status code 403")
            console.log(error.message);
        }
        // query.type !== VODTypes.Series &&
        // console.log(error.message)
      );
  }

  async function checkIsFavorite() {
    await fetchFavorites()
      .then((response) => {
        let ids = [];
        for (let i = 0; i < response.length; i++) {
          const element: any = response[i];
          ids.push(element.id.toString());
        }
        setIsFavorite(ids.includes(query.uid));
      })
      .catch((error) => console.log(error.message));
  }

  const onAddToFavorite = async () => {
    await addToFavorites(query.uid as string)
      .then(() => {
        toast.success("Added to favorites");
        setIsFavorite(true);
      })
      .catch((error) => console.log(error.message));
  };

  const onRemoveFavorite = async () => {
    await removeFavorite(query.uid as string)
      .then((response) => {
        if (response.affectedRows === 1) {
          toast.success("Removed from favorites");
          setIsFavorite(false);
        }
      })
      .catch((error) => console.log(error.message));
  };

  console.log(mediaDetails?.seasons);

  if (loading)
    return (
      <>
        <Header />
        <div className="w-screen h-screen flex items-center justify-center">
          <LoaderSpinner />
        </div>
      </>
    );

  // console.log(mediaDetails[0] ?? mediaDetails);
  console.log(
    getThumbnail(
      mediaDetails?.images.PREVIEW || mediaDetails?.image_store_id || ""
    )
  );

  console.log(mediaDetails);
  console.log("seasons", mediaDetails?.seasons);

  function getEpisodesIDs() {
    let IDs: number[] = [];
    let episodes_ = mediaDetails?.seasons[selectedSeason - 1].episodes;

    if (!episodes_) return;
    for (let a = 0; a < episodes_.length; a++) {
      const element = episodes_[a];
      IDs.push(element.id);
    }

    setEpisodeIDs(IDs.toString());
  }

  return (
    <>
      <Meta
        title={mediaDetails?.title ?? "mCini TV"}
        image_alt={`${
          mediaDetails?.title ?? `Poster for ${mediaDetails?.title}`
        }`}
        description={mediaDetails?.description}
        image={getThumbnail(
          mediaDetails?.images.PREVIEW || mediaDetails?.image_store_id || ""
        )}
      />
      <AuthCheckLayout>
        <Header />
        {mediaDetails && (
          <DetailsHero
            isHomePageBanner={false}
            title={mediaDetails.title}
            year={mediaDetails.year}
            language={mediaDetails.country[1] ?? mediaDetails.country[0]}
            isWatchlisted={isWatchlisted}
            rating={mediaDetails.user_rating}
            uid={mediaDetails.uid}
            id={mediaDetails.id}
            type={query.type as string}
            duration={durationToReadable(mediaDetails.duration)}
            description={mediaDetails.description}
            onAddToFavorite={onAddToFavorite}
            onRemoveFavorite={onRemoveFavorite}
            isFavorite={isFavorite}
            isAddingToWatchlist={isAddingToWatchlist}
            poster={getThumbnail(
              mediaDetails.images.PREVIEW || mediaDetails.image_store_id || ""
            )}
            trailerURL={trailer}
          />
        )}

        <>
          {query.type === VODTypes.Series && mediaDetails?.seasons ? (
            <div className="max-w-[1500px] m-auto px-10 md:px-0">
              {/* <h2 className="mb-5 text-xl md:text-2xl font-[500]">
                {mediaDetails?.seasons.length} Season
              </h2> */}
              <ul className="mb-2 flex items-center gap-5 py-10 overflow-x-scroll">
                {mediaDetails?.seasons.map((_: any, index: number) => (
                  <li
                    key={index}
                    className={`cursor-pointer text-xl transition-all hover:opacity-80 select-none whitespace-nowrap w-max ${
                      selectedSeason === index + 1 && "text-primary"
                    }`}
                    onClick={() => setSelectedSeason(index + 1)}
                  >
                    <p>Season {index + 1}</p>
                  </li>
                ))}
              </ul>
              <Slider {...sliderConfig(7)} className="-ml-3">
                {mediaDetails?.seasons[selectedSeason - 1] &&
                  mediaDetails?.seasons[selectedSeason - 1].episodes.map(
                    (episode: Episode, index: number) => {
                      return (
                        <MediaCard
                          showTitle
                          key={index}
                          type="episode"
                          seriesID={mediaDetails.id}
                          season={selectedSeason}
                          id={episode.id}
                          uid={episode.uid}
                          poster={getThumbnail(episode.image_id)}
                          title={episode.title}
                          action="watch"
                          currentIndex={index}
                          maxIndex={index}
                          // link={`${ROUTES.watch}/episode/${episode.uid}?id=${
                          //   episode.id as number
                          // }&series=${mediaDetails.id}&title=${
                          //   episode.title
                          // }&episodes=${episodeIDs}`}
                        />
                      );
                    }
                  )}
              </Slider>
            </div>
          ) : (
            similarMedia &&
            similarMedia?.length > 0 && (
              <Carousel title="Related Videos" slides={similarMedia} />
            )
          )}
        </>
        <Footer />
      </AuthCheckLayout>
    </>
  );
}
