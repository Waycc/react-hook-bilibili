import {VIDEO_RELATED_URL, VIDEO_URL} from "./url";
import {get} from "./fetch";

export function fetchVideoInfo({ aid }) {
  let url = `${VIDEO_URL}?aid=${aid}`;
  return get(url)
}

export function fetchRelated({ aid }) {
  let url = `${VIDEO_RELATED_URL}?aid=${aid}`
  return get(url)
}
