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
