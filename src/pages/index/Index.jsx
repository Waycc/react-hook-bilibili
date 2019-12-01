import React, {useCallback, useEffect, useState} from 'react';
import ChannelBar from "../../components/ChannelBar";
import Carousel from "../../components/Carousel";
import Api from '../../api/index';
import VideoCard from "../../components/VideoCard";
import './style/index.scss';
import {clearPageCache, getPicUrl, globalEventBus, ifFetch, setCacheData} from "../../util/tools";
import {useCacheState, useClearPageCache} from "../../util/customHook";
import {CACHE_PAGE} from "../../util/constants";

export default function Index(props) {
  let pageKey = 'index';
  let history = props.history;
  let [locData, setLocData, getCacheLocDataMap] = useCacheState([], pageKey, 'locData', history);
  let [rankingData, setRankingData, getCacheRankingDataMap] = useCacheState([], pageKey, 'rankingData', history);

  useClearPageCache(pageKey);

  let cacheData = useCallback(() => {
    setCacheData('index', [getCacheLocDataMap, getCacheRankingDataMap]);
  }, [getCacheLocDataMap, getCacheRankingDataMap]);

  useEffect(() => {
    globalEventBus.on(CACHE_PAGE, cacheData);
    return () => globalEventBus.remove(CACHE_PAGE, cacheData)
  }, [cacheData]);

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
