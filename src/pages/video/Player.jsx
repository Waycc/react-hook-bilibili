// 原本是想自定义video的播放栏，但发现移动端似乎很难定制，放弃了
import React, {Fragment, useEffect, useRef, useState} from "react";
import {getPicUrl, isEmpty} from "../../util/tools";
import TVPauseIcon from "../../public/img/TV-Pause .svg";
import TVPlayIcon from "../../public/img/TV-Play.svg";
import {VIDEO_MP4_URL} from "../../api/url";
import PropTypes from "prop-types";
import './style/player.scss'

let propTypes = {
  videoInfo: PropTypes.object,
  className: PropTypes.string
}

let defaultProps = {
  videoInfo: {},
  className: 'player-container',
}

function getVideoUrl(url) {
  // 拼接播放源地址
  if (url.startsWith('https')) {
    return `${VIDEO_MP4_URL}?video=${encodeURIComponent(url)}`
  }
  return `${VIDEO_MP4_URL}?video=https:${encodeURIComponent(url)}`;
}

function Player(props) {
  let {videoInfo, className} = props;
  let videoRef = useRef();
  let [barrageOn, setBarrageOn] = useState(true);
  let [isPlay, setIsPlay] = useState(false);
  let [isShowCover, setIsShowCover] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      if (isPlay) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlay]);

  let onPlayOrPause = () => {
    setIsPlay(isPlay => !isPlay);
    setIsShowCover(false)
  };

  return (
    <div className={className}>
      {
        // 有数据再请求，要不会出现裂开的图片
        !isEmpty(videoInfo) &&
        <Fragment>
          <video
            height="100%"
            width="100%"
            preload="auto"
            x5-playsinline="true"
            webkit-playsinline="true"
            playsInline={true}
            ref={videoRef}
            controls
            style={{ display: isShowCover ? 'none' : "block"}}
          >
            <source src={getVideoUrl(videoInfo.initUrl)} type={'video/mp4'}/>
          </video>

          { isShowCover && <img src={getPicUrl(videoInfo.pic, "@480w_300h")} className={'cover-img'}/> }
          <div className={'play-or-pause'} onClick={onPlayOrPause} style={{ display: isShowCover ? 'block' : 'none'}}>
            {
              isPlay ? <TVPauseIcon className={'icon'}/> : <TVPlayIcon className={'icon'}/>
            }
          </div>
        </Fragment>
      }
    </div>
  )
}

Player.defaultProps = defaultProps;
Player.propTypes = propTypes;

export default Player
