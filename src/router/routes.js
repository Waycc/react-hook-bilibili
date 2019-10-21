import Channel from '../pages/channel/Channel'
import Index from "../pages/index/Index";
import Video from "../pages/video/Video";

export default [
  {
    path: '/index',
    component: Index
  },
  {
    path: '/channel/:rid',
    component: Channel
  },
  {
    path: '/video/:aid',
    component: Video
  }
]
