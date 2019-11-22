import React, {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Link, withRouter} from "react-router-dom";
import api from "../../api/index";
import {getPubdate, ifFetch, isEmpty, numberToW, setCacheData} from "../../util/tools";
import './style/video.scss';
import PopularIcon from '../../public/img/ic_popular.svg';
import ArrowDown from '../../public/img/arrow down.svg';

import Player from "./Player";
import VideoCard from "../../components/VideoCard";
import Comment from "./Comment";
import {Helmet} from "react-helmet";
import {useCacheState, useClearPageCache} from "../../util/customHook";

function Video(props) {
  let {match} = props;
  let aid = match.params.aid;
  let pageKey = `video/${aid}`, history = props.history;
  let [videoInfo, setVideoInfo, getCacheVideoInfoMap] = useCacheState({}, pageKey, 'videoInfo', history, [pageKey]);
  let [relatedVideo, setRelatedVideo, getCacheRelatedVideoMap] = useCacheState([], pageKey, 'relatedVideo', history, [pageKey]);
  let [descOpen, setDescOpen, getCacheDescOpenMap] = useCacheState(false, pageKey, 'descOpen', history, [pageKey]);

  useClearPageCache(pageKey, [pageKey]);

  // 切换到别的视频时，清空当前视频的数据，这样才像重新到新的一个页面
  let resetStateWhenToOtherVideo = () => {
    setVideoInfo({});
    setRelatedVideo([]);
  };

  // aid改变代表切换了另一个视频
  useLayoutEffect(() => {
    ifFetch(resetStateWhenToOtherVideo, history, pageKey);
  }, [aid]);

  useEffect(() => {
    async function getVideoInfo() {
      let result = await api.fetchVideoInfo({aid});
      setVideoInfo(result.data.videoInfo);
    }

    ifFetch(getVideoInfo, history, pageKey);
  }, [aid, history, pageKey]);

  // 获取相关视频数据
  useEffect(() => {
    async function getRelatedVideo() {
      let related = await api.fetchRelated({aid});
      setRelatedVideo(related.data);
    }

    ifFetch(getRelatedVideo, history, pageKey);
  }, [aid]);

  let cacheData = () => {
    setCacheData(pageKey, [getCacheVideoInfoMap, getCacheRelatedVideoMap, getCacheDescOpenMap]);
  };

  console.log(videoInfo, 'videoInfo');
  return (
    <div className={'video-container'} key={props.location.pathname}>
      <Helmet>
        <title>{videoInfo.title}</title>
      </Helmet>
      <Player videoInfo={videoInfo} className={'player-container'}/>
      {/*视频详情介绍*/}
      <div className={'video-desc'}>
        {
          isEmpty(videoInfo) ? <span>加载中...</span> :
            <Fragment>
              <div className={'title-container'}>
                {/*<div className={'hot-tag'}>*/}
                {/*  <PopularIcon className={'hot-tag-icon'}/>*/}
                {/*  <span>热门</span>*/}
                {/*</div>*/}
                <div className={`title ${descOpen ? 'open' : ''}`}>
                  {videoInfo.title}
                </div>
                <ArrowDown className={`arrow rotate-animation ${descOpen ? 'arrow-up' : ''}`}
                           onClick={() => setDescOpen(!descOpen)}/>
              </div>
              <div className={`detail-container ${descOpen ? 'open' : ''}`}>
                <div>
                  <span className={'owner'}>{videoInfo.owner.name}</span>
                  <span className={'view'}>{numberToW(videoInfo.stat.view)}次观看</span>
                  <span className={'danmu'}>{videoInfo.stat.danmaku}弹幕</span>
                  <span className={'date'}>{getPubdate(videoInfo.pubdate)}</span>
                </div>
                <div className={'warning-text'}>未经作者授权禁止转载</div>
                <p className={'desc-detail'}>{videoInfo.desc}</p>
                <div className={'bread-crumbs'}>
                  <Link to={'/index'} className={'bread-item'}>主页</Link>
                  <Link to={`/channel/${videoInfo.reid}`} className={'bread-item'}>{videoInfo.toptype}</Link>
                  <Link to={`/channel/${videoInfo.tid}`} className={'bread-item'}>{videoInfo.tname}</Link>
                  <span className={'desc-detail'}>av{aid}</span>
                </div>
              </div>
            </Fragment>
        }
      </div>
      <div className={'related-video-container'}>
        {
          relatedVideo.slice(0, 20).map(rv => {
            return (
              <VideoCard data={rv} key={rv.aid} isRelated={true} cacheData={cacheData}/>
            );
          })
        }
      </div>
      <Comment aid={aid}/>
    </div>
  );
}

export default withRouter(Video);
