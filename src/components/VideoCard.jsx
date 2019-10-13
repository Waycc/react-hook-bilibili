import React, {Fragment} from "react";
import './style/video_card.scss'
import {getPicUrl, numberToW} from "../util/tools";
import PropTypes from "prop-types";
import PlayIcon from '../public/img/play-box-outline.svg'
import DanMuShu from '../public/img/danmushu.svg'

let defaultProps = {
  data: [],
}

let propTypes = {
  data: PropTypes.object
}

let VideoCard = function (props) {
  let data = props.data;

  if (data.pic.indexOf("@320w_200h") === -1) {
    data.pic = getPicUrl(data.pic, "@320w_200h");
  }
  return (
    <div className={'video-card-container'}>
      <div className={'img-container'}>
        <img alt={data.title} src={data.pic} style={{ width: '100%', height: '100%' }}/>
        {
          (!!data.play || !!data.video_review )
            ?
          <div className={'play-view-container'}>
            {
              !!data.play &&
              <div>
                <PlayIcon className={'icon'}/>
                <span className={'text'}>{ numberToW(data.play) }</span>
              </div>
            }
            {
              !!data.video_review &&
              <div>
                <DanMuShu className={'icon'}/>
                <span className={'text'}>{ numberToW(data.video_review) }</span>
              </div>
            }
          </div>
            : null
        }
      </div>
      <div className={'title-container'}>
        <p>{data.title}</p>
      </div>
    </div>
  )
}

VideoCard.propTypes = propTypes;
VideoCard.defaultProps = defaultProps;

export default VideoCard
