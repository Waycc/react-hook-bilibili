import {get} from "./fetch";
import {LOC_URL, INDEX_RANKING_URL, RANKING_REGION_URL, ARCHIVE_RANK_URL} from "./url";

export function fetchLoc() {
  return get(LOC_URL)
}

export function fetchIndexRanking() {
  return get(INDEX_RANKING_URL)
}

export function fetchRankingRegion({ rid, day=7 }) {
  let url = `${RANKING_REGION_URL}?rid=${rid}&day=${day}`;
  return get(url)
}

export function fetchArchiveRank({ rid, page }) {
  let url =`${ARCHIVE_RANK_URL}?tid=${rid}&pn=${page}`;
  return get(url)
}
