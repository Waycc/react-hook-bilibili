import React, {Fragment} from "react";
import './style/video_card.scss'
import {getPicUrl} from "../util/tools";

let defaultProps = {
  data: [],
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
      </div>
      <div className={'title-container'}>
        <p>{data.title}</p>
      </div>
    </div>
  )
}

export default VideoCard
