import { get, set } from 'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval.mjs'

import { generateColorWheel } from './color-wheel.js'

const c = document.getElementById('c')
const ctx = c.getContext('2d')
get('canvas').then(imageData => {
  if (imageData) {
    ctx.putImageData(imageData, 0, 0)
    ctx.strokeStyle = localStorage.getItem('strokeStyle')
    ctx.lineWidth = parseInt(localStorage.getItem('lineWidth'))
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }
})
const scale = window.devicePixelRatio
const colorWheelRadius = 100
const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
  '#000000',
  '#FFFFFF',
]

const { colorWheel, handleRotate, showColorWheel, hideColorWheel } = generateColorWheel(
  colors,
  colorWheelRadius,
  localStorage.getItem('strokeStyle'),
)
document.body.appendChild(colorWheel)

function onResize() {
  const imageData = ctx.getImageData(0, 0, c.width, c.height)
  c.width = window.innerWidth * scale
  c.height = window.innerHeight * scale
  ctx.putImageData(imageData, 0, 0)
}

function handleColorWheel(x, y) {
  const radius = Math.sqrt(x * x + y * y)
  const { strokeStyle, lineWidth } = handleRotate(x, y, radius)
  localStorage.setItem('strokeStyle', strokeStyle)
  localStorage.setItem('lineWidth', lineWidth)
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

document.body.onresize = () => {
  onResize()
}

document.body.ontouchstart = e => {
  switch (e.touches.length) {
    case 1: {
      ctx.beginPath()
      ctx.moveTo(e.touches[0].clientX * scale, e.touches[0].clientY * scale)
      break
    }
    case 2: {
      showColorWheel(
        (e.touches[0].clientX + e.touches[1].clientX) >> 1,
        (e.touches[0].clientY + e.touches[1].clientY) >> 1,
        (e.touches[0].clientX - e.touches[1].clientX) >> 1,
        (e.touches[1].clientY - e.touches[0].clientY) >> 1,
      )
      break
    }
  }
}

const lastTouches = []
const delay = 2

document.body.ontouchmove = e => {
  switch (e.touches.length) {
    case 1: {
      if (lastTouches[delay - 1] === 1) {
        ctx.lineTo(e.touches[0].clientX * scale, e.touches[0].clientY * scale)
        ctx.stroke()
      }
      break
    }
    case 2: {
      const x = e.touches[0].clientX - e.touches[1].clientX
      const y = e.touches[1].clientY - e.touches[0].clientY
      handleColorWheel(x >> 1, y >> 1)
      break
    }
  }
  lastTouches.unshift(e.touches.length)
  lastTouches.splice(delay)
}

document.body.ontouchend = document.body.ontouchcancel = e => {
  hideColorWheel()
  ctx.moveTo(e.clientX * scale, e.clientY * scale)
  set('canvas', ctx.getImageData(0, 0, c.width, c.height))
  lastTouches.splice(0, lastTouches.length)
}

document.body.onmousedown = e => {
  switch (e.buttons) {
    case 1: {
      ctx.beginPath()
      ctx.moveTo(e.clientX * scale, e.clientY * scale)
      break
    }
    case 2: {
      showColorWheel(
        e.clientX,
        e.clientY,
        e.clientX - colorWheel.offsetLeft - colorWheelRadius,
        -(e.clientY - colorWheel.offsetTop - colorWheelRadius),
      )
      break
    }
  }
}

document.body.onmousemove = e => {
  switch (e.buttons) {
    case 1: {
      ctx.lineTo(e.clientX * scale, e.clientY * scale)
      ctx.stroke()
      break
    }
    case 2: {
      const x = e.clientX - colorWheel.offsetLeft - colorWheelRadius
      const y = -(e.clientY - colorWheel.offsetTop - colorWheelRadius)
      handleColorWheel(x, y)
      break
    }
  }
}

document.body.onmouseup = document.body.onmouseleave = e => {
  hideColorWheel()
  ctx.moveTo(e.clientX * scale, e.clientY * scale)
  set('canvas', ctx.getImageData(0, 0, c.width, c.height))
}

document.body.oncontextmenu = e => {
  e.preventDefault()
}

window.onload = () => {
  document.addEventListener(
    'touchstart',
    event => {
      event.preventDefault()
    },
    { passive: false },
  )
}

onResize()
