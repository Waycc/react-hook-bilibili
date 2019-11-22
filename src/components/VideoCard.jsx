import React, {Fragment, useMemo} from "react";
import './style/video_card.scss';
import {getPicUrl, numberToW} from "../util/tools";
import PropTypes from "prop-types";
import PlayIcon from '../public/img/play-box-outline.svg';
import DanMuShu from '../public/img/danmushu.svg';
import {Link, withRouter} from "react-router-dom";
import LazyLoadImg from "./LazyLoadImg";
import TVIcon from '../public/img/tv.svg';

let defaultProps = {
  data: [],
  style: {},
  isRelated: false,
  cacheData() {
  },
};

let propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  isRelated: PropTypes.bool,
  cacheData: PropTypes.func,
};

let VideoCard = function (props) {
  let {style, isRelated, data} = props;

  if (data.pic.indexOf("@320w_200h") === -1) {
    data.pic = getPicUrl(data.pic, "@320w_200h");
  }

  let playNum = isRelated ? data.stat.view : data.play;
  let videoView = isRelated ? data.stat.danmaku : data.video_review;

  let onLinkClick = (path) => {
    props.history.push(path);
    props.cacheData();
  };

  return (
    <div className={'video-card-container'} style={{...style}}>
      <a onClick={() => onLinkClick(`/video/${data.aid}`)} className={'link-to-video'}>
        <div className={'img-container'}>
          <LazyLoadImg src={data.pic} className={'img'}/>
          <TVIcon className={'no-img-icon'}/>
          {
            (!!playNum || !!videoView)
              ?
              <div className={'play-view-container'}>
                {
                  !!playNum &&
                  <div>
                    <PlayIcon className={'icon'}/>
                    <span className={'text'}>{numberToW(playNum)}</span>
                  </div>
                }
                {
                  !!videoView &&
                  <div>
                    <DanMuShu className={'icon'}/>
                    <span className={'text'}>{numberToW(videoView)}</span>
                  </div>
                }
              </div>
              : null
          }
        </div>
        <div className={'title-container'}>{data.title}</div>
      </a>
    </div>
  );
};

VideoCard.propTypes = propTypes;
VideoCard.defaultProps = defaultProps;

export default withRouter(VideoCard);
