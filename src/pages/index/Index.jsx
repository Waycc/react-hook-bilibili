import React, {useEffect, useState} from 'react';
import ChannelBar from "../../components/ChannelBar";
import Carousel from "../../components/Carousel";
import Api from '../../api/index';
import VideoCard from "../../components/VideoCard";
import './style/index.scss';
import {clearPageCache, getPicUrl, ifFetch, setCacheData} from "../../util/tools";
import {useCacheState, useClearPageCache} from "../../util/customHook";

export default function Index(props) {
  let pageKey = 'index';
  let history = props.history;
  let [locData, setLocData, getCacheLocDataMap] = useCacheState([], pageKey, 'locData', history);
  let [rankingData, setRankingData, getCacheRankingDataMap] = useCacheState([], pageKey, 'rankingData', history);

  useClearPageCache(pageKey);

  useState(async () => {
    ifFetch(async () => {
      let locData = await Api.fetchLoc();
      setLocData(locData.data);
    }, history, pageKey);
  }, [locData, history]);

  useState(async () => {
    ifFetch(async () => {
      let rankingIndex = await Api.fetchIndexRanking();
      setRankingData(rankingIndex.data);
    }, history, pageKey);
  }, [rankingData, history]);

  let cacheData = () => {
    setCacheData('index', [getCacheLocDataMap, getCacheRankingDataMap]);
  };

  return (
    <div className={'channel-index video-card-area'}>
      <ChannelBar cacheData={cacheData}/>
      <Carousel>
        {
          locData.map(imgItem => {
            return (
              <a href={imgItem.url} key={imgItem.id}>
                <img alt='' src={getPicUrl(imgItem.pic, "@480w_300h")}/>
              </a>
            );
          })
        }
      </Carousel>
      <div className={'index-video-area-container'}>
        {
          rankingData.map(rkData => {
            return (
              <VideoCard data={rkData} key={rkData.aid} cacheData={cacheData}/>
            );
          })
        }
      </div>
    </div>
  );
}
