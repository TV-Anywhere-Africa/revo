import { useEffect, useState } from "react";
import Header from "~/components/Header";
import LoaderSpinner from "~/components/LoaderSpinner";
import MediaCard from "~/components/MediaCard";
import Meta from "~/components/Meta";
import useQueryParam from "~/hooks/useQueryParams.hook";
import { SearchMovie } from "~/interface";
import AuthCheckLayout from "~/layouts/authCheck.layout";
import { createLog } from "~/services/auth.service";
import { searchForMedia } from "~/services/media.service";
import getThumbnail from "~/utils/getThumbnail.util";

export default function Search(): JSX.Element {
  const queryQueryParam = useQueryParam("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchMovie[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearchQuery(queryQueryParam as string);
  }, [queryQueryParam]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("query", searchQuery);
    window.history.replaceState(null, "", url.toString());
  }, [searchQuery]);

  const handleSearchQueryChange = async (e: any) => {
    setSearchQuery(e.target.value);
    setSearching(true);
    await searchForMedia(searchQuery)
      .then(async (response) => {
        setSearchResults(response ?? []);
        await createLog({ action: "search", content_name: e.target.value });
      })
      .catch((error) => console.log(error.message));
    setSearching(false);
    // if (searchQuery.length === 0) window.history.back();
  };

  return (
    <>
      <Meta
        title={`Search - ${searchQuery === "undefined" ? "" : searchQuery}`}
      />
      <AuthCheckLayout>
        <Header
          searchQuery={searchQuery}
          isSearching
          handleSearchQueryChange={handleSearchQueryChange}
        />
        <main className="mt-[100px] max-w-[1500px] m-auto py-5 px-5">
          {!searching ? (
            <>
              <h3 className="text-xl mb-10">
                {searchResults.length} results found for &apos;{searchQuery}
                &apos;
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
                {searchResults.map((result: SearchMovie, index: number) => (
                  <li key={index} className="w-full">
                    <MediaCard
                      type="movie"
                      id={result.id}
                      uid={result.uid}
                      poster={getThumbnail(result.image_id)}
                      title={result.title}
                      action=""
                      currentIndex={index}
                      maxIndex={index}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="w-full h-[50vh] flex items-center justify-center">
              <LoaderSpinner />
            </div>
          )}
        </main>
      </AuthCheckLayout>
    </>
  );
}
