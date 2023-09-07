import { useEffect, useState } from "react";
import Carousel from "~/components/Carousel";
import Header from "~/components/Header";
import MediaCard from "~/components/MediaCard";
import ROUTES from "~/constants/routes.const";
import { Channel } from "~/interface";
import { fetchChannels } from "~/services/channels.service";
import getThumbnail from "~/utils/getThumbnail.util";

export default function Live(): JSX.Element {
  const [channels, setChannels] = useState<Channel[]>();

  useEffect(() => {
    (async () => {
      await fetchChannels()
        .then((response) => setChannels(response))
        .catch((error) => console.log(error));
    })();
  }, []);

  return (
    <>
      <Header />
      <section className="mt-[100px] max-w-[1500px] m-auto">
        <ul className="grid grid-cols-6 gap-5">
          {channels &&
            channels?.length > 0 &&
            channels.map((channel: Channel, index: number) => (
              <MediaCard
                link={`${ROUTES.watch}/live/${
                  channel.uid
                }?id=${channel.id.toString()}&title=${channel.name}`}
                key={index}
                type="live"
                id={channel.id}
                uid={channel.uid}
                poster={getThumbnail(channel.logos.NORMAL)}
                title={channel.name}
                action={""}
                currentIndex={0}
                maxIndex={0}
              />
            ))}
        </ul>
      </section>
    </>
  );
}
