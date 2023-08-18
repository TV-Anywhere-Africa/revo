import Head from "next/head";
import { defaultMeta } from "~/constants/data";
import { MetaProps } from "~/interface";

export default function Meta({
  title,
  image,
  description,
  domain,
  url,
  image_alt,
}: MetaProps): JSX.Element {
  return (
    <>
      <Head>
        {/* Global Metadata */}
        <meta name="robots" content="follow, index" />
        <meta name="title" content={title ?? defaultMeta.title} />
        <meta
          name="description"
          content={description ?? defaultMeta.description}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/ico" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={defaultMeta.site_name} />
        <meta property="og:url" content={url ?? defaultMeta.url} />
        <meta property="og:title" content={title ?? defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:image" content={image ?? defaultMeta.image} />
        <meta
          property="og:image:alt"
          content={image_alt ?? defaultMeta.image_alt}
        />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url ?? defaultMeta.url} />
        <meta property="twitter:title" content={title ?? defaultMeta.title} />
        <meta
          property="twitter:description"
          content={defaultMeta.description}
        />
        <meta property="twitter:image" content={image ?? defaultMeta.image} />
        <meta property="twitter:domain" content={url ?? defaultMeta.url} />
        <meta name="twitter:creator" content={defaultMeta.twitterCreator} />
        <meta
          name="twitter:image:alt"
          content={image_alt ?? defaultMeta.image_alt}
        />

        <title>{title ?? defaultMeta.title}</title>
      </Head>
    </>
  );
}
