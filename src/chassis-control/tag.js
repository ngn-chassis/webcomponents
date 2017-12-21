class ChassisFormControl extends HTMLElement {
  constructor () {
    super()

    this.fieldInputTypes = [
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
      'textarea'
    ]

    this.toggleInputTypes = [
      'checkbox',
      'radio'
    ]

    this.supportedTypes = [
      'field',
      'toggle',
      'select'
    ]

    this._input = null
  }

  static get observedAttributes () {
    return ['disabled']
  }

  get input () {
    return this._input
  }

  set input (input) {
    if (this._input) {
      console.warn(`Setting <chassis-control> child input programmatically is not allowed.`)
      return
    }

    this._input = input
  }

  get type () {
    return this.getAttribute('type')
  }

  set type (value) {
    this.setAttribute('type', value)
  }

  connectedCallback () {
    this._guid = this._generateGuid()

    setTimeout(() => {
      let label = this.querySelector('label')
      let input = this.querySelector('input')
      let textarea = this.querySelector('textarea')
      let select = this.querySelector('select')

      label && this._initLabel(label)
      input && this._initInput(input)
      textarea && this._initInput(textarea)
      select && this._initSelectMenu(select)
    })
  }

  _generateGuid (prefix = 'input') {
    let lut = []

    for (let i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? '0' : '') + i.toString(16)
    }

    let d0 = Math.random() * 0xffffffff | 0
    let d1 = Math.random() * 0xffffffff | 0
    let d2 = Math.random() * 0xffffffff | 0
    let d3 = Math.random() * 0xffffffff | 0

    return `${prefix}_` + lut[d0&0xff] + lut[d0>>8&0xff] + lut[d0>>16&0xff] + lut[d0>>24&0xff] + '-' +
      lut[d1&0xff] + lut[d1>>8&0xff] + '-' + lut[d1>>16&0x0f|0x40] + lut[d1>>24&0xff] +'-'+
      lut[d2&0x3f|0x80] + lut[d2>>8&0xff] + '-' + lut[d2>>16&0xff] + lut[d2>>24&0xff] +
      lut[d3&0xff] + lut[d3>>8&0xff] + lut[d3>>16&0xff] + lut[d3>>24&0xff]
  }

  _initInput (input) {
    input.slot = input.slot || 'input'
    this._input = input
    input.id = this._guid

    if (this.fieldInputTypes.indexOf(input.type) >= 0) {
      this.type = 'field'
    }

    if (this.toggleInputTypes.indexOf(input.type) >= 0) {
      this.type = 'toggle'
    }
  }

  _initLabel (label) {
    this.label = label
    label.slot = label.slot || 'label'
    label.htmlFor = this._guid
  }

  _initSelectMenu (select) {
    this.type = 'select'

    if (!customElements.get('chassis-select')) {
      select.id = this._guid
      select.slot = select.slot || 'input'
      select.setAttribute('role', 'menu')
      this._input = select

      let titleEls = select.querySelectorAll('option[title]')
      titleEls.forEach((el) => select.removeChild(el))

      for (let option of select.options) {
        if (option.hasAttribute('label') && option.getAttribute('label').trim() === '') {
          option.removeAttribute('label')
        }
      }

      return
    }

    let placeholder = document.createElement('chassis-select')
    placeholder.slot = 'input'

    for (let attr of select.attributes) {
      if (attr.specified) {
        placeholder.setAttribute(attr.name, attr.value)
      }
    }

    this.removeChild(select)

    placeholder._inject(select)
    this.appendChild(placeholder)
    this._input = placeholder
  }
}

customElements.define('chassis-control', ChassisFormControl)
