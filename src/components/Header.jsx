import React, {useEffect, useState} from 'react'
import BiliLogo from '../public/img/BILIBILI_LOGO.svg'
import SearchIcon from '../public/img/search.svg'
import BiliTvIcon from '../public/img/bilibili-tv.svg'
import './style/header.scss'
import api from '../api/index'
import {globalEventBus} from "../util/tools";
import {CACHE_PAGE, SEARCH_REFERER} from "../util/constants";
import {Link, withRouter} from "react-router-dom";

const Header = function (props) {
  let [defaultSearch, setDefaultSearch] = useState({});
  let pathname = props.location.pathname

  useEffect(() => {
    (async ()=> {
      let defaultSearch = await api.getSearchDefault();
      console.log(defaultSearch, 'defaultSearch');
      setDefaultSearch(defaultSearch.data)
    })()
  }, [pathname]);

  let enterSearch = () => {
    globalEventBus.emit(CACHE_PAGE);
    localStorage.setItem(SEARCH_REFERER, props.history.length);
    props.history.push('/search')
  };

  return (
    <div className={'app-header'}>
      <a href={'/index'} className={'app-header-logo'}>
        <BiliLogo style={{ width: '100%', height: '100%'}}/>
      </a>
      <div className={'app-header-search'} onClick={enterSearch}>
        <SearchIcon className={'header-search-icon'}/>
        <span className={'header-search-text'}>{defaultSearch.show_name || ''}</span>
      </div>
      <div className={'bili-tv-icon'}>
        <BiliTvIcon style={{ borderRadius: '50%' }}/>
      </div>
      <div className={'app-header-download-button'}>
        下载App
      </div>
    </div>
  )
}

export default withRouter(Header)
