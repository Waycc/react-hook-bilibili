import {useEffect, useLayoutEffect, useState} from "react";
import {clearPageCache} from "./tools";

// 每个使用useState的地方都用这个替换，当action为POP时会检测是否有缓存数据
export function useCacheState(initial, pageKey, stateKey, history, dependence=[]) {
  let [data, setData] = useState(initial);

  useLayoutEffect(() => {
    if (history) {
      if (history.action === 'POP') {
        let pageCache = sessionStorage.getItem(pageKey);
        if (pageCache) {
          pageCache = JSON.parse(pageCache);
          setData(pageCache[stateKey] || initial);
        }
      }
    }
  }, dependence);
  console.log(data, stateKey, pageKey, 'out')

  let getCacheDataMap = () => {
    console.log(data, stateKey, pageKey, 'inner')
    return {[stateKey]: data};
  };

  return [data, setData, getCacheDataMap];
}

export let useClearPageCache = (pageKey, dependence=[]) => {
  useLayoutEffect(() => {
    let clearFunc = clearPageCache(pageKey);
    window.addEventListener('beforeunload', clearFunc);
    return () => window.removeEventListener('beforeunload', clearFunc);
  }, dependence);
};
