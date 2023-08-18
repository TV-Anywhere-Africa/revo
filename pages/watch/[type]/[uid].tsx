import { useRouter } from "next/router";
import Player from "pro-player";
import { SyntheticEvent, useEffect, useState } from "react";
import { CgPlayTrackNext } from "react-icons/cg";
import Back from "~/components/Back";
import Button from "~/components/Button";
import LoaderSpinner from "~/components/LoaderSpinner";
import Meta from "~/components/Meta";
import ROUTES from "~/constants/routes.const";
import useQueryParam from "~/hooks/useQueryParams.hook";
import { Episode, MovieDetails, SeriesDetails } from "~/interface";
import { createLog } from "~/services/auth.service";
import {
  fetchMediaDetails,
  fetchPackages,
  fetchPlayoutURL,
  updateWatchlist,
} from "~/services/media.service";
import arraysHaveCommonItems from "~/utils/arraysHaveCommonItems.util";
import getThumbnail from "~/utils/getThumbnail.util";

export default function Watch() {
  const { push } = useRouter();
  const title = useQueryParam("title");
  const { query, replace } = useRouter();
  const [loading, setLoading] = useState(true);
  const [url, setURL] = useState("");
  const [details, setDetails] = useState<MovieDetails>();
  const [lengthWatchedInMs, setLengthWatchedInMs] = useState(0);
  const [lengthWatchedInSecs, setLengthWatchedInSecs] = useState(0);
  const [percentagePlayed, setPercentagePlayed] = useState(0);
  const [seriesDetails, setSeriesDetails] = useState<SeriesDetails>();
  const [canPlayNextEpisode, setCanPlayNextEpisode] = useState(false);
  const [linkToNextEpisode, setLinkToNextEpisode] = useState("");

  // console.log(query.episodes.split(","));
  // console.log(query.id);

  useEffect(() => {
    (async () => {
      if (!query.id || !query.uid || !query.type) return;

      await fetchPackages()
        .then(async (_response) => {
          if (!_response) return;
          await fetchMediaDetails(
            query.type === "episode"
              ? (query.series as string)
              : (query.id as string),
            query.type as string
          )
            .then((response_) => {
              if (!response_) return;
              let movieDetails_ = response_[0] ?? response_;
              if (!movieDetails_) return;
              setDetails(movieDetails_);
              let hasSubsciption = arraysHaveCommonItems(
                _response.purchasedPackages,
                movieDetails_.packages
              );
              if (hasSubsciption) {
                init();
              } else {
                replace(
                  `${ROUTES.subscribe}?redirect=/watch/${query.type}/${query.uid}`
                );
              }
            })
            .catch((error) => console.log(error.message));
        })
        .catch((error) => console.log(error.message));

      if (query.series && query.type === "episode") fetchSeriesDetails();
    })();

    async function init() {
      await fetchPlayoutURL(
        query.type === "episode" ? (query.id as string) : (query.uid as string),
        query.type as string
      )
        .then((response) => response && setURL(response))
        .catch((error) => console.log(error.message));
      setLoading(false);
    }

    async function fetchSeriesDetails() {
      console.warn("is playing series");
      await fetchMediaDetails(query.series as string, query.type as string)
        .then((response: any) => setSeriesDetails(response))
        .catch((error) => {
          if (error.message !== "Request failed with status code 403")
            console.log(error.message);
        });
    }
  }, [query, replace]);

  console.log(`${percentagePlayed}% played`);

  const setProgressInMs = async (
    e: SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    let videoElement = e.target as HTMLVideoElement;
    let videoCurrentTime = Number(videoElement.currentTime);
    let duration = videoElement.duration;
    let videoLengthPlayedInMS =
      Number((videoElement.currentTime * 100).toFixed(0)) * 10;
    setLengthWatchedInMs(videoLengthPlayedInMS);
    setLengthWatchedInSecs(Number(videoCurrentTime.toFixed(0)));

    console.log(videoCurrentTime);

    let remainder = Number(videoCurrentTime.toFixed(0)) % 60;
    if (remainder === 0 || Number(videoCurrentTime.toFixed(0)) === 0) {
      await createLog({
        action: "play",
        content_uid: query.uid as string,
        content_id: query.id as string,
        content_type: query.type as string,
        content_name: query.title as string,
        duration: Number(videoCurrentTime.toFixed(0)) === 0 ? 1 : 60,
      });
    }

    let percentagePlayed_ = (videoCurrentTime / duration) * 100;
    setPercentagePlayed(Number(percentagePlayed_.toFixed(0)));
  };

  const updateWatchHistory = async (
    e: SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    await updateWatchlist(
      query.type as string,
      query.uid as string,
      lengthWatchedInMs
    )
      .then((response) => console.log(response))
      .catch((error) => console.log(error.message));
  };

  // returns the details of the next episode to be played
  function getNextEpisodeDetails() {
    let season = seriesDetails?.seasons[Number(query.season) - 1];
    if (!season?.episodes) return;
    const currentIndex = season.episodes.findIndex(
      (episode) => episode.id === Number(query.id)
    );

    if (currentIndex === -1 || currentIndex === season.episodes.length - 1)
      return null;
    return season.episodes[currentIndex + 1];
  }

  useEffect(() => {
    if (query.type === "episode" && query.season && percentagePlayed >= 95) {
      const nextEpisode: Episode | null | undefined = getNextEpisodeDetails();
      if (!nextEpisode) return;
      setCanPlayNextEpisode(true);
      setLinkToNextEpisode(
        `${ROUTES.watch}/episode/${nextEpisode.uid}?id=${
          nextEpisode.id as number
        }&series=${query.series}&title=${nextEpisode.title}&season=${
          query.season
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentagePlayed, query.type]);

  // if (details)
  return (
    <main className="overflow-hidden h-screen w-screen">
      <Meta
        title={
          details?.title ? `Watch ${details?.title} on mCinit TV` : "mCini TV"
        }
        image_alt={`${details?.title ?? `Poster for ${details?.title}`}`}
        description={details?.description}
      />
      <div className="fixed top-0 left-0 w-screen h-[60px] z-10 px-5 flex items-center justify-between">
        <Back />
        <p>{title || ""}</p>
        <div />
      </div>
      {canPlayNextEpisode && (
        <Button
          className="rounded-sm bg-white text-black absolute bottom-[80px] right-[20px] z-10 text-sm"
          onClick={() => push(linkToNextEpisode)}
        >
          Play next episode
          <CgPlayTrackNext size={27} />
        </Button>
      )}
      {details && url ? (
        <Player
          src={url}
          controls
          showBitrateSelector
          poster={getThumbnail(
            details.images.PREVIEW ?? details.image_store_id
          )}
          className="min-w-[100%] h-screen"
          onPlay={updateWatchHistory}
          // onSeeked={updateWatchHistory}
          // onEnded={onMovieEnd}
          // onEnded={onMovieEnd}
          // onPause={initUpdateWatchlist}
          // onSeek={initUpdateWatchlist}
          // onStart={initUpdateWatchlist}
          // onBufferEnd={initUpdateWatchlist}
          // onPlay={initUpdateWatchlist}
          // onProgress={setProgressInMs}
          onTimeUpdate={setProgressInMs}
        />
      ) : (
        <div className="w-screen h-[50vh] flex items-center justify-center">
          <LoaderSpinner />
        </div>
      )}
    </main>
  );
}
