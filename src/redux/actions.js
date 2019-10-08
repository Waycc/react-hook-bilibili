import actionTypes from './action_types'

export function setChannelBar(channelBar) {
  return { type: actionTypes.SET_CHANNEL_BAR, channelBar }
}

export function fetchChannelBar() {
  return { type: actionTypes.FETCH_CHANNEL_BAR }
}
