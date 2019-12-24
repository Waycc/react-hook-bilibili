import {SEARCH_DEFAULT, HOT_WORD, SUGGEST_URL, ALL_SEARCH, TYPE_SEARCH} from "./url";
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

export function getAllSearchResult({page=1, pageSize=20, order='totalrank', searchType='all', keyword}) {
 return get(ALL_SEARCH + `?keyword=${keyword}&page=${page}&pagesize=${pageSize}&search_type=${searchType}&order=${order}`)
}

export function getTypeSearchResult({page=1, pageSize=20, order='totalrank', searchType='all', keyword}) {
  return get(TYPE_SEARCH + `?keyword=${keyword}&page=${page}&pagesize=${pageSize}&search_type=${searchType}&order=${order}`)
}
