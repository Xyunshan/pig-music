export function addClass(el, className) {
  if (el.classList.contains(className)) {
    return
  } else {
    el.classList.add(className)
  }
}
export function removeClass(el, className) {
  if (!el.classList.contains(className)) {
    return
  } else {
    el.classList.remove(className)
  }
}
// 对动画做兼容处理
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
