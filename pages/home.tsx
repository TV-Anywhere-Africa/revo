import { useEffect, useState } from "react";
import Carousel from "~/components/Carousel";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { setDeviceInfoCookies } from "~/services/auth.service";
import {
  fetchBanners,
  fetchCategoriesMovies,
  fetchMediaDetails,
  fetchTrailer,
  fetchUserLists,
  removeFromWatchlist,
} from "~/services/media.service";
import {
  Banner,
  Category,
  Movie,
  MovieDetails,
  SelectedBanner,
} from "~/interface";
import { toast } from "react-hot-toast";
import getThumbnail from "~/utils/getThumbnail.util";
import DetailsHero from "~/components/DetailsHero";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ROUTES from "~/constants/routes.const";
import Meta from "~/components/Meta";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import cookieNames from "~/constants/cookieNames";

export default function Home() {
  const { replace } = useRouter();
  const [isMute, setIsMute] = useState(false);
  const userInfoCookie = Cookies.get(cookieNames.userInfo);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerTrailer, setBannerTrailer] = useState("");
  const [selectedbanner, setSelectedBanner] = useState<SelectedBanner>();
  const [watchHistory, setWatchHistory] = useState<MovieDetails[]>([]);
  const [categoryMovies, setCategoryMovies] = useState<
    { title: string; content: Movie[] }[]
  >([]);

  console.log(userInfoCookie);

  useEffect(() => {
    if (!userInfoCookie) replace(ROUTES.index);
  }, [replace, userInfoCookie]);

  useEffect(() => {
    setDeviceInfoCookies();
    (async () => {
      await fetchBanners()
        .then((response: Banner[]) => setBanners(response))
        .catch(
          (error) =>
            error.message !== "Request failed with status code 403" &&
            error.message !== "Request failed with status code 401" &&
            toast.error(error.message)
        );
      await fetchCategoriesMovies()
        .then((response) => setCategoryMovies(response ?? []))
        .catch(
          (error) =>
            error.message !== "Request failed with status code 403" &&
            error.message !== "Request failed with status code 401" &&
            toast.error(error.message)
        );
    })();
  }, []);

  const randomBannerIndex: number = Math.floor(Math.random() * banners.length);

  useEffect(() => {
    (async () => {
      if (!banners) return;
      let banner = banners[randomBannerIndex];

      console.log(randomBannerIndex);
      console.log(banner);

      if (!banner) return;

      let image = getThumbnail(
        selectedbanner?.preview_image_id ??
          selectedbanner?.banner_image_id ??
          ""
      );

      if (image) {
        setSelectedBanner({
          ...banner,
          image,
        });
      }

      await fetchTrailer(banner.content_id, "movie")
        .then((response) => setBannerTrailer(response))
        .catch(
          (error) =>
            error.message !== "Request failed with status code 403" &&
            error.message !== "Request failed with status code 401" &&
            toast.error(error.message)
        );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banners]);

  useEffect(() => {
    (async () => fetchWatchHistoryList())();
  }, []);

  async function fetchWatchHistoryList() {
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
  }

  console.log(categoryMovies);
  console.log(selectedbanner);
  console.log(banners);
  console.log(bannerTrailer);

  const removeFromWatchHistory = async (id: number) => {
    const confirmRemove = confirm(
      "Are you sure you want to remove this movie from your watch list?"
    );

    confirmRemove &&
      (await removeFromWatchlist("movie", id)
        .then(() => {
          toast.success("Removed from watchlist");
          fetchWatchHistoryList();
        })
        .catch((error) => toast.error(error)));
  };

  return (
    <AuthCheckLayout>
      <Meta />
      <Header />
      {selectedbanner && bannerTrailer && (
        <DetailsHero
          isHomePageBanner
          title={selectedbanner.title}
          uid={selectedbanner.uid}
          id={selectedbanner.content_id}
          type={selectedbanner.type as string}
          description={selectedbanner.description}
          poster={selectedbanner.image}
          trailerURL={bannerTrailer}
        />
      )}
      <section className="pt-10">
        {watchHistory.length > 0 && (
          <Carousel
            showSeeAllButton
            seeAllButtonLink={ROUTES.watchHistory}
            title="Continue watching"
            slides={watchHistory}
            showRemoveButton
            onRemoveButtonClicked={(id: number) => removeFromWatchHistory(id)}
          />
        )}
        {categoryMovies.map((category: Category, index: number) => (
          <Carousel
            key={index}
            title={category.title}
            slides={category.content}
            showAltMode
          />
        ))}
      </section>
      <Footer />
    </AuthCheckLayout>
  );
}
