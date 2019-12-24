import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import '../style/components/SearchResultPane.scss';
import api from '../../../api/index';
import {withRouter} from "react-router-dom";
import {renderMediaBangumi, renderMediaFt, renderOrder, renderUser} from "./renderFunc";
import {isEmpty} from "../../../util/tools";

let renderResultFuncs = {
  media_bangumi: renderMediaBangumi,
  bili_user: renderUser,
  media_ft: renderMediaFt,
  renderOrder: renderOrder,
};

let SearchResultPane = withRouter((props) => {
  let {isActive, tabData, setPageInfo} = props;
  let [isRender, setIsRender] = useState(false);
  let [searchResult, setSearchResult] = useState({});
  let [activeOrder, setActiveOrder] = useState('totalrank');
  let [page, setaPage] = useState(1);
  let [pageSize, setPageSize] = useState(20);
  let [fetching, setFeting] = useState(true)

  let locationSearch = props.location.search;
  // let keyword = ''
  // console.log(props)
  let keyword = useMemo(() => locationSearch.split('=')[1] || '', [locationSearch]);

  useLayoutEffect(() => {
    async function getSearchResult() {
      if (!tabData.children && isActive && !isRender) {
        setFeting(true)
        let searchResult = [];
        if (tabData.order && tabData.order === 'totalrank') {
          searchResult = await api.getAllSearchResult({
            pageSize,
            page,
            keyword,
            order: tabData.order,
            searchType: 'all'
          });
        } else {
          searchResult = await api.getTypeSearchResult({pageSize, page, keyword, searchType: tabData.type || 'video', order: tabData.order});
        }
        setIsRender(true);
        let data = searchResult.data || {};
        if (tabData.order === 'totalrank') {
          setPageInfo(data.pageinfo || {});
        }
        setSearchResult(data);
        setFeting(false)
      }
    }

    getSearchResult();
  }, [keyword, page, pageSize, isActive, isRender]);

  useEffect(() => {
    if (!isRender && isActive) {
      setIsRender(true);
      // 请求相关标签内容
    }
  }, [isRender, isActive]);

  let onOrderChange = order => {
    setActiveOrder(order);
  };

  let getVideoData = () => {
    if (tabData.order && tabData.order === 'totalrank') {
      let result = [];
      (searchResult.result || []).forEach(sr => {
        if (sr.result_type === 'video') result = sr.data || [];
      });
      return result;
    }
    return searchResult.result || [];
  };

  let data = getVideoData();
  console.log(fetching, 'data');
  return (
    <div className={`search-result-pane ${isActive ? 'active' : 'inactive'}`}>
      {
        isRender ? (
          tabData.children ?
            <div>
              <div className={'search-result-sub-header'}>
                {
                  tabData.children.map(td => (
                    <div className={`search-result-sub-header-item ${activeOrder === td.order ? 'selected' : ''}`}
                         onClick={() => onOrderChange(td.order)} key={td.title}>
                      {td.title}
                    </div>
                  ))
                }
              </div>
              {
                tabData.children.map(td => (
                  <SearchResultPane isActive={activeOrder === td.order} tabData={td} setPageInfo={setPageInfo}
                                    key={td.title}/>
                ))
              }
            </div>
            :
            isEmpty(data) && !fetching
              ? <div className={'not-found'}>
                <img src={'static/img/notFound.png'}/>
                <div>什么都没有找到啊 T_T</div>
            </div>
              : <div className={'search-result-content'}>
                {
                  !!tabData.order ?
                    renderResultFuncs.renderOrder(data) :
                    renderResultFuncs[tabData.type](data)
                }
              </div>



        ) : null
      }
    </div>
  );
});

SearchResultPane.defaultProps = {
  tabData: {},
  isActive: false,
  setPageInfo() {
  }
};

SearchResultPane.propTypes = {
  tabData: PropTypes.object,
  isActive: PropTypes.bool,
  setPageInfo: PropTypes.func,
};

export default SearchResultPane;
