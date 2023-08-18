import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ROUTES from "~/constants/routes.const";
import { MediaCardProps, MovieDetails } from "~/interface";
import Cookies from "js-cookie";
import { useStore } from "~/store";
import { motion } from "framer-motion";
// import { FaPlay } from "react-icons/fa";
import capitalizeFirstLetters from "~/utils/capitaliseFirstLetters.util";
import getThumbnail from "~/utils/getThumbnail.util";
import { fetchMediaDetails, fetchTrailer } from "~/services/media.service";
import Button from "../Button";
// import VideoPlayer from "../VideoPlayer";
import Player from "pro-player";
import useIsMobile from "~/hooks/useIsMobile.hook";
import { FiChevronRight } from "react-icons/fi";
import cookieNames from "~/constants/cookieNames";
// import Player from "pro-player-v2";

export default function MediaCard({
  type,
  action,
  id,
  uid,
  seriesID,
  description,
  poster,
  title,
  showTitle,
  maxIndex,
  showAltMode,
  currentIndex,
  watchLevel,
  link,
  season,
}: MediaCardProps): JSX.Element {
  const setCurrentlyHoveredMedia = useStore(
    (state) => state.setCurrentlyHoveredMedia
  );
  const currentlyHoveredMedia = useStore(
    (state) => state.currentlyHoveredMedia
  );
  const [targetPage, setTargetPage] = useState(link ?? "/");
  const userInfoCookie = Cookies.get(cookieNames.userInfo);

  console.log(action);
  console.log(type);
  console.log(id);
  console.log(uid);

  // console.log(type);
  // console.log(poster);
  // http://localhost:3000/watch/movie/americanboy?id=12365&title=American%20Boy%20Pt.%201
  // `${ROUTES.watch}/movie/${uid}?id=${id as string}&title=${title}`;

  useEffect(() => {
    // if (action === "watch" || altProps) {
    // if (type === "episode") {
    //   setTargetPage(
    // `${ROUTES.watch}/episode/${uid}?id=${
    //   id as string
    // }&series=${seriesID}&title=${title}`
    //   );
    // } else {
    //   setTargetPage(
    //     `${ROUTES.watch}/movie/${uid}?id=${id as string}&title=${title}`
    //   );
    //   }
    // } else
    // console.log(action === "watch" && type === "episode");
    if (link) return;
    if (action === "watch" && type === "episode") {
      setTargetPage(
        `${ROUTES.watch}/episode/${uid}?id=${
          id as string
        }&series=${seriesID}&title=${title}&season=${season}`
      );
    } else if (action === "watch" && type !== "episode") {
      setTargetPage(
        `${ROUTES.watch}/movie/${uid}?id=${id as string}&title=${title}`
      );
    } else setTargetPage(`${ROUTES.details}/${type ?? "movie"}/${id}`);
  }, [action, id, link, seriesID, title, type, uid, season]);

  console.log(targetPage);
  console.log(type);

  // const toggleShowAuthModal = () => setShowAuthModal(!showAuthModal);

  // const [showAltMediaCard, setShowAltMediaCard] = useState(false);

  // const onHover = () => {
  //   setShowAltMediaCard(!showAltMediaCard);
  // };

  // console.log(showAltMediaCard);

  const isMobile = useIsMobile();
  const [expandedSlideIndex, setExpandedSlideIndex] = useState<number | null>();
  const [details, setDetails] = useState<MovieDetails>();
  const [trailer, setTrailer] = useState("");

  const onMouseHover = async () => {
    if (!showAltMode) return;
    setCurrentlyHoveredMedia(String(uid + currentIndex));
    // showAltMode && setExpandedSlideIndex(currentIndex);
    // console.count("hover");
    await fetchMediaDetails(id, type)
      .then(async (response) => {
        setDetails(response[0]);
        let id_ = type === "movie" ? id : seriesID;
        await fetchTrailer(id_ ?? "", type === "movie" ? "movie" : "series")
          .then((response) => setTrailer(response))
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));
  };

  console.log("currentlyHoveredMedia ->", currentlyHoveredMedia);

  const onMouseLeave = () => showAltMode && setCurrentlyHoveredMedia("");

  // console.log(details);
  // console.count(`trailer->`);

  // useEffect(() => {
  //   function toggleMuteState() {
  //     const videoElement = document.getElementsByTagName("video")[0];
  //     if (videoElement) {
  //       videoElement.muted = true;
  //       videoElement.autoplay = true;
  //     }
  //   }
  //   toggleMuteState();
  //   // setTimeout(() => {
  //   //   settrue(false);
  //   // }, 1000);
  // }, []);

  console.log(watchLevel);

  return (
    <div
      className="flex overflow-visible rounded-md transition-all"
      onMouseEnter={onMouseHover}
      onMouseLeave={onMouseLeave}
    >
      {!isMobile &&
      userInfoCookie &&
      showAltMode &&
      currentlyHoveredMedia === String(uid + currentIndex) ? (
        <div
          onMouseLeave={onMouseLeave}
          className={`absolute bg-white dark:bg-[#141414] rounded-md p-2 scale-[1.2] mt-[20px] w-[350px] h-max -ml-[55px] alt-media-card z-[20] max-h-[280px] ${
            currentIndex === 0 && "ml-[60px]"
          } ${currentIndex === maxIndex && "-ml-[160px]"}`}
        >
          {trailer ? (
            <Link href={targetPage}>
              <Player
                poster={getThumbnail(poster)}
                src={trailer}
                muted
                autoPlay
                className="h-[150px] w-full bg-gray-200 dark:bg-black"
              />
            </Link>
          ) : (
            <div className="h-[150px] w-full bg-gray-200 dark:bg-black"></div>
          )}
          <div className="text-sm px-2 w-full h-full">
            <div className="flex items-center justify-between">
              <p className="font-[500] truncate">
                {capitalizeFirstLetters(title)}
              </p>
              <Link href={targetPage}>
                <Button variant="text" className="text-[10px] text-primary">
                  More info
                  <FiChevronRight className="-ml-1" />
                </Button>
              </Link>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="opacity-80 max-lines-3 leading-[17px] text-[10px]"
            >
              {details?.description}
            </motion.p>
            {/* <Link href={targetPage}>
              <div className="hover:opacity-60 transition-all w-[33px] h-[33px] p-2 pl-[10px] bg-white rounded-full flex items-center justify-center">
                <FaPlay color="black" />
              </div>
            </Link> */}
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link href={targetPage} className="cursor-pointer">
            <Image
              alt={`poster of ${title}`}
              width={100}
              height={300}
              src={poster}
              className={styles.thumbnail}
            />
          </Link>
          {showTitle && (
            <p className="mt-2 text-sm">{capitalizeFirstLetters(title)}</p>
          )}
        </motion.div>
      )}
    </div>
  );

  // return (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     className={`${styles.card} transition-all`}
  //   >
  //     <>
  //       {!userInfoCookie ? (
  //         <Image
  //           onClick={toggleShowAuthModal}
  //           alt={`poster of ${title}`}
  //           width={100}
  //           height={300}
  //           src={poster}
  //           className={styles.thumbnail}
  //         />
  //       ) : (
  //         <Link href={targetPage}>
  //           <Image
  //             alt={`poster of ${title}`}
  //             width={100}
  //             height={300}
  //             src={poster}
  //             className={styles.thumbnail}
  //           />
  //         </Link>
  //       )}
  //     </>
  //     {showTitle && <small className="mt-3 block">{title}</small>}
  //   </motion.div>
  // );
}

const styles = {
  card: "media-slider-card-content rounded-md bg-gray-100 dark:bg-gray-900 h-[320px]",
  thumbnail: "bg-no-repeat bg-center bg-cover w-max md:h-[320px] rounded-md",
};
