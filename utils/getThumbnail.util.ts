import { mediaBaseURL } from "~/api.config";

/**
 * Gets the full thumbnail image URL from id
 * @param id
 * @returns image full url
 */
export default function getThumbnail(id: string | number): string {
  return `${mediaBaseURL}/api/client/v1/global/images/${id}?accessKey=WkVjNWNscFhORDBLCg==`;
}
