import {PIC_URL} from "../api/url";

export function createChannelBar(data) {
  let partitionList = data.partitionList;
  // 树结构的导航栏
  let indexPartition = {tid: 0, typename: '首页', children: [], isParent: true}
  let channelBarList = [indexPartition];
  // 包含所有导航栏的对象，key为导航的tid
  let channelBarMap = {0: indexPartition};
  Object.keys(partitionList).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
    let isParent = false
    if (parseInt(key) === 0) {
      isParent = true
    }
    partitionList[key].forEach(partition => {
      channelBarMap[partition.tid] = partition;
      partition.isParent = isParent;
      if (parseInt(key) === 0) {
        partition.children = (partitionList[partition.tid] || []).map(childPartition => {
          childPartition.parentId = partition.tid;
          return childPartition
        });
        partition.children.unshift({
          tid: partition.tid,
          typename: '推荐',
          isParent: false,
          parentId: partition.tid
        });
        partition.childrenIds = partitionList[partition.tid].map(child => child.tid)
        channelBarList.push(partition)
      }
    })
  })
  return {
    channelBarList,
    channelBarMap
  }
}

export function isEmpty(obj) {
  let empty = false
  if (!obj || (Array.isArray(obj) && obj.length === 0) || (typeof obj === 'object' && Object.keys(obj).length) === 0) {
    empty = true
  }
  return empty
}

export function getPicSuffix(){
  const terminal = {
    isIOS: /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent),
    isAndroid: /(Android)/i.test(navigator.userAgent)
  }
  let suffix = ".webp";
  if (terminal.isIOS ===  true) {
    suffix = ".jpg";
  } else if (terminal.isAndroid === true) {
    suffix = ".webp";
  } else {
    suffix = ".jpg";
  }
  return suffix;
}

export function getPicUrl(url, format) {
  let suffix = getPicSuffix();
  // picURL + "?pic=" + url + "@480w_300h.webp"
  return `${PIC_URL}?pic=${url}${format + suffix}`;
}

export function numberToW(num, suffix='万') {
  if (num < 10000) return num;
  return `${(num / 10000).toFixed(1)}${suffix}`
}

export const getPubdate = (timestamp) => {
  const publicDate = new Date(timestamp * 1000); // unix时间转换成本地时间戳
  let publicDateStr = "";
  const date = new Date();
  if (publicDate.getFullYear() === date.getFullYear()) {
    if (publicDate.getMonth() === date.getMonth()) {
      const diffDate = date.getDate() - publicDate.getDate();
      switch (diffDate) {
        case 0:
          if (date.getHours() - publicDate.getHours() === 0) {
            publicDateStr = date.getMinutes() - publicDate.getMinutes() + "分钟前";
          } else {
            publicDateStr = date.getHours() - publicDate.getHours() + "小时前";
          }
          break;
        default:
          publicDateStr = publicDate.getMonth() + 1 + "-" + publicDate.getDate();
      }
    } else {
      publicDateStr = publicDate.getMonth() + 1 + "-" + publicDate.getDate();
    }
  } else {
    publicDateStr = publicDate.getFullYear() + "-" +
      (publicDate.getMonth() + 1) + "-" +
      publicDate.getDate();
  }
  return publicDateStr;
};

export let ifFetch = (fetcher, history, pageKey) => {
  if (history.action === 'PUSH' || !sessionStorage.getItem(pageKey)) {
    fetcher()
  }
}

export let setCacheData = (pageKey, funcList) => {
  let cacheMap = funcList.reduce((accumulate, func) => ({...accumulate,  ...func() }), {});
  sessionStorage.setItem(pageKey, JSON.stringify(cacheMap))
};

export let clearPageCache = (pageKey) => () => {
  console.log('清除数据')
  sessionStorage.removeItem(pageKey)
};

export class EventBus{
  eventMap = {};

  getEventList = (name) => {
    return this.eventMap[name] || []
  }

  setEventList = (name, eventList) => {
    this.eventMap[name] = eventList
  }

  on = (name, func) => {
    let eventList = this.getEventList(name);
    eventList.push(func);
    this.setEventList(name, eventList);
  };

  emit = (name, ...params) => {
    let eventList = this.getEventList(name);
    eventList.forEach(func => func(params))
  };

  remove = (name, func) => {
    let eventList = this.getEventList(name);
    eventList = eventList.filter(fun => fun !== func);
    this.setEventList(name, eventList)
  }
}

export let globalEventBus = new EventBus();
