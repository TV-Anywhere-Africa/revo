import axios from "axios";
import Cookies from "js-cookie";
import {
  authBaseURL,
  baseURL,
  mediaBaseURL,
  operatorUID,
  tmpPswd,
} from "~/api.config";
import { DeviceCookie, Log, Profile, Subscriber, User } from "~/interface";
import isEmail from "~/utils/isEmail.util";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";
import toast from "react-hot-toast";
import cookieNames from "~/constants/cookieNames";

const parser = new UAParser();
const userInfoCookie = Cookies.get(cookieNames.userInfo);
const userProfileCookie = Cookies.get(cookieNames.profile);

export async function generateOTP(value: string) {
  try {
    const response = await axios.post(
      `${baseURL}/api/otp/?operator_uid=${operatorUID}&mode=generate`,
      { mobile_number: value }
      // isEmail(value)
      //   ? {
      //       email: value,
      //     }
      //   : {
      //       mobile_number: value,
      //     }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function verifyOTP(value: string, otp: string) {
  console.log(value, otp);
  try {
    const response = await axios.post(
      `${baseURL}/api/otp/?operator_uid=${operatorUID}&mode=validate`,
      {
        mobile_number: value,
        otp,
      }
      // isEmail(value)
      //   ? {
      //       email: value,
      //       otp,
      //     }
      //   : {
      //       mobile_number: value,
      //       otp,
      //     }
    );
    // if (response.data.status === "error") {
    //   throw new Error(response.data.message);
    // }
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function fetchSubscriber(
  value?: string
): Promise<Subscriber | null> {
  try {
    const email = value || Cookies.get("email");
    const mobileNumber = value || Cookies.get("mobile_number");
    console.log(email || mobileNumber);
    let subscriberResponse = await axios.get(
      `${baseURL}/api/subscriber/?operator_uid=${operatorUID}&subscriber_uid=${
        email || mobileNumber
      }&limit=1`
    );
    console.log(subscriberResponse.data, email || mobileNumber);
    return subscriberResponse.data.data[0] as Subscriber;
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function signIn(value: string) {
  console.log(isEmail(value), value);

  async function username(): Promise<string | undefined> {
    if (isEmail(value)) {
      const subscriber = await fetchSubscriber(value);
      return subscriber?.username;
    } else return `${operatorUID}${value}`;
  }

  let usernameVal = await username();

  console.log(usernameVal);

  if (!usernameVal) {
    toast.error("User not found. Sign up");
    return;
  }

  // const deviceInfo_ = setDeviceInfoCookies();
  // if (!deviceInfo_) const { deviceId, deviceInfo } = deviceInfo_;
  // const parsedDeviceInfo = JSON.parse(deviceInfo as string);
  // console.log(parsedDeviceInfo);

  const { deviceId, deviceInfo } = setDeviceInfoCookies();
  // let parsedDeviceInfo;

  console.log("signin in...", deviceInfo);

  // if (typeof deviceInfo === "string") {
  //   try {
  //     parsedDeviceInfo = JSON.parse(deviceInfo);
  //   } catch (error) {
  //     console.error("Error parsing deviceInfo:", error);
  //   }
  // } else {
  //   // console.log("no device info", parsedDeviceInfo);
  //   return;
  // }

  const body = {
    username: await username(),
    password: tmpPswd,
    device: deviceId,
    device_class: deviceInfo.device.type ?? "Desktop",
    device_type: deviceInfo.device.vendor || "Desktop",
    device_os:
      (deviceInfo.os.name &&
        deviceInfo.os.name.replace(/\s/g, "").toUpperCase()) ||
      "Windows",
  };
  console.log(body);
  try {
    const signInResponse = await axios.post(
      `${authBaseURL}/api/client/v1/global/login`,
      body
    );
    console.log(signInResponse.data);
    await createLog({ action: "login" });
    if (signInResponse.data.status === "ok") {
      Cookies.set("user_info", JSON.stringify(signInResponse.data.data));
      await getProfile(usernameVal, signInResponse.data.data.access_token);
      setTimeout(() => window.location.reload(), 2000);
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.data.message ?? error.response);
    // toast.error(error.response.data.data.message ?? error.response);
  }
}

export async function getProfile(
  username: string,
  accessToken?: string
): Promise<Profile | undefined | null> {
  try {
    const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
    console.log(userInfo);
    const profileResponse = await axios.get(
      `${baseURL}/api/subscriber/?operator_uid=${operatorUID}&subscriber_uid=${username}&limit=30`,
      {
        headers: {
          Authorization: `Bearer ${accessToken ?? userInfo.access_token}`,
        },
      }
    );
    console.log(profileResponse.data);
    Cookies.set(
      cookieNames.profile,
      JSON.stringify(profileResponse.data.data[0])
    );
    return profileResponse.data.data[0] as Profile;
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function signUp(mobileNumber: string, email: string) {
  let username = `${operatorUID}${mobileNumber}`;
  let body: any = {
    first_name: "m",
    last_name: "Cini",
    password: tmpPswd,
    username,
    // email,
    mobile_number: mobileNumber,
  };

  if (!email) delete body.email;
  if (!mobileNumber) delete body.mobileNumber;

  console.log(body);

  try {
    const signUpResponse = await axios.post(
      `${baseURL}/api/subscriber/?operator_uid=${operatorUID}`,
      body
    );

    console.log(signUpResponse.data);

    if (signUpResponse.data.message === "subscriber already exist") {
      console.log("signIn here");
      await changePassword("1234567", username);
      await signIn(mobileNumber);
    }

    if (
      signUpResponse.data.status === "error" &&
      signUpResponse.data.message !== "subscriber already exist"
    ) {
      throw Error(`${signUpResponse.data.message}`);
    }

    if (signUpResponse.data.status === "ok") {
      await createLog({
        action: "sign up",
      });
      console.log("signIn here", username);
      await changePassword("1234567", username);
      await signIn(mobileNumber);
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

export const setDeviceInfoCookies = (): DeviceCookie => {
  if (!Cookies.get("device")) {
    const deviceInfo = parser.getResult();
    const deviceId = uuidv4();
    Cookies.set(cookieNames.device, deviceId);
    Cookies.set(cookieNames.deviceInfo, JSON.stringify(deviceInfo));
    return {
      deviceId: deviceId,
      deviceInfo: deviceInfo,
    };
  }

  let deviceInfo_ = Cookies.get(cookieNames.deviceInfo);

  return {
    deviceId: Cookies.get(cookieNames.device),
    // deviceInfo: deviceInfo_,
    deviceInfo: deviceInfo_ && JSON.parse(deviceInfo_),
  };
};

/**
 * Refreshes and stores new access token
 */
export async function refreshToken(): Promise<string | undefined> {
  // Implement your logic to refresh the token
  // Make a separate API call to refresh the token and get the updated token
  // Return the new token or throw an error if the token refresh fails
  // For example:
  // const response = await axios.post('/api/refresh-token');
  // return response.data.token;
  try {
    console.log("refreshing token");
    signIn(Cookies.get("mobile_number") ?? Cookies.get("email") ?? "");
    return "new-access-token-abc123";
  } catch (error) {
    throw new Error("Token refresh failed");
  }
}

export async function onAccessTokenExpire(apiCall: any) {
  try {
    // const newAccessToken = await refreshToken();
    apiCall;
  } catch (error) {}
}

export function getAccessToken(): string | undefined {
  let parsedUserInfoCookie = JSON.parse(userInfoCookie || "");
  console.log("getting access token", parsedUserInfoCookie);
  return parsedUserInfoCookie.access_token;
}

export function getUserInfoCookie(): User {
  try {
    const userInfoCookie = Cookies.get(cookieNames.userInfo);
    console.log(userInfoCookie);
    const parsedUserInfoCookie: User = JSON.parse(userInfoCookie || "");
    return parsedUserInfoCookie;
  } catch (error) {
    return {
      access_token: "",
      device_id: 0,
      expires_in: "",
      is_multicast_network: false,
      operator_name: "",
      operator_uid: "",
      refresh_token: "",
      token_type: "",
      user_id: 0,
    };
  }
}

export function getUserProfileCookie(): Profile {
  try {
    const userProfileCookie = Cookies.get("profile");
    console.log(userProfileCookie);
    const parsedUserProfileCookie: Profile = JSON.parse(
      userProfileCookie || ""
    );
    return parsedUserProfileCookie;
  } catch (error) {
    return {
      additional_info: "",
      address: "",
      country: "",
      created_date: "",
      created_time: "",
      date_of_birth: "",
      email: "",
      external_uid: "",
      first_name: "",
      gender: "",
      id: 0,
      last_name: "",
      location: "",
      operator_id: "",
      operator_uid: "",
      other_names: "",
      phone_number: "",
      phone_number2: "",
      status: "",
      type: "PREPAID",
      username: "",
    };
  }
}

/**
 * Change user account password
 * @param password
 * @param id
 * @returns
 */
export const changePassword = async (pswd: string, username?: string) => {
  try {
    const userProfile: Profile =
      userProfileCookie && JSON.parse(userProfileCookie);
    const passwordChangeResponse = await axios.put(
      `${baseURL}/api/subscriber/?operator_uid=${operatorUID}&subscriber_uid=${
        username ?? userProfile.username
      }`,
      {
        password: pswd,
      }
    );

    if (passwordChangeResponse.data.status === "error") {
      throw Error(passwordChangeResponse.data.message);
    } else {
      console.log(passwordChangeResponse.data);
      return passwordChangeResponse.data.message;
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.message ?? error.message);
  }
};

/**
 * Get all devices connected to a user's account
 */
export async function fetchUserDevices() {
  const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
  try {
    const devices = await axios.get(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfo.user_id}/devices`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      }
    );
    return devices.data.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error.message);
  }
}

/**
 * Remove a device from connected devices list
 * @param deviceId - ID of device to be removed
 */
export const removeUserDevice = async (deviceId: string) => {
  const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
  try {
    const removeDeviceResponse = await axios.delete(
      `${mediaBaseURL}/api/client/v1/${operatorUID}/users/${userInfo.user_id}/devices/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      }
    );
    console.log(removeDeviceResponse);
  } catch (error: any) {
    console.log(error);
    throw Error(error.response.data.data.message ?? error.message);
  }
};

export async function logout() {
  const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${authBaseURL}/api/client/v1/global/logout`,
    headers: {
      Authorization: `Bearer ${userInfo.access_token}`,
    },
  };

  try {
    const logoutResponse = await axios.request(config);
    return logoutResponse.data;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

const LOG_MESSAGES = {
  signIn: "User logged in",
  signUp: "User signed up",
  logout: "User logged out",
  playMovie: "User played movie",
  playLive: "User played live TV channel",
  playSeries: "User played series",
  visitLandingGlobal: "User visited mCini web",
  visitLandingGH: "User visited Ghana instance",
  visitLandingNG: "User visited Nigeria instance",
  search: "User searched for content",
  quit: "User closed web client",
  purchase: "User purchased a pack",
  play: "User played content",
};

export async function createLog(data: Log) {
  console.warn("logging data", data);

  function logMessage(): string {
    if (data.action === "login") return LOG_MESSAGES.signIn;
    if (data.action === "logout") return LOG_MESSAGES.logout;
    if (data.action === "sign up") return LOG_MESSAGES.signUp;
    if (data.action === "search") return LOG_MESSAGES.search;
    if (data.action === "purchase") return LOG_MESSAGES.purchase;
    if (data.action === "play") return LOG_MESSAGES.play;
    return "";
  }

  try {
    // const userProfile: Profile =
    //   userProfileCookie && JSON.parse(userProfileCookie);
    console.log(data.subscriberUID);
    console.log(Cookies.get(cookieNames.mobileNumber));
    console.log(
      data.subscriberUID ?? operatorUID + Cookies.get(cookieNames.mobileNumber)
    );
    const { deviceId, deviceInfo } = setDeviceInfoCookies();
    let username =
      data.subscriberUID ?? operatorUID + Cookies.get(cookieNames.mobileNumber);
    // console.log("deviceInfo", deviceInfo);
    //   let device_platform = deviceInfoCookie.os.name;
    //   let device_name = deviceInfoCookie.browser.name;
    const requestData = {
      subscriber_uid: username || "anonymous",
      device_id: deviceId,
      device_type: deviceInfo.device.vendor ?? "Desktop",
      device_name: deviceInfo.browser.name,
      platform: deviceInfo.os.name,
      action: data.action,
      content_id: data.content_id,
      content_uid: data.content_uid,
      content_type: data.content_type,
      content_name: data.content_name,
      content_details: logMessage(),
      duration: data.duration ?? undefined,
      medium: "Web",
    };
    console.log("log data", requestData);

    let logResponse = await axios.post(
      `${baseURL}/api/logs/?operator_uid=txtgh`,
      requestData
    );
    console.log(logResponse.data);
  } catch (error) {
    console.error(error);
  }
  // console.log(data)
  // try {
  //   if (!Cookies.get("device_info")) setDeviceInfoCookies();
  //   let logMessage;
  //   let deviceInfoCookie = Cookies.get("device_info");
  //   let device_id = Cookies.get("device");
  //   let user_uid = window.localStorage.getItem("_tva_username");
  //   let device_platform = deviceInfoCookie.os.name;
  //   let device_name = deviceInfoCookie.browser.name;
  //   let durationInt = 0;
  //   const { deviceId, deviceInfo } = setDeviceInfoCookies();
  //   if (action === "logout") logMessage = LOG_MESSAGES.logout;
  //   if (action === "search") logMessage = LOG_MESSAGES.search;
  //   if (action === "login") logMessage = LOG_MESSAGES.login;
  //   if (action === "quit") logMessage = LOG_MESSAGES.quit;
  //   if (action === "play" && content_type === "movie")
  //     logMessage = LOG_MESSAGES.playMovie;
  //   if (action === "play" && content_type === "series")
  //     logMessage = LOG_MESSAGES.playSeries;
  //   if (action === "play" && content_type === "live")
  //     logMessage = LOG_MESSAGES.playLive;
  //   // if (action === 'play' && (content_type !== 'series' && content_type !== 'movie')) logMessage = LOG_MESSAGES.playMovie
  //   if (action === "visit") logMessage = LOG_MESSAGES.visitLandingGlobal;
  //   if (duration) {
  //     duration.replace(",", "");
  //     durationInt = Number(duration);
  //   }
  //   const requestData = {
  //     subscriber_uid: user_uid || "anonymous",
  //     device_id: device_id,
  //     device_type: deviceInfoCookie.device.vendor || "Desktop",
  //     device_name: device_name,
  //     platform: device_platform,
  //     action: action,
  //     content_uid: content_uid,
  //     content_type: content_type,
  //     content_name: content_name,
  //     content_details: logMessage,
  //     duration: durationInt,
  //     medium: "Web",
  //   };
  //   await axios.post(`${baseURL}/api/logs/?operator_uid=txtgh`, requestData);
  // } catch (e) {
  //   // console.log(e)
  // }
}
/**
 * Update user profile information
 * @param data - Fields to be updated
 */
export async function updateProfile(data: object) {
  try {
    const userInfo: User = userInfoCookie && JSON.parse(userInfoCookie);
    const profileInfo: Profile = getUserProfileCookie();

    console.log(userInfo);
    console.log(profileInfo);

    const updateProfileResponse = await axios.put(
      `${baseURL}/api/subscriber/?operator_uid=${operatorUID}&subscriber_uid=${profileInfo.username}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userInfo.access_token}`,
        },
      }
    );

    return updateProfileResponse.data;
  } catch (error: any) {
    console.log(error);
    throw Error(
      (error.response && error.response.data && error.response.data.message) ??
        error.message
    );
  }
}
