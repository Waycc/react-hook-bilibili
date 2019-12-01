import React, {useEffect, useState} from 'react'
import BiliLogo from '../public/img/BILIBILI_LOGO.svg'
import SearchIcon from '../public/img/search.svg'
import BiliTvIcon from '../public/img/bilibili-tv.svg'
import './style/header.scss'
import api from '../api/index'
import {globalEventBus} from "../util/tools";
import {CACHE_PAGE} from "../util/constants";
import {Link} from "react-router-dom";

const Header = function () {
  let [defaultSearch, setDefaultSearch] = useState({});


  useEffect(() => {
    (async ()=> {
      let defaultSearch = await api.getSearchDefault();
      console.log(defaultSearch, 'defaultSearch');
      setDefaultSearch(defaultSearch.data)
    })()

  }, []);

  let onSearchClick = () => {
    globalEventBus.emit(CACHE_PAGE)
  };

  return (
    <div className={'app-header'}>
      <a href={'/index'} className={'app-header-logo'}>
        <BiliLogo style={{ width: '100%', height: '100%'}}/>
      </a>
      <Link to={'/search'} className={'app-header-search'} onClick={onSearchClick}>
        <SearchIcon className={'header-search-icon'}/>
        <span className={'header-search-text'}>{defaultSearch.show_name || ''}</span>
      </Link>
      <div className={'bili-tv-icon'}>
        <BiliTvIcon style={{ borderRadius: '50%' }}/>
      </div>
      <div className={'app-header-download-button'}>
        下载App
      </div>
    </div>
  )
}

export default Header
