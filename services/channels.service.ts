import axios from "axios";
import { mediaBaseURL, operatorUID } from "~/api.config";
import { getUserInfoCookie } from "./auth.service";
import { User } from "~/interface";

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
