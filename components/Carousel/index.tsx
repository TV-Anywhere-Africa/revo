import { CarouselProps } from "~/interface";
import MediaCard from "../MediaCard";
import Slider from "react-slick";
import getThumbnail from "~/utils/getThumbnail.util";
import Link from "next/link";
import { FiChevronRight, FiX } from "react-icons/fi";
import Button from "../Button";

export const sliderConfig = (
  slidesToShow = 7,
  slidesToScroll = 5,
  dots = false,
  numOfSlidesOnMobile = 2
) => {
  return {
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 0,
    dots: dots,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: numOfSlidesOnMobile,
          slidesToScroll: numOfSlidesOnMobile,
        },
      },
    ],
  };
};

export default function Carousel({
  title,
  slides,
  showAltMode,
  showSeeAllButton,
  seeAllButtonLink,
  seeAllButtonLabel,
  showRemoveButton,
  onRemoveButtonClicked,
}: CarouselProps) {
  title === "Continue watching" && console.log(slides[0]);
  return (
    <div className="relative max-w-[1500px] m-auto py-10 px-5 w-[93%]">
      <div className="flex items-center justify-between">
        <h2 className="mb-5 text-xl md:text-2xl font-[500]">{title}</h2>
        {showSeeAllButton && seeAllButtonLink ? (
          <Link href={seeAllButtonLink}>
            <Button className="text-primary hover:underline" variant="text">
              <p>{seeAllButtonLabel ?? "See all"}</p>
              <FiChevronRight className="-ml-1" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <Slider className="-ml-3" {...sliderConfig(7)}>
        {slides.map((item: any, index: number) => (
          <span key={index} className="relative">
            <MediaCard
              action=""
              type={item.type}
              description={item.description}
              uid={item.uid}
              id={item.id}
              poster={getThumbnail(item.image_store_id ?? item.image_id)}
              title={item.title || ""}
              showAltMode={showAltMode}
              currentIndex={index}
              maxIndex={index}
            />
            {showRemoveButton && onRemoveButtonClicked && (
              <FiX
                onClick={() => onRemoveButtonClicked(item.id)}
                className="absolute top-1 right-1 text-white bg-[#00000078] p-1 cursor-pointer active:scale-95 transition-all hover:text-red-300"
                size={31}
              />
            )}
          </span>
        ))}
      </Slider>
    </div>
  );
}
