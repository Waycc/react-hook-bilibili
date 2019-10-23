import React, {Fragment, useEffect, useRef, useState} from "react";
import {Link, withRouter} from "react-router-dom";
import api from "../../api/index";
import {getPubdate, isEmpty, numberToW} from "../../util/tools";
import './style/video.scss'
import PopularIcon from '../../public/img/ic_popular.svg'
import ArrowDown from '../../public/img/arrow down.svg'

import Player from "./Player";
import VideoCard from "../../components/VideoCard";
import Comment from "./Comment";

function Video(props) {
  let { match } = props;
  let [videoData, setVideoData] = useState({});
  let [videoInfo, setVideoInfo] = useState({});
  let [relatedVideo, setRelatedVideo] = useState([]);
  let [commentListData, setCommentListData] = useState([]); // 评论列表
  let [pageInfo, setPageInfo] = useState({}); // 分页信息
  let [descOpen, setDescOpen] = useState(false);
  let [commentPage, setCommentPage] = useState(1);
  let aid = match.params.aid;

  // 切换到别的视频时，清空当前视频的数据，这样才像重新到新的一个页面
  let resetStateWhenToOtherVideo = () => {
    setVideoInfo({});
    setRelatedVideo([]);
    setCommentListData([]);
    setPageInfo({});
    setCommentPage(1);
  };

  useEffect(() => {
    resetStateWhenToOtherVideo();
    async function getVideoInfo(){
      let result = await api.fetchVideoInfo({ aid });
      setVideoData(result.data);
      setVideoInfo(result.data.videoInfo)
    }
    getVideoInfo();
  }, [aid]);

  // 获取相关视频数据
  useEffect(() => {
    async function getRelatedVideo() {
      let related = await api.fetchRelated({ aid });
      setRelatedVideo(related.data)
    }
    getRelatedVideo()
  }, [aid]);

  // 只有aid切换才请求，页数增加另外处理
  useEffect(() => {
    let _ = async () => {
      let result = await getCommentData(aid, commentPage)
      let data = result.data || {};
      let replies = data.replies || [];
      let pageInfo = data.page || {};
      setCommentListData(commentListData => commentListData.concat(replies));
      setPageInfo(pageInfo)
    };
    _()
  }, [aid]);

  // 通过传参而不是直接用aid和commentPage， 是方便监听scroll事件时用最新的参数去请求评论
  async function getCommentData(aid, commentPage) {
    return  await api.fetchCommentData({ aid, pn: commentPage});
  }

  console.log(commentListData, 222)
  return (
      <div className={'video-container'} key={props.location.pathname}>
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
                  <ArrowDown className={`arrow rotate-animation ${descOpen ? 'arrow-up' : ''}`} onClick={() => setDescOpen(!descOpen)}/>
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
                <VideoCard data={rv} key={rv.aid}/>
              )
            })
          }
        </div>
        <Comment data={commentListData} pageInfo={pageInfo}/>
      </div>
  )
}

export default withRouter(Video)
