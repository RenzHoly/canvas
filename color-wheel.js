export function generateColorWheel(colors, radius) {
  const borderWidth = radius / 8
  const arrowSize = 20
  const colorWheel = document.createElement('div')
  colorWheel.style.display = 'none'
  colorWheel.style.position = 'fixed'
  const wheel = document.createElement('div')
  wheel.style.transformOrigin = `${radius}px ${radius}px`
  colorWheel.appendChild(wheel)
  for (const index in colors) {
    const sector = document.createElement('div')
    sector.style.position = 'absolute'
    sector.style.background = colors[index]
    sector.style.width = `${radius << 1}px`
    sector.style.height = `${radius << 1}px`
    sector.style.borderRadius = '100%'
    sector.style.transform = `rotate(${(index * 360) / colors.length - 135}deg)`
    const deg45 = Math.PI / 4
    const percentage = (Math.tan(deg45) - Math.tan(deg45 - (2 * Math.PI) / colors.length)) * 50
    sector.style.webkitClipPath = sector.style.clipPath = `polygon(50% 50%, 0% 0%, ${percentage}% 0%)`
    wheel.appendChild(sector)
  }
  const arrow = document.createElement('div')
  arrow.style.position = 'absolute'
  arrow.style.left = `${radius - arrowSize}px`
  arrow.style.top = `-${arrowSize}px`
  arrow.style.width = 0
  arrow.style.height = 0
  arrow.style.borderLeft = `${arrowSize}px solid transparent`
  arrow.style.borderRight = `${arrowSize}px solid transparent`
  colorWheel.appendChild(arrow)
  const center = document.createElement('div')
  center.style.position = 'absolute'
  center.style.background = 'white'
  center.style.left = `${(radius >> 1) - borderWidth}px`
  center.style.top = `${(radius >> 1) - borderWidth}px`
  center.style.width = `${radius}px`
  center.style.height = `${radius}px`
  center.style.border = `solid ${borderWidth}px white`
  center.style.borderRadius = '100%'
  colorWheel.appendChild(center)
  let color
  let angleOffset = 0
  let angleLast = 0
  let angle = 0
  return {
    colorWheel,
    handleRotate(x, y, r) {
      angle = (Math.atan2(y, x) / Math.PI - angleOffset + angleLast) % 2
      const index = (Math.floor((angle / 2) * colors.length) + colors.length) % colors.length
      if ('vibrate' in navigator && color !== colors[index]) {
        navigator.vibrate(30)
      }
      color = colors[index]
      const lineHalfWidth = Math.max(Math.min((r - radius) << 1, radius), 0.5)
      wheel.style.transform = `rotate(${Math.round((1 - angle) * 180)}deg)`
      arrow.style.borderTop = `${arrowSize}px solid ${color}`
      center.style.background = color
      center.style.width = `${lineHalfWidth}px`
      center.style.height = `${lineHalfWidth}px`
      center.style.border = `solid ${(radius - lineHalfWidth) / 2 + borderWidth}px ${
        color === '#FFFFFF' ? '#000000' : '#FFFFFF'
      }`
      return { strokeStyle: color, lineWidth: lineHalfWidth * 2 }
    },
    showColorWheel(x, y, x1, y1) {
      angleOffset = (Math.atan2(y1, x1) / Math.PI) % 2
      colorWheel.style.left = `${x - radius}px`
      colorWheel.style.top = `${y - radius}px`
      colorWheel.style.display = 'block'
    },
    hideColorWheel() {
      angleLast = angle
      colorWheel.style.display = 'none'
    },
  }
}
