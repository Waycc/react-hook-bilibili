import {SEARCH_DEFAULT, HOT_WORD, SUGGEST_URL} from "./url";
import {get} from "./fetch";

export function getSearchDefault() {
  return get(SEARCH_DEFAULT)
}

export function getHotWord() {
  return get(HOT_WORD)
}

export function getSuggest(keyword) {
  return get(SUGGEST_URL + '?keyword=' + keyword)
}
