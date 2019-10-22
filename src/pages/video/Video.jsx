import React, {useEffect, useRef, useState} from "react";
import {Link, withRouter} from "react-router-dom";
import api from "../../api/index";
import {getPubdate, isEmpty, numberToW} from "../../util/tools";
import './style/video.scss'
import PopularIcon from '../../public/img/ic_popular.svg'
import ArrowDown from '../../public/img/arrow down.svg'

import Player from "./Player";
import VideoCard from "../../components/VideoCard";

function Video(props) {
  let { match } = props;
  let [videoData, setVideoData] = useState({});
  let [videoInfo, setVideoInfo] = useState({});
  let [relatedVideo, setRelatedVideo] = useState([]);
  let [descOpen, setDescOpen] = useState(false);
  let aid = match.params.aid;

  useEffect(() => {
    setVideoInfo({});
    async function getVideoInfo(){
      let result = await api.fetchVideoInfo({ aid });
      setVideoData(result.data);
      setVideoInfo(result.data.videoInfo)
    }
    getVideoInfo();
    window.scrollTo(0, 0)
  }, [aid]);

  // 获取相关视频数据
  useEffect(() => {
    setRelatedVideo([]);
    async function getReletedVideo() {
      let related = await api.fetchRelated({ aid });
      setRelatedVideo(related.data)
    }
    getReletedVideo()
  }, [aid]);

  return (
      <div className={'video-container'} key={props.location.pathname}>
        <Player videoInfo={videoInfo} className={'player-container'}/>
        {/*视频详情介绍*/}
        <div className={'video-desc'}>
          <div className={'title-container'}>
            <div className={'hot-tag'}>
              <PopularIcon className={'hot-tag-icon'}/>
              <span>热门</span>
            </div>
            <div className={`title ${descOpen ? 'open' : ''}`}>
              {videoInfo.title}
            </div>
            <ArrowDown className={`arrow rotate-animation ${descOpen ? 'arrow-up' : ''}`} onClick={() => setDescOpen(!descOpen)}/>
          </div>
          {
            !isEmpty(videoInfo) &&
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
          }
        </div>
        <div className={'related-video-container'}>
          {
            relatedVideo.slice(0, 20).map(rv => {
              return (
                <VideoCard data={rv} key={rv.aid}/>
              )
            })
          }
        </div>
      </div>
  )
}

export default withRouter(Video)
