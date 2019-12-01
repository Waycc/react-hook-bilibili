import React, {useEffect, useState} from "react";
import './style/search.scss'
import SearchIcon from '../../public/img/search.svg'
import {withRouter} from "react-router-dom";
import api from '../../api/index'
import {SEARCH_HISTORY} from "../../util/constants";

function Search(props) {
  let {history} = props;
  let [hotWord, setHotWord] = useState([])
  let [hasSearch, setHasSearch] = useState(false);

  useEffect(() => {
    let getHotWord = async () => {
      let hotWord = await api.getHotWord()
      setHotWord(hotWord.data)
      console.log(hotWord, 'hotWord')
    }
    getHotWord()
  }, [])

  let onCancelClick = () => {
    history.goBack()
  }

  let getSearchHistory = () => {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY) || '[]')
  }

  let setSearchHistory = (keyword) => () => {
    let searchHistory = new Set(getSearchHistory());
    searchHistory.add(keyword);
    localStorage.setItem(SEARCH_HISTORY, JSON.stringify(Array.from(searchHistory)))
  }

  return (
    <div className={'search-page'}>
      <div className={'fixed-search-container'}>
        <div className={'search-input-container'}>
          <SearchIcon className={'search-icon'}/>
          <input className={'search-input'} placeholder={'一个人的寂寞'}/>
        </div>
        <div className={'cancel-button'} onClick={onCancelClick}>取消</div>
      </div>
      {
        !hasSearch &&
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
          <div className={'divider'}/>
          <div className={'search-history-container'}>
            <div className={'label'}>历史搜索</div>
            {
              getSearchHistory().map(keyword => keyword)
            }
          </div>
        </div>
      }
    </div>
  )
}

export default withRouter(Search)
