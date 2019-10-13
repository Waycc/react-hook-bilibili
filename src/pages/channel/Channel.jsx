import React, {useCallback, useEffect, useState} from "react";
import ChannelBar from "../../components/ChannelBar";
import {withRouter} from "react-router-dom";
import {useMappedState} from "redux-react-hook";
import pathToRegexp from "path-to-regexp";
import ChannelVideoArea from "../../components/ChannelVideoArea";
import {fetchArchiveRank, fetchRankingRegion} from "../../api/ranking";
import './style/channel.scss'

let channelPathRe = pathToRegexp('/channel/:rid');

function Channel(props) {
  let {channelBarList = [], channelBarMap = {}} = useMappedState(useCallback(state => state.channelBar, []));
  let [videoAreasDatas, setVideoAreaDatas] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);

  let match = channelPathRe.exec(props.location.pathname);
  let currentRid = 0;
  if (match) {
    currentRid = parseInt(match[1])
  }

  let currentChannel = channelBarMap[currentRid];

  useEffect(() => {
    if (currentChannel) {
      if (currentChannel.isParent) {
        genVideoAreasWhenIsParent()
      } else {
        genVideoAreasWhenIsChild()
      }
    }
  }, [currentRid, channelBarMap]);

  let genVideoAreasWhenIsParent = () => {
    let videoAreasDatas = [];
    currentChannel.children.forEach(child => {
      videoAreasDatas.push({
        ...child,
        fetchFunc: fetchRankingRegion,
        typename: child.typename,
        limit: 4,
      })
    });
    setVideoAreaDatas(videoAreasDatas)
  };

  let genVideoAreasWhenIsChild = () => {
    let videoAreasDatas = [
      {
        ...currentChannel,
        fetchFunc: fetchRankingRegion,
        typename: '热门推荐',
        tid: currentChannel.tid,
        // 每一块区域显示的视频数量
        limit: 4,
      },
      {
        ...currentChannel,
        fetchFunc: fetchArchiveRank,
        typename: '最新视频',
        tid: currentChannel.tid,
        limit: false,
      }
    ];
    setVideoAreaDatas(videoAreasDatas)
  };

  return (
    <div className={'channel-container'}>
      <ChannelBar/>
      {
        videoAreasDatas.map(videoAreaData => {
          return <ChannelVideoArea
            key={videoAreaData.typename + videoAreaData.tid}
            data={videoAreaData}
            currentPage={currentPage}
            isParent={currentChannel.isParent}
          />
        })
      }
    </div>
  )
}

export default withRouter(Channel)
