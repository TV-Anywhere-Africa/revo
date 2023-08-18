import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";

export default function FAQ(): JSX.Element {
  return (
    <>
      <Meta title="mCini - FAQ" />
      <Header />
      <main className="mt-[150px] max-w-[800px] pb-10 m-auto px-5">
        <h1 className="text-2xl font-[500] mb-10 text-primary">
          Frequently Asked Questions for mCini
        </h1>
        <ul className="gap-5 grid">
          <li className="grid gap-3 mb-5">
            <b>1.What is mCini and how does it work?</b>
            <p className="leading-[31px]">
              mCini is an online streaming platform that allows subscribers to
              watch African movies, TV shows, and more on their
              internet-connected devices. Users can sign up for a daily or
              weekly subscription and access content through the mCini app or
              website.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>2.How much does mCini cost?</b>
            <p className="leading-[31px]">
              The cost of a mCini daily subscription is 1.50 GH cedis, and the
              weekly subscription is 8.00 GH cedis.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>3.Can I download content on mCini?</b>
            <p className="leading-[31px]">
              No, you cannot download TV shows and movies on mCini. This feature
              is available on the mCini app on mobile devices and on select TV
              shows and movies.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>4.Can I share my mCini account with others?</b>
            <p className="leading-[31px]">
              Yes, you can stream on up to three (3) device at a time, per
              account.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>5.What kind of content is available on mCini?</b>
            <p className="leading-[31px]">
              mCini offers a wide range of content, including African movies
              and, TV, mCini originals, and many more.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>6.Can I watch mCini on my TV?</b>
            <p className="leading-[31px]">
              You can watch on your TV by connecting your computer to your TV
              with an HDMI cable or connecting to a Chromecast device (Google
              Chrome browser) with a Cast button or Apple TV (Safari browser)
              with the Airplay button on the player.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>7.Does mCini have commercials?</b>
            <p className="leading-[31px]">
              No, mCini does not have commercials. It is an ad-free streaming
              service.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>8.Can I cancel my mCini subscription anytime?</b>
            <p className="leading-[31px]">
              Yes, you can cancel your mCini subscription anytime. Your
              subscription will remain active until the end of your billing
              period.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>9.Can I change my mCini plan anytime?</b>
            <p className="leading-[31px]">
              Yes, you can change your mCini plan anytime by visiting your
              account settings. Your new plan will take effect at the beginning
              of your next billing cycle.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>10.Does mCini offer parental controls?</b>
            <p className="leading-[31px]">
              Yes, mCini offers parental controls that allow you to set up a PIN
              to restrict access to mature content and limit the viewing of
              certain profiles.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>11. Can I watch mCini in different languages?</b>
            <p className="leading-[31px]">
              Yes, mCini offers content in different languages and subtitles for
              many titles.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>12. Can I watch mCini in HD quality?</b>
            <p className="leading-[31px]">
              Yes, mCini offers HD streaming for select titles and devices,
              depending on your plan and internet connection.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>13. Can I watch live TV on mCini?</b>
            <p className="leading-[31px]">
              No, mCini does not offer live TV programming. It is a
              video-on-demand streaming service.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>14. How does mCini recommend content to me?</b>
            <p className="leading-[31px]">
              mCini uses algorithms and user data to recommend TV shows and
              movies based on your viewing history, preferences, and ratings.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>15. I need help! How can I contact mCini? </b>
            <p className="leading-[31px]">
              We are available 24 hours a day, seven days a week. Please use the
              chatbot or the contact details provided below to reach us. We are
              here to give you the best cinematic experience ever.
            </p>
          </li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
