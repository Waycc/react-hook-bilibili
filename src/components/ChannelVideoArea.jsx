// 除了主页外的其他channel使用这个组件，根据不同的type生成不同的视频区
// 比如推荐区，MAD·AMV区

import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import './style/channel_video_area.scss'
import VideoCard from "./VideoCard";
import {isEmpty} from "../util/tools";
import {Link} from "react-router-dom";
import RithIcon from '../public/img/right.svg'

let defaultProps = {
  data: {},
  currentPage: 1,
  fetchFunc: () => {},
  isParent: true,
}

let propTypes = {
  data: PropTypes.object,
  currentPage: PropTypes.number,
  fetchFunc: PropTypes.func,
  isParent: PropTypes.bool
}

let ChannelVideoArea = function (props) {
  let [ videos, setVideos ] = useState([]);
  let { typename, fetchFunc, limit, tid, currentPage, loadMoreComponent } = props.data;
  let { isParent } = props;

  useEffect(() => {
    async function fetchData() {
      let videoData = await fetchFunc({rid: tid, page: currentPage});
      if (currentPage) {
        setVideos(videos.concat(videoData.data))
        return
      }
      setVideos(videoData.data || [])
    }
    fetchData()
  }, [tid, currentPage]);

  if (limit) {
    videos = videos.slice(0, limit)
  }

  return (
    <div className={'channel-video-area'}>
      <div className={'top-type-title-container'}>
        <div className={'title'}>{typename === '推荐' ? '热门推荐' : typename}</div>
        <div className={'title-right'}>
          {
            isParent &&
            <Link to={'/channel/' + tid}>
              <div className={'text'}>查看更多</div>
              <div style={{ display: 'inline-block'}}><RithIcon className={'arrow-right'}/></div>
            </Link>
          }
        </div>
      </div>
      <div className={'video-container'}>
        {
          isEmpty(videos) ?
            <div className={'loading-container'}>加载中...</div>
            :
            videos.map(video => {
              return <VideoCard data={video} key={video.aid}/>
            })
        }
      </div>
      {
        loadMoreComponent
      }
    </div>
  )
};

ChannelVideoArea.defaultProps = defaultProps;
ChannelVideoArea.propTypes = propTypes;

export default ChannelVideoArea
