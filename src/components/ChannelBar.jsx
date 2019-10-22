import React, {useCallback, useEffect, useState} from 'react';
import {useMappedState} from "redux-react-hook";
import {Link, withRouter} from 'react-router-dom'
import pathToRegexp from 'path-to-regexp';
import './style/channel_bar.scss'
import {isEmpty} from "../util/tools";
import ArrowDownIcon from '../public/img/arrow down.svg'

let channelPathRe = pathToRegexp('/channel/:rid')

const ChannelBar = function (props) {
  let {channelBarList = [], channelBarMap = {}} = useMappedState(useCallback(state => state.channelBar, []));
  let [channelModalVisible, setChannelModalVisible] = useState(false);

  let match = channelPathRe.exec(props.location.pathname);
  let currentRid = 0;
  if (match) {
    currentRid = parseInt(match[1])
  }
  useEffect(() => {
    let tabDom = document.querySelector('#rid' + currentRid);
    if (tabDom) {
      tabDom.scrollIntoView(true)
    }
    console.log(tabDom, 'tabDom')
  }, [currentRid, channelBarMap])

  let currentChannel = channelBarMap[currentRid] || {};
  // 如果当前所选频道是二级频道，就从一级频道中取出二级频道渲染
  let childChannel = currentChannel.children || [];
  if (!currentChannel.isParent) {
    let parentChannel = channelBarMap[currentChannel.parentId] || {};
    childChannel = parentChannel.children || []
  }
  let isSelected = (rid, channelBar) => {
    return rid === currentRid || (channelBar.childrenIds || []).includes(currentRid)
  };

  let onModalLinkClick = (rid) => {
    setChannelModalVisible(false);
    props.history.push(rid === 0 ? 'index' : `/channel/${rid}`)
  };

  return (
    <div className={'channel-bar-container'}>
      {/*一级频道*/}
      <div className={'first-class-channel-container'}>
        <div className={'tab-bar-container'}>
          <div className={'tab-bar-scroll-container'}>
            {
              channelBarList.map(channelBar => {
                let rid = channelBar.tid;
                return (
                  <Link to={rid === 0 ? '/index' : `/channel/${rid}`} key={rid} className={`first-class-tab-item`} id={`rid${rid}`}>
                    <p className={isSelected(rid, channelBar) ? 'selected-tab' : ''}>{channelBar.typename}</p>
                  </Link>
                )
              })
            }
          </div>
        </div>
        <div className={'arrow-container'} onClick={() => setChannelModalVisible(true)}>
          <ArrowDownIcon/>
        </div>
      </div>
      {/*二级频道*/}
      {
        !isEmpty(childChannel) &&
        <div className={'second-class-channel-container'}>
          <div className={'tab-bar-container'}>
            <div className={'tab-bar-scroll-container'}>
              {
                childChannel.map(childChannel => {
                  let rid = childChannel.tid;
                  return (
                    <Link to={`/channel/${rid}`} key={rid} className={'tab-item'}>
                      <p className={isSelected(rid, childChannel) ? `selected-tab` : ''}>{childChannel.typename}</p>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </div>
      }
      {/*点击下拉按钮时的模态框*/}
      <div className={`fixed-first-class-container ${channelModalVisible ? 'open' : ''}`}>
        <div>
          {
            channelBarList.map(channelBar => {
              let rid = channelBar.tid;
              return (
                <a onClick={() => onModalLinkClick(rid)} key={rid}
                   className={`tab-item ${channelBar.typename.length > 2 ? 'three-word' : ''}`}>
                  <p className={isSelected(rid, channelBar) ? 'selected-tab' : ''}>{channelBar.typename}</p>
                </a>
              )
            })
          }
        </div>
        <div className={'arrow-container'} onClick={() => setChannelModalVisible(false)}>
          <ArrowDownIcon className={'normal-arrow-size arrow-up'}/>
        </div>
      </div>
    </div>
  )
};

export default withRouter(ChannelBar)
