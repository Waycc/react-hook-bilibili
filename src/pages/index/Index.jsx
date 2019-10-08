import React from 'react'
import ChannelBar from "../../components/ChannelBar";
import Carousel from "../../components/Carousel";

export default function Index() {
    return (
        <div>
            <ChannelBar/>
          <Carousel>
            <img style={{ width: 200, position: "relative" }} src={'http://i0.hdslb.com/bfs/archive/6c1948116cee176f9d1ab49665840be10d9404d9.jpg'}/>
            <img style={{ width: 200, position: "relative" }} src={'http://i0.hdslb.com/bfs/archive/9ed81592389c6827a419427c1e33af35a53e0139.jpg'}/>
          </Carousel>
            Index
        </div>
    )
}
