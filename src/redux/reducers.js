import { combineReducers } from "redux";
import actionTypes from './action_types'

const initState = {
  channelBar: {}
}

export function channelBarReducer(channelBar=initState.channelBar, action) {
  switch (action.type) {
    case actionTypes.SET_CHANNEL_BAR:
      return action.channelBar
    default:
      return channelBar
  }
}

export default combineReducers({
  channelBar: channelBarReducer
})
