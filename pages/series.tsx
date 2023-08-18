import { useEffect, useState } from "react";
import Header from "~/components/Header";
import { setDeviceInfoCookies } from "~/services/auth.service";
import { fetchCategoriesMovies } from "~/services/media.service";
import { Movie } from "~/interface";
import { toast } from "react-hot-toast";
import getThumbnail from "~/utils/getThumbnail.util";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ROUTES from "~/constants/routes.const";
import MediaCard from "~/components/MediaCard";
import Meta from "~/components/Meta";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import cookieNames from "~/constants/cookieNames";

export default function Series() {
  const { replace } = useRouter();
  const userInfoCookie = Cookies.get(cookieNames.userInfo);
  const [categoryMovies, setCategoryMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!userInfoCookie) replace(ROUTES.index);
  }, [replace, userInfoCookie]);

  useEffect(() => {
    setDeviceInfoCookies();
    (async () => {
      await fetchCategoriesMovies()
        .then((response) => {
          console.log(response);
          if (!response) return;
          for (let a = 0; a < response.length; a++) {
            const element = response[a];
            if (element.title === "Series") setCategoryMovies(element.content);
          }
        })
        .catch((error) => {
          console.log(error);
          error.message !== "Request failed with status code 403" &&
            toast.error(error.message);
        });
    })();
  }, []);

  return (
    <AuthCheckLayout>
      <Meta title="mCini - Series" />
      <Header />
      <section className="mt-32">
        <ul className="grid grid-cols-2 md:grid-cols-7 px-5 gap-5 max-w-[1500px] m-auto">
          {categoryMovies.map((movie: Movie, index: number) => (
            <MediaCard
              key={index}
              type="series"
              id={movie.id}
              description={movie.description}
              uid={movie.uid}
              poster={getThumbnail(movie.image_id)}
              title={movie.title}
              action=""
              currentIndex={index}
              maxIndex={index}
              seriesID={movie.id}
              showAltMode
            />
          ))}
        </ul>
      </section>
    </AuthCheckLayout>
  );
}
