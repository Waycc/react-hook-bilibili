import Channel from '../pages/channel/Channel'
import Index from "../pages/index/Index";

export default [
  {
    path: '/index',
    component: Index
  },
  {
    path: '/channel/:rid',
    component: Channel
  }
]
