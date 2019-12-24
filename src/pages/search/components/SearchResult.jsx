import React, {useState} from "react";
import SearchResultPane from "./SearchResultPane";
import '../style/components/SearchResult.scss'

let tabDatas = [{
  title: '综合',
  type: 'all',
  children: [{
    title: '默认排序',
    order: 'totalrank',
  }, {
    title: '播放多',
    order: 'click',
  }, {
    title: '新发布',
    order: 'pubdate',
  }, {
    title: '弹幕多',
    order: 'dm',
  }],
}, {
  title: '番剧',
  type: 'media_bangumi',
}, {
  title: 'UP主',
  type: 'bili_user',
}, {
  title: '影视',
  type: 'media_ft',
}];

function SearchResult() {
  let [active, setActive] = useState('all');
  let [pageInfo, setPageInfo] = useState({});

  let onHeaderChange = (type) => {
    setActive(type)
  };

  console.log(pageInfo, 'pageInfo')

  return (
    <div>
      <div className={'search-result-header'}>
        {
          tabDatas.map(tabData => {
            let numText = '';
            if (tabData.type !== 'all') {
              let num = (pageInfo[tabData.type] || {}).total || 0
              numText = `(${num})`
            }
            return <div className={`search-result-header-item ${active === tabData.type ? 'selected' : ''}`} onClick={() => onHeaderChange(tabData.type)} key={tabData.title}>
              {tabData.title}{numText}
            </div>
          })
        }
      </div>
      {
        tabDatas.map(tabData => (
          <SearchResultPane tabData={tabData} isActive={tabData.type === active} setPageInfo={setPageInfo} key={tabData.title}/>
        ))
      }
    </div>
  );
}

export default SearchResult;
