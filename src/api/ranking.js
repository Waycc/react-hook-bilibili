import {get} from "./fetch";
import {LOC_URL, INDEX_RANKING_URL} from "./url";

export function fetchLoc() {
  return get(LOC_URL)
}

export function fetchIndexRanking() {
  return get(INDEX_RANKING_URL)
}
