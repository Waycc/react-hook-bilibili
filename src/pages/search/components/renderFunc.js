// up主
import React, {Fragment} from "react";
import LazyLoadImg from "../../../components/LazyLoadImg";
import {getPicUrl, isEmpty, numberToW} from "../../../util/tools";
import {Link} from "react-router-dom";

export let renderUser = (data) => {
  return (
    <Fragment>
      {
        data.map(d => {
          return (
            <div className={'bili-user-item'} key={d.id}>
              <div className={'user-icon'}>
                <LazyLoadImg src={getPicUrl(d.upic, '@320w_200h')}/>
              </div>
              <div className={'user-desc'}>
                <span className={'user-name'}>{d.uname}</span>
                <div className={'user-fans-and-videos'}>
                  <span>粉丝：{numberToW(d.fans)}</span>
                  <span>视频：{numberToW(d.videos)}</span>
                </div>
              </div>
            </div>
          );
        })
      }
      {
        !isEmpty(data) &&
        <div className={'end'}>
          <img src={'static/img/end.png'}/>
          <div>刷到底了哟，从头再来吧 ~</div>
        </div>
      }

    </Fragment>
  );
};

// 影视
export let renderMediaFt = (data) => {
};

// 番剧
export let renderMediaBangumi = (data) => {
};

// 综合的所有排序
export let renderOrder = (data) => {
  return (
    <Fragment>
      {
        data.map(d => (
          <Link className={'search-all-item'} key={d.id} to={'/video/' + d.id}>
            <div className={'video-cover'}>
              <LazyLoadImg src={getPicUrl(d.pic, '@480w_300h')}/>
            </div>
            <div className={'video-desc'}>
              <div className={'video-title'} key={d.id} dangerouslySetInnerHTML={{__html: d.title}}/>
              <div className={'video-author'}><img src={'static/img/ico_up.png'} className={'icon'}/>{d.author}</div>
              <div className={'play-and-danmushu'}>
                <span><img src={'static/img/ico_play.png'} className={'icon'}/>{numberToW(d.play)}</span>
                <span><img src={'static/img/ico_danmu.png'} className={'icon'}/>{numberToW(d.video_review)}</span>
              </div>
            </div>
          </Link>))
      }
      {
        !isEmpty(data) &&
        <div className={'end'}>
          <img src={'static/img/end.png'}/>
          <div>刷到底了哟，从头再来吧 ~</div>
        </div>
      }
    </Fragment>
  );
};
