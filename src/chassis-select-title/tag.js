class ChassisSelectTitle extends HTMLElement {
  constructor () {
    super()
  }

  get title () {
    return this.shadowRoot.querySelector('#title').innerHTML
  }

  set title (value) {
    this.shadowRoot.querySelector('#title').innerHTML = value
  }

  connectedCallback () {
    this._appendCaret()
  }

  _appendCaret () {
    let xmlns = 'http://www.w3.org/2000/svg'
    let width = 24
    let height = 24

    let caret = document.createElementNS(xmlns, 'svg')
    caret.slot = 'beforeend'
    caret.setAttributeNS(null, 'width', width)
    caret.setAttributeNS(null, 'height', height)
    caret.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`)
    caret.setAttributeNS(null, 'fill', 'none')
    caret.setAttributeNS(null, 'stroke', 'currentColor')
    caret.setAttributeNS(null, 'stroke-width', '3')
    caret.setAttributeNS(null, 'stroke-linecap', 'square')
    caret.setAttributeNS(null, 'stroke-linejoin', 'miter')

    let shape = document.createElementNS(xmlns, 'polyline')
    shape.setAttributeNS(null, 'points', '6 9 12 15 18 9')

    caret.appendChild(shape)
    this.appendChild(caret)
  }
}

customElements.define('chassis-select-title', ChassisSelectTitle)
