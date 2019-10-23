import PropTypes from "prop-types";
import React from "react";
import {isEmpty} from "../../util/tools";
import CommentListItem from "../../components/CommentListItem";
import './style/comment.scss'

let propTypes = {
  data: PropTypes.object,
  pageInfo: PropTypes.object,
}

let defaultProps = {
  data: {},
  pageInfo: {},
};

function Comment(props) {
  let { data, pageInfo } = props;
  return (
    <div className={'comment-list-container'}>
      <div className={'comment-top-title'}>
        评论
        <span className={'total-num'}>（{pageInfo.acount || 0}）</span>
      </div>
      {
        isEmpty(data) ? <span>加载中...</span> :
          data.map(d => {
            return (
              <CommentListItem data={d} key={d.rpid}/>
            )
          })
      }
    </div>
  )
}

Comment.propTypes = propTypes;
Comment.defaultProps = defaultProps;

export default Comment
