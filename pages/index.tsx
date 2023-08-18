import { useEffect } from "react";
import Carousel from "~/components/Carousel";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { Category } from "~/interface";
import DetailsHero from "~/components/DetailsHero";
import { anon_categories } from "~/constants/data";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import ROUTES from "~/constants/routes.const";
import cookieNames from "~/constants/cookieNames";

const userInfoCookie = Cookies.get(cookieNames.userInfo);

export default function Home() {
  const { replace } = useRouter();

  useEffect(() => {
    if (userInfoCookie) replace(ROUTES.home);
  }, [replace]);

  return (
    <>
      <Header />
      <DetailsHero
        isHomePageBanner
        title="Omoge"
        uid="omoge"
        id="12783"
        type="movie"
        description="Tasha was getting married to jerry, but she has some dirty past with George. Jerry is the elder brother to George and treats him with love and care. Tasha was a ruins girl and had a one night stand with George some years back, but he threaten to expose her."
        poster=""
        trailerURL="https://res.cloudinary.com/dbfynjh2f/video/upload/v1689333562/OMOGE_TRAILER_gjpmd9.mp4"
      />
      <section className="pt-10">
        {anon_categories.map((category: Category, index: number) => (
          <Carousel
            key={index}
            title={category.title}
            slides={category.content}
          />
        ))}
      </section>
      <Footer />
    </>
  );
}
