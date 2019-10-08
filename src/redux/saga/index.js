import { call, put, takeLatest } from 'redux-saga/effects'
import Api from '../../api/index'
import {setChannelBar} from "../actions";
import actionTypes from '../action_types'
import {createChannelBar} from "../../util/tools";

function* fetchChannelBar() {
  const result = yield call(Api.fetchChannelBar);
  let channelBar = {};
  if (result.success) {
    channelBar = createChannelBar(result.data);
  }
  yield put(setChannelBar(channelBar))
}


function* mySaga() {
  yield takeLatest(actionTypes.FETCH_CHANNEL_BAR, fetchChannelBar)
}

export default mySaga
