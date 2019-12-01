import {SEARCH_DEFAULT, HOT_WORD} from "./url";
import {get} from "./fetch";

export function getSearchDefault() {
  return get(SEARCH_DEFAULT)
}

export function getHotWord() {
  return get(HOT_WORD)
}
