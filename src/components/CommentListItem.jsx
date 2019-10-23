import PropTypes from "prop-types";
import React from "react";
import LazyLoadImg from "./LazyLoadImg";
import {getPicUrl, getPubdate} from "../util/tools";
import './style/commentListItem.scss'
import NoFaceIcon from '../public/img/noface.svg'

let propTypes = {
  data: PropTypes.object
}

let defaultProps = {
  data: {},
}

function CommentListItem(props) {
  let { data } = props;
  return (
    <div className={'comment-list-item-container'}>
      <div className={'user-avatar-container'}>
        <NoFaceIcon className={'no-avatar'}/>
        <LazyLoadImg className={'avatar'} src={getPicUrl(data.member.avatar, "@320w_200h")}/>
      </div>
      <div className={'user-name-comment-container'}>
        <div className={'user-name-container'}>
          <span className={'user-name'}>{data.member.uname}</span>
          <span className={'comment-publish-date'}>{getPubdate(data.ctime)}</span>
        </div>
        <div className={'comment-container'}>
          <span>{data.content.message}</span>
        </div>
      </div>
    </div>
  )
}

CommentListItem.propTypes = propTypes;
CommentListItem.defaultProps = defaultProps;

export default CommentListItem
