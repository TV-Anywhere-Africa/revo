import { IResult } from "ua-parser-js";
import { Currency, DeviceClass, SubscriberType, VODTypes } from "./types";

export interface CarouselProps {
  title?: string;
  slides: any[];
  showAltMode?: boolean;
  showSeeAllButton?: boolean;
  seeAllButtonLink?: string;
  seeAllButtonLabel?: string;
  showRemoveButton?: boolean;
  onRemoveButtonClicked?: (id: number) => void;
}

export interface MediaCardProps {
  type: string;
  description?: string;
  id: number | string;
  uid: string;
  seriesID?: string | number;
  poster: string;
  title: string;
  action: string;
  showTitle?: boolean;
  showAltMode?: boolean;
  currentIndex: number;
  maxIndex: number;
  watchLevel?: number;
  link?: string;
  season?: number;

  // altProps?: {
  //   maxIndex: number;
  //   altCardIndex: number | null;
  //   currentIndex: number;
  //   onMouseLeave: () => void;
  //   onMouseHover: (index: number) => void;
  // };
}

export interface ISubscription {
  name: string;
  price: string;
  uid: string;
  id: string | number;
  duration: string;
  features: string[];
}

export interface ISubscriptionCardProps extends ISubscription {
  purchasing: boolean;
  onPurchasePackage: (packageID: string | number) => void;
}

export interface Subscriber {
  additional_info: null;
  address: string;
  country: string;
  created_date: string;
  created_time: string;
  date_of_birth: string;
  email: string;
  external_uid: string;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  location: string;
  operator_id: string;
  operator_uid: string;
  other_names: string;
  phone_number: string;
  phone_number2: string;
  status: string;
  type: SubscriberType;
  username: string;
}

export interface User {
  access_token: string;
  device_id: number;
  expires_in: string;
  is_multicast_network: boolean;
  operator_name: string;
  operator_uid: string;
  refresh_token: string;
  token_type: string;
  user_id: number;
}

export interface Profile {
  additional_info: string;
  address: string;
  country: string;
  created_date: string;
  created_time: string;
  date_of_birth: string;
  email: string;
  external_uid: string;
  first_name: string;
  gender: string;
  id: number;
  last_name: string;
  location: string;
  operator_id: string;
  operator_uid: string;
  other_names: string;
  phone_number: string;
  phone_number2: string;
  status: string;
  type: SubscriberType;
  username: string;
}

enum DeviceTypes {
  android = "ANDROID",
  ios = "IOS",
  linux = "LINUX",
  macos = "MACOS",
  windows = "WINDOWS",
}

export interface Movie {
  id: number;
  uid: string;
  age_rating_id: number;
  description?: string | undefined;
  parental_hidden: boolean;
  year: number | null;
  critics_rating: number | null;
  created_at: string;
  expires: string;
  type: string;
  title: string;
  image_id: number;
  position: number;
  promotable: boolean;
  price: string;
  package_id: number;
  currency_id: number;
}

export interface Category {
  title: string;
  content: Movie[];
  id?: string | number;
}

export interface MovieDetails {
  id: number;
  uid: string;
  year: number;
  duration: number;
  content_end_timestamp: null;
  metadata: {
    aspect_ratio: string;
    "external-uid": string;
    original_title: string;
    audio_description: string;
    "external-provider": string;
    available_audio_tracs: string;
  };
  start_from: string;
  expires: string;
  age_rating_id: number;
  user_rating: number;
  parental_hidden: boolean;
  critics_rating: number;
  audio_languages: null;
  subtitle_languages: null;
  resolution: string;
  image_store_id: number;
  external_link: null;
  distributor_id: number;
  drm_tag: { drm_id: null; cm_vod_id: null };
  category_sort_weight: number;
  georule_id: null;
  highlights: [];
  categories: number[];
  genres: number[];
  packages: number[];
  has_trailer: boolean;
  title: string;
  description: string;
  cast: string;
  director: string;
  producer: string;
  keyword: null;
  country: number[];
  series_metadata: {
    0: string;
    1: string;
    2: string;
    season: string;
    series: string;
    episode: string;
  };
  awards: string;
  trivia: string;
  images: { PREVIEW: null; GALLERY: [] };
}

export interface ChannelDetails extends MovieDetails {
  id: number;
  uid: string;
  year: number;
  title: string;
  description: string;
  images: { PREVIEW: null; GALLERY: [] };
}
export interface SeriesDetails extends MovieDetails {
  id: number;
  uid: string;
  year: number;
  title: string;
  description: string;
  images: { PREVIEW: null; GALLERY: [] };
}

export interface UserLists {
  epg_recordings: [];
  epg_recording_bookmarks: [];
  episode_bookmarks: [];
  movie_bookmarks: WatchHistoryBookmark[];
  past_reminders: [];
  future_reminders: [];
}

export interface SimilarMovie {
  id: number;
  year: number;
  type: string;
  title: string;
  country: string[];
  image_id: number;
}

export interface SearchMovie {
  id: number;
  uid: string;
  title: string;
  image_id: number;
  parental_hidden: boolean;
  original_title: string;
}

export interface Device {
  id: number;
  uid: string;
  device_class: string;
  os: string;
  mac_1: string | null;
  mac_2: string | null;
  metadata: {};
  video_type: string | null;
  is_deletable: boolean;
  device_type: { uid: string };
}

export interface Banner {
  id: number | string;
  uid: string;
  banner_image_id: number;
  preview_image_id: number;
  size: string;
  type: string;
  vod_type: string;
  active_from: Date;
  active_to: Date;
  visible: true;
  position: number;
  device_class: DeviceClass[];
  operator_id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  description: string;
  link: string;
  content_id: number;
  series_content_id: null;
}

export interface SelectedBanner extends Banner {
  image: string;
}

export interface Network {
  name: string;
  uid: string;
  image: string;
}

export interface Purchase {
  id: number;
  purchase_date: string;
  purchase_time: string;
  end_date: string;
  end_time: string;
  subscriber_uid: string;
  product_id: string | number;
  product_name: string;
  price: number;
  Price: number;
  currency: Currency;
  subscription_type: string;
  status: string;
  operator_id: number;
  operator_uid: string;
  internal_transaction_id: string;
  external_transaction_id: string;
}

export interface StoreState extends StoreAction {
  showAuthModal: boolean;
  currentlyHoveredMedia: string;
}

export interface StoreAction {
  setShowAuthModal: (showAuthModal: StoreState["showAuthModal"]) => void;
  setCurrentlyHoveredMedia: (
    currentlyHoveredMedia: StoreState["currentlyHoveredMedia"]
  ) => void;
}

export interface Genre {
  id: number;
  uid: string;
  operator_id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: null | string;
}

export interface CategoryInfo {
  id: number;
  uid: string;
  name: string;
  desc: string;
  parent_id: null | string;
  subcategories: boolean;
  movies_count: number;
  series_count: number;
  heading_image_id: null | string;
  branded: null | string;
  background_color: string;
  background_image_id: null | string;
  logo_image_id: null | string;
  is_default: boolean;
}

export interface Season {
  id: number;
  number: number;
  has_trailer: true;
  episodes: Episode[];
  title: string;
}

export interface Episode {
  id: number;
  number: number;
  duration: number;
  uid: string;
  title: string;
  image_id: number;
}

export interface SeriesDetails extends MovieDetails {
  id: number;
  uid: string;
  year: number;
  age_rating_id: number;
  parental_hidden: false;
  // user_rating: null;
  critics_rating: number;
  external_link: null;
  // metadata: {
  //   "external-uid": string;
  //   original_title: string;
  //   "external-provider": string;
  // };
  has_trailer: true;
  seasons: Season[];
  packages: number[];
  categories: number[];
  genres: number[];
  title: string;
  description: string;
  cast: string;
  director: string;
  producer: string;
  keyword: null;
  // country: string[];
  awards: any;
  trivia: any;
  // images: { POSTER: number; PREVIEW: null; GALLERY: [] };
}

export interface WatchHistoryBookmark {
  id: number;
  subscriber_id: number;
  profile_id: number;
  movie_id: number;
  operator_id: number;
  time: number;
  name: string;
  created_at: string;
  updated_at: string;
  movie: {
    id: number;
    duration: number;
    packages: [{ uid: string; type: VODTypes; metadata: {} }];
  };
  percent_watched: number;
}

export interface MetaProps {
  title?: string;
  image?: string;
  description?: string;
  domain?: string;
  url?: string;
  image_alt?: string;
}

export interface Log {
  action: "logout" | "search" | "sign up" | "login" | "purchase" | "play";
  content_uid?: string;
  content_id?: string;
  content_type?: string;
  content_name?: string;
  duration?: number;
  subscriberUID?: string;
}

export interface DeviceCookie {
  deviceId: string | undefined;
  // deviceInfo: string | undefined;
  deviceInfo: IResult;
  // | {
  //     ua: string;
  //     browser: {
  //       name: string;
  //       version: string;
  //       major: string;
  //     };
  //     engine: {
  //       name: string;
  //       version: string;
  //     };
  //     os: {
  //       name: string;
  //       version: string;
  //     };
  //     device: {
  //       vendor: string;
  //       model: string;
  //     };
  //     cpu: object;
  //   };
}
