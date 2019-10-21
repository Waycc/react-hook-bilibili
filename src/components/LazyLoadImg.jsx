import React, {Fragment, useEffect, useRef} from "react";
import {getPicUrl} from "../util/tools";
import PropTypes from "prop-types";

let defaultProps = {
  style: {},
  src: ''
};

let propTypes = {
  style: PropTypes.object,
  src: PropTypes.string
}

function LazyLoadImg(props) {
  let { style, src, className } = props;
  let imgRef = useRef();
  let hasLoadedRef = useRef(false);
  let timeoutRef = useRef();

  useEffect(() => {
    loadImg();
    window.addEventListener('scroll', loadImg);
    return () => {
      return window.removeEventListener('scroll', loadImg)
    }
  }, [src]);

  let loadImg = () => {
    if (hasLoadedRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isInViewArea()) {
        imgRef.current.src = src;
        hasLoadedRef.current = true
      }
    }, 300)
  };

  let isInViewArea = () => {
    let imgDom = imgRef.current;
    if (!imgDom) return
    let { top } = imgDom.getBoundingClientRect();
    let viewHeight = window.innerHeight;
    return top <= viewHeight
  };

  return (
    <Fragment>
      <img  style={ { width: '100%', height: '100%', ...style }} alt={''} ref={imgRef} src={''} className={className}/>
    </Fragment>
  )
}

LazyLoadImg.defaultProps = defaultProps;
LazyLoadImg.propTypes = propTypes;

export default LazyLoadImg
