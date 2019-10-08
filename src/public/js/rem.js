;(function () {
  let init = function () {
    let clientWidth = document.documentElement.clientWidth || document.body.clientWidth
    // if (clientWidth > 768) {
    //   clientWidth = 768
    // }
    let fontSize = 24 / 375 * clientWidth;
    document.documentElement.style.fontSize = fontSize + 'px'
  }

  init();
  window.addEventListener('resize', init)
})()
