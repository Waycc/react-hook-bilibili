import PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import {isEmpty} from "../../util/tools";
import CommentListItem from "../../components/CommentListItem";
import './style/comment.scss'
import api from "../../api";

let propTypes = {
  data: PropTypes.array,
  pageInfo: PropTypes.object,
}

let defaultProps = {
  data: [],
  pageInfo: {},
};

function Comment(props) {
  let { aid } = props;
  let [currentPage, setCurrentPage] = useState(1);
  let [commentListData, setCommentListData] = useState([]); // 评论列表
  let [pageInfo, setPageInfo] = useState({}); // 分页信息
  let loadingRef = useRef(false);

  let resetState = () => {
    setCurrentPage(1)
    setCommentListData([])
    setPageInfo({})
  };

  // aid改变代表切换了另一个视频
  useEffect(() => {
    resetState();
  }, [aid]);

  useEffect(() => {
    loadingRef.current = true;
    let _ = async () => {
      let result = await getCommentData(aid, currentPage);
      let data = result.data || {};
      let replies = data.replies || [];
      let pageInfo = data.page || {};
      setCommentListData(commentListData => commentListData.concat(replies));
      setPageInfo(pageInfo)
      loadingRef.current = false
    };
    _()
  }, [aid, currentPage]);

  // 通过传参而不是直接用aid和commentPage， 是方便监听scroll事件时用最新的参数去请求评论
  async function getCommentData(aid, commentPage) {
    return  await api.fetchCommentData({ aid, pn: commentPage});
  }

  let onLoadMoreComment = () => {
    if (!loadingRef.current) {
      setCurrentPage(currentPage => currentPage + 1)
    }
  }

  return (
    <div className={'comment-list-container'}>
      <div className={'comment-top-title'}>
        评论
        <span className={'total-num'}>（{pageInfo.acount || 0}）</span>
      </div>
      <div>
        {
          isEmpty(commentListData) ? <span>加载中...</span> :
            commentListData.map(d => {
              return (
                <CommentListItem data={d} key={d.rpid}/>
              )
            })
        }
      </div>
      {
        !isEmpty(commentListData) &&
        <div className={'load-more-container'} onClick={onLoadMoreComment}>
          <span>点击加载更多</span>
        </div>
      }
    </div>
  )
}

Comment.propTypes = propTypes;
Comment.defaultProps = defaultProps;

export default Comment
