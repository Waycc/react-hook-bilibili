import React, {Fragment, useRef, useState} from "react";
import {getPicUrl, isEmpty} from "../../util/tools";
import BarrageOnIcon from "../../public/img/Icon_Barrage-On.svg";
import BarrageOffIcon from "../../public/img/Icon_Barrage-Off.svg";
import FullScreenIcon from "../../public/img/Icon_Fullscreen.svg";
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
  return `${VIDEO_MP4_URL}?video=https:${encodeURIComponent(url)}`;
}

function Player(props) {
  let {videoInfo, className} = props;
  let videoRef = useRef();
  let [barrageOn, setBarrageOn] = useState(true);
  let [isPlay, setIsPlay] = useState(false);

  return (
    <div className={className}>
      {
        // 有数据再请求，要不会出现裂开的图片
        !isEmpty(videoInfo) &&
        <Fragment>
          <video
            ref={videoRef}
            height="100%"
            width="100%"
            preload="auto"
            playsinline={true}
            // controls={true}
            src={getVideoUrl(videoInfo.initUrl)}
          />
          <img src={getPicUrl(videoInfo.pic, "@480w_300h")} className={'cover-img'}/>
          <div className={'control-container'}>
            <div>
              <span>00:00</span>
              <span className={'bias'}>/</span>
              <span>03:48</span>
            </div>
            <div>
              <div className={'control-slider-container'}>
                <div className={'active-slider'}/>
              </div>
            </div>
            <div className={'icon-container'}>
              {
                barrageOn ? <BarrageOnIcon className={'icon'}/> :
                  <BarrageOffIcon className={'icon'}/>
              }
              <FullScreenIcon className={'icon'}/>
            </div>
          </div>
          <div className={'play-or-pause'}>
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
