import axios from "axios";
import { mediaBaseURL, operatorUID } from "~/api.config";
import {
  Banner,
  Category,
  CategoryInfo,
  Genre,
  SimilarMovie,
  User,
  UserLists,
} from "~/interface";
import { getUserInfoCookie, refreshToken } from "./auth.service";
import { getObjectKeyByValue } from "~/utils/getObjectKeyByValue.util";

const userInfoToken: User = getUserInfoCookie();

/**
 * Fetches all the packages including purchased packages for a user
 * @returns `packages` `packageIds` `packageIdsString` `purchasedPackages` as an object
 */
export async function fetchPackages(): Promise<
  | {
      packages: string[];
      packageIds: string[];
      packageIdsString: string;
      purchasedPackages: string[];
    }
  | undefined
> {
  try {
    let packageIds: string[] = [];
    let purchasedPackages: string[] = [];
    let packageIdsString = "";

    const packages = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/packages?device_class=desktop`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    console.log(packages);

    if (packages.data.status === "ok") {
      [...packages.data.data].forEach((item) => packageIds.push(item.id));
      packageIdsString = packageIds.join(",");
    }

    for (let a = 0; a < packages.data.data.length; a++) {
      const element = packages.data.data[a];
      if (element.purchased) purchasedPackages.push(element.id);
    }

    return {
      packages: packages.data.data,
      packageIds,
      packageIdsString,
      purchasedPackages,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await refreshToken();
    } else throw Error(error.message);
  }
}

/**
 * Fetches all the categories
 * @returns `categories` `categoryIds` `categoriesIdsString` as an object
 */
export async function fetchCategories(): Promise<
  | {
      categories: CategoryInfo[];
      categoryIds: string[];
      categoriesIdsString: string;
    }
  | undefined
> {
  try {
    let userPackages = await fetchPackages();
    let categoryIds: string[] = [];
    let categoriesIdsString = "";

    console.log(userPackages);
    const categories = await axios.get(
      `${mediaBaseURL}/api/client/v3/${operatorUID}/categories/vod?packages=${userPackages?.packageIdsString}`,
      // `${mediaBaseURL}/api/client/v3/${operatorUID}/categories/vod?packages=${userPackages?.packageIdsString}`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    console.log(categories);
    categoryIds = categories.data.data.map((item: any) => {
      return item.id;
    });

    categoriesIdsString = categoryIds.join(",");

    console.log(categoryIds);

    return {
      categories: categories.data.data as CategoryInfo[],
      categoryIds,
      categoriesIdsString,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

/**
 * Fetches all the categories with their titles and movies
 * @returns Categories array with movies
 */
export async function fetchCategoriesMovies(
  query?: string
): Promise<Category[] | undefined> {
  const userCategories = await fetchCategories();
  const userPackages = await fetchPackages();
  const categoryNamesAndId: any = {};
  const movieCategories = [];
  console.log(userCategories);
  console.log(userPackages);

  userCategories?.categories.map((item: any) => {
    return (categoryNamesAndId[item.name] = item.id);
  });

  console.log(userCategories?.categoriesIdsString);

  try {
    if (!userCategories?.categoriesIdsString) return;

    const categoriesMovies_ = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/categories/vod/content?packages=${userPackages?.packageIds}&categories=${userCategories.categoriesIdsString}`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    console.log("categoriesMovies", categoriesMovies_.data.data);

    console.log(categoriesMovies_.data);

    for (let a = 0; a < categoriesMovies_.data.data.length; a++) {
      const element = categoriesMovies_.data.data[a];

      console.log(element);

      const category: Category = {
        title: "",
        id: "",
        content: [],
      };

      console.log(categoryNamesAndId);
      category.title =
        getObjectKeyByValue(categoryNamesAndId, element.id) || "";
      category.content = element.content;
      category.id = element.id;
      movieCategories.push(category);
    }

    console.log(movieCategories);

    const orderArray = userCategories.categoriesIdsString.split(",");

    movieCategories.sort((a: any, b: any) => {
      const aIndex = orderArray.indexOf(a.id.toString());
      const bIndex = orderArray.indexOf(b.id.toString());
      return aIndex - bIndex;
    });

    return movieCategories;
  } catch (error: any) {
    console.log(error);
    if (error.response.status === 401) {
      await refreshToken();
    } else
      throw Error(
        (error.response.data && error.response.data.data.message) ??
          error.message
      );
  }
}

/**
 * Fetches media details
 */
export async function fetchMediaDetails(id: number | string, type: string) {
  console.log(id, type);
  try {
    let movieURL = `${mediaBaseURL}/api/client/v2/${operatorUID}/movies?movies=${id}`;
    let seriesURL = `${mediaBaseURL}/api/client/v1/${operatorUID}/series/${id}`;
    let url = type === "movie" ? movieURL : seriesURL;

    const mediaDetails = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userInfoToken.access_token}`,
      },
    });
    console.log(mediaDetails.data.data);
    if (mediaDetails.data.status !== "ok")
      throw Error("An error occured fetching");
    return mediaDetails.data.data;
  } catch (error: any) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      await refreshToken();
    } else throw Error(error.message);
    // throw Error(
    //   (error.response &&
    //     error.response.data &&
    //     error.response.data.data &&
    //     error.response.data.data.message) ??
    //     error.message
    // );
  }
}

/**
 * Fetch user watchlist
 */
export async function fetchUserLists(): Promise<UserLists | undefined> {
  try {
    const watchlist = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/my_content`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    console.log(watchlist.data.data);
    return watchlist.data.data as UserLists;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      await refreshToken();
    } else throw Error(error.message);
  }
}

export async function fetchSimilarMedia(
  type: string,
  id: string
): Promise<SimilarMovie[]> {
  try {
    const similarMedia = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/vod/${type}/${id}/related`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return similarMedia.data.data as SimilarMovie[];
  } catch (error: any) {
    throw Error(error.message);
  }
}

/**
 * Fetch a movie/series trailer from ID
 */
export async function fetchTrailer(
  id: string | number,
  type: "movie" | "series"
): Promise<string> {
  // GET https://ott.tvanywhereafrica.com:28182/api/client/v1/{ouid}/users/{user_id}/vod/trailers/movies/{movie_id}
  try {
    const seriesURL = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/vod/trailers/series/${id}`;
    const moviesURL = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/vod/trailers/movies/${id}`;
    let url = type === "series" ? seriesURL : moviesURL;
    const trailer = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userInfoToken.access_token}`,
      },
    });
    return trailer.data.data.url;
  } catch (error: any) {
    throw Error(error.message);
  }
}

/**
 * Returns the playout URL for a media
 * @param id
 * @returns Playout m3u8 URL
 */
export async function fetchPlayoutURL(
  id: string,
  type: string
): Promise<string | undefined> {
  console.log(id);
  console.log(type);
  let movieURL = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/vod/movies/${id}`;
  let episodeURL = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/vod/episodes/${id}`;
  let url = type === "movie" ? movieURL : episodeURL;
  console.log(url);
  try {
    const playoutURL = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${userInfoToken.access_token}`,
      },
    });
    console.log(playoutURL);
    return playoutURL.data.data.url;
  } catch (error: any) {
    console.log(error);
    if (error.response.status === 401) {
      await refreshToken();
    } else
      throw Error(
        (error.response.data &&
          error.response &&
          error.response.data.data.message) ??
          error.message
      );
  }
}

export async function searchForMedia(query: string): Promise<any[]> {
  const sanitizedQuery = query.replace(/[^a-zA-Z ]/g, "");
  console.log(sanitizedQuery);
  try {
    const userPackages = await fetchPackages();
    const searchResult = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/search/movies/${sanitizedQuery}?translation=hr&packages=${userPackages?.packageIdsString}`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return searchResult.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    throw Error(error.message);
  }
}

export async function fetchFavorites() {
  try {
    const favorites = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/favorites/movies`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return favorites.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

export async function addToFavorites(id: string) {
  try {
    const addTofavoritesResponse = await axios.post(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/favorites/movies`,
      {
        movie_id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return addTofavoritesResponse.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

export async function removeFavorite(id: string) {
  try {
    const removeFavoriteResponse = await axios.delete(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/favorites/movies/${id}`,
      {
        data: {
          movie_id: id,
        },
        headers: { Authorization: `Bearer ${userInfoToken.access_token}` },
      }
    );
    return removeFavoriteResponse.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

export async function updateWatchlist(
  type: string,
  id: string,
  mediaDuration?: number | undefined
) {
  try {
    let url = "";
    if (type === "series")
      url = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/bookmarks/episodes/${id}`;
    if (type === "movie")
      url = `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/bookmarks/movies/${id}/${id}`;

    console.log(url);

    const updateWatchlistResponse = await axios.put(
      url,
      {
        time: mediaDuration ?? 0,
        name: id,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(updateWatchlistResponse.data);

    return updateWatchlistResponse.data.data.updated;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

/**
 * Remove a movie/series fro watchlist
 * @param type
 * @param id
 * @returns boolean
 */
export const removeFromWatchlist = async (type: string, id: number) => {
  try {
    if (!id) return;

    const removeFromWatchlistResponse = await axios.delete(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.user_id}/bookmarks/movies/${id}`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    if (removeFromWatchlistResponse.data.data.affectedRows > 0) return true;
    else return false;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
};

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const banners = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/banners?translation=en&accessKey=WkVjNWNscFhORDBLCg==`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return banners.data.data || [];
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

export async function fetchGenres(): Promise<
  | {
      genresIDs: number[];
      genresIDsString: string;
      genres: Genre[];
    }
  | undefined
> {
  try {
    const genres = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/genres`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    console.log(genres.data.data);

    const genres_ = genres.data.data as Genre[];
    let genresIDs: number[] = [];

    for (let a = 0; a < genres_.length; a++) {
      const element = genres_[a];
      genresIDs.push(element.id);
    }

    console.log(genresIDs.toString());
    return {
      genresIDs,
      genresIDsString: genresIDs.toString(),
      genres: genres.data.data as Genre[],
    };
  } catch (error: any) {
    console.log(error.message);
    if (error.response.status === 401) {
      await refreshToken();
    } else throw Error(error.message);
    // throw Error(
    //   (error.response &&
    //     error.response.data &&
    //     error.response.data.data.message) ??
    //     error.message
    // );
  }
}

export async function fetchSeries() {
  try {
    const series = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/series`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    console.log(series.data.data);
    return series.data.data;
    // return banners.data.data || [];
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

// export async function fetchWatchlist() {
//   try {
//     const watchlist = await axios.get(
//       `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfoToken.access_token}/my_content`,
//       // `${mediaBaseURL}/api/client/v1/${operatorUID}/series`,
//       {
//         headers: {
//           Authorization: `Bearer ${userInfoToken.access_token}`,
//         },
//       }
//     );
//     // console.log(series.data.data);
//     // return series.data.data;
//     // return banners.data.data || [];
//   } catch (error: any) {
//     console.log(error);
//     throw Error(error.message);
//   }
// }
