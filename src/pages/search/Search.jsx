import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import './style/search.scss';
import SearchIcon from '../../public/img/search.svg';
import HistoryIcon from '../../public/img/history.svg';
import CloseIcon from '../../public/img/search-close.svg';
import {withRouter} from "react-router-dom";
import api from '../../api/index';
import {SEARCH_HISTORY, SEARCH_REFERER} from "../../util/constants";
import {debounce} from "../../util/tools";
import SearchResult from "./components/SearchResult";

let suggestTag = 0;

function Search(props) {
  let {history} = props;
  let [hotWord, setHotWord] = useState([]);
  let [defaultSearch, setDefaultSearch] = useState('');
  let [historyChange, setHistoryChange] = useState(0);
  let [searchValue, setSearchValue] = useState('');
  let [suggestData, setSuggestData] = useState([]);
  let [showSuggestArea, setShowSuggestArea] = useState(false);
  let [showSearchResult, setShowSearchResult] = useState(false);
  let [searchResult, setSearchResult] = useState([])
  let [updateKeyword, setUpdateKeyword] = useState(0)

  let locationSearch = props.location.search;

  let setSearchValueAndShowSuggestArea = (value) => {
    let showSuggest = false;
    if (value) showSuggest = true;
    setSearchValue(value);
    setShowSuggestArea(showSuggest);
  };

  useEffect(function getSearchResult() {
    let keyword = locationSearch.split('=')[1] || '';
    setSearchValueAndShowSuggestArea(decodeURI(keyword));
    if (keyword) {
      setShowSearchResult(true)
      setShowSuggestArea(false)
    }
  }, [locationSearch, updateKeyword]);

  useEffect(() => {
    let getHotWord = async () => {
      let hotWord = await api.getHotWord();
      setHotWord(hotWord.data);
    };
    getHotWord();
  }, []);

  useEffect(() => {
    (async () => {
      let defaultSearch = await api.getSearchDefault();
      setDefaultSearch(defaultSearch.data);
    })();
  }, []);

  let onCancelClick = () => {
    history.goBack();
  };

  let getSearchHistory = () => {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY) || '[]');
  };

  let setSearchHistory = (keyword) => () => {
    let searchHistory = getSearchHistory();
    if (!searchHistory.includes(keyword)) {
      searchHistory.unshift(keyword);
      localStorage.setItem(SEARCH_HISTORY, JSON.stringify(searchHistory.slice(0, 6)));
      setHistoryChange(historyChange => historyChange + 1);
    }
    onKeywordClick(keyword);
  };

  let clearHistory = () => {
    localStorage.removeItem(SEARCH_HISTORY);
    setHistoryChange(historyChange => historyChange + 1);
  };

  let enterPageWithNewKeyword = keyword => {
    history.replace('/search?keyword=' + keyword);
  };

  let onKeywordClick = (keyword) => {
    enterPageWithNewKeyword(keyword);
    setUpdateKeyword(updateKeyword => updateKeyword + 1)
  };

  let onSearchInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      enterPageWithNewKeyword(searchValue);
    }
  };

  let getSuggest = useCallback(debounce(function (value) {
    if (!value) {
      setSuggestData([]);
      return;
    }
    let tag = ++suggestTag;
    api.getSuggest(value).then(result => {
      if (tag === suggestTag) {
        setSuggestData(result.data.tag || []);
      }
    });
  }, 100), []);

  let onSearchInputValueChange = (e) => {
    getSuggest(e.target.value);
    setShowSearchResult(false);
    setSearchValueAndShowSuggestArea(e.target.value);
  };

  let onCloseSearchClick = () => {
    setSearchValueAndShowSuggestArea('');
    setShowSearchResult(false);
    setSearchResult([])
  };

  let searchHistory = useMemo(() => getSearchHistory(), [historyChange]);
  return (
    <div className={'search-page'}>
      <div className={'fixed-search-container'}>
        <div className={'search-input-container'}>
          <SearchIcon className={'search-icon'}/>
          <input className={'search-input'} value={searchValue} placeholder={defaultSearch.show_name}
                 onChange={onSearchInputValueChange} onKeyDown={onSearchInputKeyDown}/>
          {!!searchValue && <div className={'close-search-icon'} onClick={onCloseSearchClick}><CloseIcon/></div>}
        </div>
        <div className={'cancel-button'} onClick={onCancelClick}>取消</div>
      </div>
      {
        !showSearchResult && !showSuggestArea &&
        <div className={'search-content'}>
          <div className={'hot-word-container'}>
            <div className={'label'}>大家都在搜</div>
            <div className={'hot-word-area'}>
              {hotWord.map(hotWordItem => (
                <div className={'hot-word-item'} key={hotWordItem.keyword}
                     onClick={setSearchHistory(hotWordItem.keyword)}>{hotWordItem.keyword}</div>
              ))}
            </div>
          </div>
          <div className={'search-history-container'}>
            <div className={'label'}>历史搜索</div>
            {
              searchHistory.map(keyword => (
                <div className={'search-history-item'} key={keyword} onClick={() => onKeywordClick(keyword)}>
                  <HistoryIcon className={'history-icon'}/>
                  <span>{keyword}</span>
                </div>
              ))
            }
            <div className={'clear-history-container'} onClick={clearHistory}>
              {
                searchHistory.length !== 0 &&
                <span>清除历史记录</span>
              }
            </div>
          </div>
        </div>
      }
      {
        showSuggestArea &&
        <div className={'suggest-area'}>
          {
            suggestData.map(sd =>
              <div className={'suggest-item'} dangerouslySetInnerHTML={{__html: sd.name}} key={sd.value}
                   onClick={setSearchHistory(sd.value)}/>)
          }
        </div>
      }
      {
        showSearchResult &&
          <SearchResult/>
      }
    </div>
  );
}

export default withRouter(Search);
