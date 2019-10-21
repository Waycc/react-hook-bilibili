import React, {Children, useCallback, useEffect, useRef, useState} from "react";
import './style/carousel.scss';

let defaultProps = {
  infinite: true,
  autoPlay: true,
  autoPlayTime: 2000,
  duration: 0.3
};

let Carousel = function (props) {
  let innerRef = useRef(null);
  let startXRef = useRef(0);
  let timeOutRef = useRef(null);
  let movingRef = useRef(false);
  let [viewWidth, setViewWidth] = useState(0);
  let [autoPlay, setAutoPlay] = useState(props.autoPlay);
  let [currentIndex, setCurrentIndex] = useState(1);
  let [innerItems, setInnerItems] = useState(null); // 经过处理后的元素

  let childrenCount = React.Children.count(props.children);
  let innerItemsCount = childrenCount > 1 ? childrenCount + 2 : childrenCount;
  let infiniteSlide = childrenCount > 1 ? props.infinite : false;
  let autoPlayTime = props.autoPlayTime;
  let duration = props.duration + 's';
  let innerWidth = innerRef.current && innerRef.current.offsetWidth || 0

  let startAutoPlay = () => {
    setAutoPlay(true)
  };

  let stopAutoPlay = () => {
    clearTimeout(timeOutRef.current)
    setAutoPlay(false)
  };

  // 自动播放轮播图
  useEffect(() => {
    if (autoPlay && viewWidth && childrenCount > 1) {
      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      timeOutRef.current = setTimeout(() => {
        innerRef.current.style.transition = 'none';
        move(0);
        setTimeout(() => {
          finalMove('left', viewWidth, viewWidth / 2);
        }, 0);
      }, autoPlayTime);
    }
    return () => {
      clearTimeout(timeOutRef.current)
    }
  });

  useEffect(() => {
    innerRef.current.addEventListener('touchstart', touchStart);
    innerRef.current.addEventListener('touchmove', touchMove);
    innerRef.current.addEventListener('touchend', touchEnd);
    window.addEventListener('resize', computeEachItemWidth)
    if (childrenCount === 1) {
      setCurrentIndex(0);
    }
    return () => {
      innerRef.current.removeEventListener('touchstart', touchStart);
      innerRef.current.removeEventListener('touchmove', touchMove);
      innerRef.current.removeEventListener('touchend', touchEnd);
      window.removeEventListener('resize', computeEachItemWidth)
    };
  });

  // 获取可视区域大小
  useEffect(() => {
    computeEachItemWidth();
  }, [innerItemsCount]);

  // 第一次进入时初始化图片位置
  useEffect(() => {
    if (viewWidth) {
      let index = childrenCount <= 1 ? 0 : 1;
      move(0, index);
    }
  }, [viewWidth, props.children]);

  useEffect(() => {
    // 将原来的children中的第一个元素和最后一个元素，分别复制后放在末尾和头部，方便无限轮播
    if (viewWidth) {
      let firstEle = null;
      let lastEle = null;

      let newChildren = React.Children.map(props.children, (child, index) => {
        child = React.cloneElement(child, {style: {width: '100%', height: '100%', display: 'inline-block'}});
        let innerItem = (
          <div key={index + 1} style={{width: viewWidth}} className={'carousel-item'}>
            {child}
          </div>
        );
        if (index === 0 && childrenCount > 1) firstEle = React.cloneElement(innerItem, {key: 0});
        if (index === childrenCount - 1 && childrenCount > 1) lastEle = React.cloneElement(innerItem, {key: childrenCount + 1});
        return innerItem;
      });
      let innerItems = [lastEle, ...newChildren, firstEle];
      setInnerItems(innerItems);
    }
  }, [viewWidth, props.children]);

  // 计算轮播图可视区域的大小
  let computeEachItemWidth = () => {
    let viewWidth = innerRef.current.offsetWidth / innerItemsCount;
    if (!innerItemsCount) {
      viewWidth = 0;
    }
    setViewWidth(viewWidth);
  };

  // 屏幕触摸时的移动
  let move = (x, index) => {
    index = index || currentIndex;
    let moveX = -(index * viewWidth) + x;
    innerRef.current.style.transform = `translateX(${moveX}px)`;
  };

  // 触摸结束后，整个图片的移动
  let finalMove = (direction, distance, changeX) => {
    movingRef.current = true;
    innerRef.current.style.transition = `transform ${duration}`;
    let nextIndex = direction === 'left' ? currentIndex + 1 : currentIndex - 1;
    distance = Math.abs(distance);
    if (nextIndex > innerItemsCount - 1 || nextIndex < 0 || Math.abs(changeX) < viewWidth / 4) {
      nextIndex = currentIndex;
      distance = 0;
    }
    if (direction === 'left') {
      move(-distance);
    } else {
      move(distance);
    }
    if (infiniteSlide) {
      if (nextIndex === 0) {
        setPosition(innerItemsCount - 2);
      }
      if (nextIndex === innerItemsCount - 1) {
        setPosition(1);
      }
    }
    setCurrentIndex(nextIndex);
    movingRef.current = false;
  };

  let setPosition = (nextIndex) => {
    setTimeout(() => {
      // 设置正确索引，下一次touchStart事件触发时，会正确设置translateX的值
      // innerRef.current.style.transition = 'none';
      setCurrentIndex(nextIndex);
      // move(0, nextIndex)
    }, 0);
  };

  let touchStart = (e) => {
    e.stopPropagation();
    stopAutoPlay();
    innerRef.current.style.transition = 'none';
    startXRef.current = e.changedTouches[0].pageX;
    move(0);
  };

  let touchMove = (e) => {
    e.stopPropagation()
    e.preventDefault()
    let x = e.changedTouches[0].pageX;
    move(x - startXRef.current);
  };

  let touchEnd = (e) => {
    e.stopPropagation()
    let endX = e.changedTouches[0].pageX;
    let changeX = endX - startXRef.current;
    // 触摸滑动方向
    let direction = changeX < 0 ? 'left' : 'right';
    finalMove(direction, viewWidth, changeX);
    startXRef.current = 0;
    startAutoPlay()
  };

  console.log(childrenCount, 'childrenCount')
  return (
    <div className={'carousel-outer-container'} >
      <div className={'carousel-wrap'}>
        <div
          ref={innerRef}
          className={'carousel-inner-container'}
          style={{width: `${100 * innerItemsCount}%`}}
        >
          {innerItems}
        </div>
      </div>
      {
        childrenCount === 0 ? null :
        <div className={'carousel-button-wrap '}>
          {
            [...new Array(childrenCount).keys()].map(key => {
              key = childrenCount > 1 ? key + 1 : key;
              return (
                <span key={key} className={`carousel-button ${currentIndex === key ? 'selected' : ''}`}/>
              )
            })
          }
        </div>
      }
    </div>
  );
};

Carousel.defaultProps = defaultProps;

export default Carousel;
