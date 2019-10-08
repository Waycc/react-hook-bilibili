import React, {useEffect, useRef, useState} from "react";
import './style/carousel.scss'

let startX = 0;

let Carousel = function (props) {
  let innerRef = useRef(null);
  let [viewWidth, setViewWidth] = useState(0);
  let [currentIndex, setCurrentIndex] = useState(1);
  let innerItemsCount = React.Children.count(props.children) + 2;

  useEffect(() => {
    innerRef.current.addEventListener('touchstart', touchStart)
    innerRef.current.addEventListener('touchmove', touchMove)
    innerRef.current.addEventListener('touchend', touchEnd)
    return () => {
      innerRef.current.removeEventListener('touchstart', touchStart)
      innerRef.current.removeEventListener('touchmove', touchMove)
      innerRef.current.removeEventListener('touchend', touchEnd)
    }
  })

  useEffect(()=>{
    let viewWidth = computeEachItemWidth();
    setViewWidth(viewWidth)
  }, [viewWidth]);

  // 计算轮播图可视区域的大小
  let computeEachItemWidth = () => {
    return innerRef.current.offsetWidth / innerItemsCount
  };

  let move = (x) => {
    let moveX = -currentIndex * viewWidth + x;
    innerRef.current.style.transform = `translateX(${moveX}px)`
  }

  let touchStart = (e) => {
    innerRef.current.style.transition = 'none';
    startX = e.changedTouches[0].pageX
  }
  let touchMove = (e) => {
    let x = e.changedTouches[0].pageX;
    move(x - startX)
  }
  let touchEnd = (e) => {
    let endX = e.changedTouches[0].pageX;
    let changeX = endX - startX;
    let restX = viewWidth - Math.abs(changeX);
    innerRef.current.style.transition = 'transform 0.3s'
    if (changeX < 0) {
      if (currentIndex === innerItemsCount - 1) {
        move(0)
      } else {
        move(-viewWidth);
        let nextIndex = ++currentIndex;
        setCurrentIndex(nextIndex)
        if (nextIndex === 3) {
          setTimeout(() => {
            setCurrentIndex(1)
            innerRef.current.style.transform = `translate(-${viewWidth})`
          }, 0)
        }
      }

    } else {
      if (currentIndex === 0) {
        move(0)
      } else {
        move(viewWidth)
        setCurrentIndex(--currentIndex)
      }

    }
    startX = 0
  }

  return (
    <div className={'carousel-outer-container'}>
      <div className={'carousel-wrap'}>
        <div
          ref={innerRef}
          className={'carousel-inner-container'}
          style={{ width: `${100*innerItemsCount}%`}}
        >
          <div style={{ width: viewWidth, height: '100%', display: "inline-block", backgroundColor: '#eee'}}>
            {
              props.children[1]
            }
          </div>
          {
            props.children.map((child, index) => {
              return (
                <div style={{ width: viewWidth, height: '100%', display: "inline-block", backgroundColor: ''}}>
                  {
                    child
                  }
                </div>
              )
            })
          }
          <div style={{ width: viewWidth, height: '100%', display: "inline-block", backgroundColor: 'blue'}}>
            {
              props.children[0]
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default Carousel
