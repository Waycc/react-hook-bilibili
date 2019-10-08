import React from 'react'
import BiliLogo from '../public/img/BILIBILI_LOGO.svg'
import SearchIcon from '../public/img/search.svg'
import BiliTvIcon from '../public/img/bilibili-tv.svg'
import './style/header.scss'

const Header = function () {
  return (
    <div className={'app-header'}>
      <a href={'/index'} className={'app-header-logo'}>
        <BiliLogo style={{ width: '100%', height: '100%'}}/>
      </a>
      <div className={'app-header-search'}>
        <SearchIcon className={'header-search-icon'}/>
        <span className={'header-search-text'}>我和我的祖我和我的祖</span>
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

export default Header
