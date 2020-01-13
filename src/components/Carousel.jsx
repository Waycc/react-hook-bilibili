import React, {useEffect, useMemo, useRef, useState} from "react";
import './style/carousel.scss';

let defaultProps = {
  infinite: true,
  autoPlay: true,
  interval: 2000,
  duration: 0.3
};

export default function Carousel(props) {
  let {children, interval, duration} = props;
  let [currentIndex, setCurrentIndex] = useState(0);
  let [carouselItems, setCarouselItems] = useState([]);
  let [viewWidth, setViewWidth] = useState(0);
  let carouselItemContainer = useRef();
  let startX = useRef(0);
  let moveDistanceRef = useRef(0);
  let viewWidthRef = useRef();
  let carouselItemsRef = useRef([]);
  let currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;
  carouselItemsRef.current = carouselItems;
  viewWidthRef.current = viewWidth;
  let moving = useRef(false);
  let middleRef = useRef();
  let rightRef = useRef();
  let leftRef = useRef();
  let nextPalyTimeout = useRef(null);
  let autoPalyAnimat = useRef(null);
  let finalMoveAnimat = useRef(null);
  let originCarouselItemsRef = useRef([]);

  useEffect(() => {
    let ele = carouselItemContainer.current;
    ele.addEventListener('touchstart', onTouchStart);
    ele.addEventListener('touchmove', onTouchMove);
    ele.addEventListener('touchend', onTouchEnd);

    return () => {
      ele.removeEventListener('touchstart', onTouchStart);
      ele.removeEventListener('touchmove', onTouchMove);
      ele.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    let carouselItems = React.Children.map(children, child => {
      return React.cloneElement(child, {style: {width: '100%', height: '100%'}});
    });
    originCarouselItemsRef.current = [...carouselItems];
    if (carouselItems.length === 2) {
      carouselItems.push(carouselItems[1]);
    }
    setCarouselItems(carouselItems);
  }, [children]);

  useEffect(() => {
    let onResize = () => {
      setViewWidth(carouselItemContainer.current.offsetWidth);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize)
  }, []);

  useEffect(() => {
    startNextPlay();
  }, []);

  useEffect(() => () => {
    clearTimeout(nextPalyTimeout.current);
    cancelAnimationFrame(finalMoveAnimat.current);
    cancelAnimationFrame(autoPalyAnimat.current);
  }, []);

  let isTwoChildren = () => {
    return originCarouselItemsRef.current.length === 2;
  };

  let startNextPlay = () => {
    clearTimeout(nextPalyTimeout.current);
    nextPalyTimeout.current = setTimeout(autoPlay, interval);
  };

  let autoPlay = () => {
    if (carouselItemsRef.current.length <= 1) return;
    let moveStep = getMoveStep();
    moveDistanceRef.current = moveDistanceRef.current - moveStep;
    moveEle(moveDistanceRef.current);
    if (Math.abs(moveDistanceRef.current) < viewWidthRef.current / 4) {
      requestAnimationFrame(autoPlay);
      return;
    }
    finalMove();
  };

  let getLeftMiddleRightIndex = () => {
    let childrenLength = carouselItemsRef.current.length;
    let currentIndex = currentIndexRef.current;
    let left,
      middle = currentIndex,
      right;
    if (currentIndex === 0) {
      right = currentIndex + 1;
      left = childrenLength - 1;
    } else if (currentIndex === childrenLength - 1) {
      right = 0;
      left = currentIndex - 1;
    } else {
      right = currentIndex + 1;
      left = currentIndex - 1;
    }
    return {left, middle, right};
  };

  let renderCarouselItems = () => {
    let {middle, left, right} = getLeftMiddleRightIndex();
    return carouselItems.map((ci, index) => {
      switch (index) {
        case middle:
          return <div className={'carousel-item'} style={{transform: `translateX(0px)`}} ref={middleRef}>{ci}</div>;
        case left:
          return <div className={'carousel-item'} style={{transform: `translateX(${-viewWidth}px)`}}
                      ref={leftRef}>{ci}</div>;
        case right:
          return <div className={'carousel-item'} style={{transform: `translateX(${viewWidth}px)`}}
                      ref={rightRef}>{ci}</div>;

        default:
          if (index > middle) {
            return <div className={'carousel-item'} style={{transform: `translateX(${viewWidth}px)`}}>{ci}</div>;
          } else {
            return <div className={'carousel-item'} style={{transform: `translateX(${-viewWidth}px)`}}>{ci}</div>;
          }
      }
    });
  };

  let onTouchStart = (e) => {
    e.stopPropagation();
    clearTimeout(nextPalyTimeout.current);
    startX.current = e.touches[0].clientX;
  };

  let onTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (moving.current) return;
    let {clientX} = e.touches[0];
    moveDistanceRef.current = clientX - startX.current;
    moveEle(moveDistanceRef.current);
  };

  let onTouchEnd = (e) => {
    e.stopPropagation();
    if (moving.current) return;
    finalMove();
  };

  let getMoveStep = () => {
    return viewWidthRef.current / (duration * 1000 / 16);
  };

  let moveEle = (distance) => {
    let viewWidth = viewWidthRef.current;
    let middleEle = middleRef.current,
      leftEle = leftRef.current,
      rightEle = rightRef.current;
    if (middleEle) middleEle.style.transform = `translateX(${distance}px)`;
    if (leftEle) leftEle.style.transform = `translateX(${-viewWidth + distance}px)`;
    if (rightEle) rightEle.style.transform = `translateX(${viewWidth + distance}px)`;
  };

  let getCorrectMoveStep = ({moveStep, mouseDirection, isBack}) => {
    if (mouseDirection === 'left' && !isBack) {
      moveStep = -moveStep;
    }
    if (isBack && mouseDirection === 'right') {
      moveStep = -moveStep;
    }
    return moveStep;
  };

  let getCorrectDistance = ({viewWidth, isBack, moveStep, moveDistance, mouseDirection}) => {
    let finalDistance = moveDistance + moveStep;
    if (isBack) {
      if (moveStep < 0 && finalDistance < 0) {
        finalDistance = 0;
      }
      if (moveStep > 0 && finalDistance > 0) {
        finalDistance = 0;
      }
    }

    if (!isBack && Math.abs(finalDistance) > viewWidth) {
      finalDistance = mouseDirection === 'left' ? -viewWidth : viewWidth;
    }
    return finalDistance;
  };

  let handle2Ele = ({nextIndex: middle}) => {
    let currentEle = carouselItemsRef.current[middle];
    let otherEle = carouselItemsRef.current.find((item) => item !== currentEle);
    carouselItemsRef.current.forEach((item, index) => {
      if (middle !== index) {
        carouselItemsRef.current[index] = otherEle;
      }
    });
    setCarouselItems([...carouselItemsRef.current]);
  };

  let finalMove = () => {
    moving.current = true;
    let moveStep = getMoveStep();
    let moveDistance = moveDistanceRef.current;
    let viewWidth = viewWidthRef.current;
    let mouseDirection = moveDistance > 0 ? 'right' : 'left';
    let isBack = carouselItemsRef.current.length <= 1 ? true : Math.abs(moveDistance) < viewWidth / 4;
    let finalDistance, finishWidth;

    moveStep = getCorrectMoveStep({moveStep, mouseDirection, isBack});
    finalDistance = getCorrectDistance({viewWidth, isBack, mouseDirection, moveDistance, moveStep});
    moveEle(finalDistance);
    moveDistanceRef.current = finalDistance;

    finishWidth = isBack ? 0 : viewWidth;
    if (Math.abs(finalDistance) === finishWidth) {
      let {left, middle, right} = getLeftMiddleRightIndex();
      !isBack && setCurrentIndex(currentIndex => {
        let nextIndex = mouseDirection === 'left' ? right : left;
        isTwoChildren() && handle2Ele({nextIndex});
        return nextIndex;
      });
      moveDistanceRef.current = 0;
      moving.current = false;
      startNextPlay();
      // setTimeout(() => handle2Ele({left, middle, right}), 0)
      return;
    }
    finalMoveAnimat.current = requestAnimationFrame(finalMove);
  };

  return (
    <div className={'my-carousel'}>
      <div className={'carousel-item-container'} ref={carouselItemContainer}>
        {renderCarouselItems()}
      </div>
      {
        carouselItems.length === 0 ? null :
          <div className={'carousel-button-wrap '}>
            {
              originCarouselItemsRef.current.map(item => {
                return (
                  <span className={`carousel-button ${item === carouselItems[currentIndex] ? 'selected' : ''}`}/>
                )
              })
            }
          </div>
      }
    </div>
  );
}

Carousel.defaultProps = defaultProps;
