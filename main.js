import { generateColorWheel } from './color-wheel.js'

const c = document.getElementById('c')
const ctx = c.getContext('2d')
const scale = window.devicePixelRatio
const colorWheelRadius = 80
const { colorWheel } = generateColorWheel(colorWheelRadius, color => {
  ctx.strokeStyle = color
})
document.body.appendChild(colorWheel)

function onResize() {
  c.width = window.innerWidth * scale
  c.height = window.innerHeight * scale
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
      colorWheel.style.left = `${(e.touches[0].clientX + e.touches[1].clientX) / 2 -
        colorWheelRadius}px`
      colorWheel.style.top = `${(e.touches[0].clientY + e.touches[1].clientY) / 2 -
        colorWheelRadius}px`
      colorWheel.style.display = 'block'
      break
    }
  }
}

document.body.ontouchmove = e => {
  switch (e.touches.length) {
    case 1: {
      ctx.lineTo(e.touches[0].clientX * scale, e.touches[0].clientY * scale)
      ctx.stroke()
      break
    }
  }
}

document.body.ontouchend = e => {
  colorWheel.style.display = 'none'
}

document.body.onmousedown = e => {
  switch (e.buttons) {
    case 1: {
      ctx.beginPath()
      ctx.moveTo(e.clientX * scale, e.clientY * scale)
      break
    }
    case 2: {
      colorWheel.style.left = `${e.clientX - colorWheelRadius}px`
      colorWheel.style.top = `${e.clientY - colorWheelRadius}px`
      colorWheel.style.display = 'block'
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
  }
}

document.body.onmouseup = e => {
  switch (e.button) {
    case 2: {
      colorWheel.style.display = 'none'
      break
    }
  }
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
