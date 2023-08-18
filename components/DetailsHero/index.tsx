import { FaShare } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import Back from "../Back";
import Button from "../Button";
import ShareModal from "../ShareModal";
import { useState } from "react";
import Link from "next/link";
import ROUTES from "~/constants/routes.const";
import { GoMute, GoUnmute } from "react-icons/go";
import Cookies from "js-cookie";
import { useStore } from "~/store";
import { VODTypes } from "~/enums";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import getThumbnail from "~/utils/getThumbnail.util";
import Player from "pro-player";
import cookieNames from "~/constants/cookieNames";

interface DetailsHeroProps {
  title: string;
  trailerURL?: string;
  poster: string;
  type: string;
  id: string | number;
  uid: string;
  year?: string | number;
  duration?: string | number;
  language?: string | null;
  description: string;
  rating?: string | number;
  isWatchlisted?: boolean;
  onAddToFavorite?: () => void;
  onRemoveFavorite?: () => void;
  isAddingToWatchlist?: boolean;
  isHomePageBanner: boolean;
  isFavorite?: boolean;
}

const userInfoCookie = Cookies.get(cookieNames.userInfo);

export default function DetailsHero({
  title,
  trailerURL,
  poster,
  description,
  duration,
  rating,
  language,
  uid,
  id,
  type,
  onAddToFavorite,
  onRemoveFavorite,
  isHomePageBanner,
  isFavorite,
  year,
}: DetailsHeroProps): JSX.Element {
  // const { replace } = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const toggleShowShareModal = () => setShowShareModal(!showShareModal);
  const showAuthModal = useStore((state) => state.showAuthModal);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);

  console.log(trailerURL);

  // useEffect(() => {
  //   function toggleMuteState() {
  //     const videoElement = document.getElementsByTagName("video")[0];
  //     if (videoElement) {
  //       videoElement.muted = isMute;
  //       videoElement.autoplay = true;
  //     }
  //   }
  //   toggleMuteState();
  //   // setTimeout(() => {
  //   //   setIsMute(false);
  //   // }, 1000);
  // }, [isMute]);

  const toggleShowAuthModal = () => setShowAuthModal(!showAuthModal);

  return (
    <>
      <ShareModal
        text={title}
        image={poster}
        show={showShareModal}
        onClose={toggleShowShareModal}
      />
      <section className="relative w-full text-white overflow-hidden">
        <Player
          src={trailerURL}
          poster={getThumbnail(poster)}
          muted={isMute}
          autoPlay
          className="w-screen h-screen mt-[-250px]"
        />
        <div className="max-w-[500px] md:max-w-full px-5 m-auto -mt-32">
          <div className="details-hero-gradient-overlay w-full h-full absolute top-0 left-0" />
          <div className="md:max-w-[1500px] m-auto relative mt-[-700px] lg:mt-[-650px]">
            {trailerURL && (
              <div className="absolute bottom-10 md:right-10 right-0">
                {isMute ? (
                  <GoMute
                    onClick={() => setIsMute(!isMute)}
                    className="cursor-pointer hover:text-primary transition-all"
                    size={26}
                  />
                ) : (
                  <GoUnmute
                    onClick={() => setIsMute(!isMute)}
                    className="cursor-pointer hover:text-primary transition-all"
                    size={26}
                  />
                )}
              </div>
            )}
            <div className="grid gap-7 max-w-3xl py-32">
              {!isHomePageBanner && <Back />}
              <h1
                className={`text-xl md:text-4xl font-[600] ${
                  isHomePageBanner && "mt-16"
                }`}
              >
                {title}
              </h1>
              {!isHomePageBanner && (
                <ul className="flex items-center gap-5 text-sm flex-wrap overflow-x-scroll">
                  <li className="whitespace-nowrap">
                    <p>
                      <span className="opacity-60">Release Year</span> {year}
                    </p>
                  </li>
                  {/* {type !== VODTypes.Series && (
                    <li className="whitespace-nowrap">
                      <p>
                        <span className="opacity-60">Rating</span> {rating}
                      </p>
                    </li>
                  )} */}
                  <div className="bg-gray-500 h-3 w-[1px]" />
                  {type !== VODTypes.Series && (
                    <li className="whitespace-nowrap">
                      <span className="opacity-60">{duration}</span>
                    </li>
                  )}
                  {language !== null && (
                    <>
                      {type !== VODTypes.Series && (
                        <div className="bg-gray-500 h-3 w-[1px]" />
                      )}
                      <li className="whitespace-nowrap">
                        <span className="opacity-60">{language}</span>
                      </li>
                    </>
                  )}
                </ul>
              )}
              <p className="leading-[30px] max-lines-4">{description}</p>
              {type !== VODTypes.Series && (
                <div className="flex gap-10">
                  {!userInfoCookie ? (
                    <Button
                      className="rounded-md w-max"
                      onClick={toggleShowAuthModal}
                    >
                      <IoPlay />
                      Watch Movie
                    </Button>
                  ) : (
                    <Link
                      href={`${ROUTES.watch}/movie/${uid}?id=${
                        id as string
                      }&title=${title}`}
                    >
                      <Button className="rounded-md w-max">
                        <IoPlay />
                        Watch Movie
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              {!isHomePageBanner && (
                <ul className="-ml-5 flex flex-col md:flex-row max-w-[500px]">
                  {type !== VODTypes.Series && (
                    <li>
                      <Button
                        variant="text"
                        onClick={
                          isFavorite ? onRemoveFavorite : onAddToFavorite
                        }
                      >
                        {isFavorite ? <BsFillHeartFill /> : <BsHeart />}
                        {isFavorite ? "Added to favourites" : "Favourite"}
                      </Button>
                    </li>
                  )}
                  <li>
                    <Button variant="text" onClick={toggleShowShareModal}>
                      <FaShare />
                      Share
                    </Button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
