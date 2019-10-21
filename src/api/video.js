import {VIDEO_URL} from "./url";
import {get} from "./fetch";

export function fetchVideoInfo({ aid }) {
  let url = `${VIDEO_URL}?aid=${aid}`;
  return get(url)
}
