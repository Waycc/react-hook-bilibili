import Channel from '../pages/channel/Channel'
import Index from "../pages/index/Index";
import Video from "../pages/video/Video";
import Search from "../pages/search/Search";

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
  },
  {
    path: '/search',
    component: Search
  }
]
