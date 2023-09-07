import axios from "axios";
import { mediaBaseURL, operatorUID } from "~/api.config";
import { getUserInfoCookie } from "./auth.service";
import { Channel, User } from "~/interface";
import { fetchPackages } from "./media.service";

const userInfoToken: User = getUserInfoCookie();

/**
 * Fetch all channels
 */
export async function fetchChannelCategories() {
  try {
    const channelCategoriesResponse = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/categories/channels`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );
    return channelCategoriesResponse.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function fetchChannels(): Promise<Channel[] | []> {
  try {
    const userPackages = await fetchPackages();

    if (!userPackages?.packageIdsString) return [];

    const response = await axios.get(
      mediaBaseURL +
        `/api/client/v2/${operatorUID}/channels?packages=${userPackages.packageIdsString}`,
      {
        headers: {
          Authorization: `Bearer ${userInfoToken.access_token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}
