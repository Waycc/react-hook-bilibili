import React, {useState} from 'react'
import ChannelBar from "../../components/ChannelBar";
import Carousel from "../../components/Carousel";
import Api from '../../api/index'
import VideoCard from "../../components/VideoCard";
import './style/index.scss'
import {getPicUrl} from "../../util/tools";

export default function Index() {
  let [locData, setLocData] = useState([]);
  let [rankingData, setRankingData] = useState([]);

  useState(async () => {
    let locData = await Api.fetchLoc();
    setLocData(locData.data)
  }, [locData]);

  useState(async () => {
    let rankingIndex = await Api.fetchIndexRanking();
    setRankingData(rankingIndex.data)
  }, [rankingData])

  return (
    <div className={'channel-index video-card-area'}>
      <ChannelBar/>
      <Carousel>
        {
          locData.map(imgItem => {
            return (
              <a href={imgItem.url} key={imgItem.id}>
                <img alt='' src={getPicUrl(imgItem.pic, "@480w_300h")}/>
              </a>
            )
          })
        }
      </Carousel>
      <div className={'index-video-area-container'}>
        {
          rankingData.map(rkData => {
            return (
              <VideoCard data={rkData} key={rkData.aid}/>
            )
          })
        }

      </div>
    </div>
  )
}
