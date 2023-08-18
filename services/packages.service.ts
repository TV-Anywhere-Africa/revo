import axios from "axios";
import Cookies from "js-cookie";
import { baseURL, operatorUID } from "~/api.config";
import cookieNames from "~/constants/cookieNames";
import { Profile, Purchase, User } from "~/interface";

const userInfoCookie = Cookies.get(cookieNames.userInfo);
const userProfileCookie = Cookies.get("profile");

/**
 * Purchase a package
 * @param packageID - ID of package to be purchases
 * @param network - User's operator network
 */
export async function purchaseSubscription(
  packageID: string | number,
  network: string
) {
  const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
  const userProfile: Profile =
    userProfileCookie && JSON.parse(userProfileCookie);
  try {
    const purchaseResponse = await axios.post(
      `${baseURL}/api/purchase/?operator_uid=${operatorUID}`,
      {
        subscriber_uid: userProfile.username,
        subscription_type: "one-off",
        bill: true,
        product_id: packageID,
        medium: "web",
        operator: network,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(purchaseResponse.data);

    if (purchaseResponse.data.status === "error")
      throw Error(purchaseResponse.data.message);
    return purchaseResponse.data.message;
  } catch (error: any) {
    console.log();
    throw Error(
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
}

/**
 * Cancel a subscription to a pachage
 * @param packageID `string`
 */
export async function cancelPurchaseSubscription(packageID: string | number) {
  console.log(packageID);
  try {
    const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
    const userProfile: Profile =
      userProfileCookie && JSON.parse(userProfileCookie);

    //
    const purchaseCancelResponse = await axios.post(
      ` ${baseURL}/api/purchase/?operator_uid=${operatorUID}&method=delete`,
      {
        subscriber_uid: userProfile.username,
        product_id: packageID,
        medium: "web",
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
          "Content-Type": "application/json",
        },
      }
      // {
      // data: {
      // subscriber_uid: userProfile.username,
      // product_id: packageID,
      // medium: "web",
      // },
      //   headers: {
      // Authorization: `Bearer ${userInfo.access_token}`,
      // "Content-Type": "application/json",
      //   },
      // }
    );
    console.log(purchaseCancelResponse.data);
    return purchaseCancelResponse.data.message;
    //
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

/**
 * Fetches a user's account purchase history
 * @returns `Purchase[]`
 */
export async function fetchPurchaseHistory(): Promise<Purchase[]> {
  try {
    const userProfile: Profile =
      userProfileCookie && JSON.parse(userProfileCookie);
    const purchaseHistoryResponse = await axios.get(
      `${baseURL}/api/orders/?operator_uid=${operatorUID}&subscriber_uid=${userProfile.username}&limit=30&status=Active`
    );
    return purchaseHistoryResponse.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.message ?? error.message);
  }
}

export async function stopSubscriptionAutoRenewal(packageID: string | number) {
  console.log(packageID);
  try {
    const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
    const userProfile: Profile =
      userProfileCookie && JSON.parse(userProfileCookie);

    const purchaseCancelResponse = await axios.post(
      `${baseURL}/api/purchase/?operator_uid=${operatorUID}&method=update`,
      {
        subscriber_uid: userProfile.username,
        product_id: packageID,
        medium: "web",
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(purchaseCancelResponse.data);
    return purchaseCancelResponse.data.message;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}
