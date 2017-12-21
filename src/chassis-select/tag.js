class ChassisSelect extends HTMLElement {
  constructor () {
    super()

    this._options = new Map()
    this._title = ''
    this._selectedOption = null

    this._bodyClickHandler = (evt) => {
      if (evt.target === this || this.contains(evt.target)) {
        return
      }

      this.removeAttribute('open')
    }

    this._arrowKeydownHandler = (evt) => {
      switch (evt.keyCode) {
        case 38:
          evt.preventDefault()
          console.log('select previous option');
          break

        case 40:
          evt.preventDefault()
          console.log('select next option');
          break

        default:
          return
      }
    }
  }

  static get observedAttributes () {
    return ['autofocus', 'disabled', 'name', 'open', 'tabindex']
  }

  get autofocus () {
    return this._selectEl.autofocus
  }

  set autofocus (value) {
    if (typeof value !== 'boolean') {
      console.error(`<chassis-select> autofocus property type must be boolean, received ${typeof value}`)
      this.removeAttribute('autofocus')
      return
    }

    if (this._selectEl) {
      this._selectEl.autofocus = value
    }

    value = value ? 'true' : 'false'

    if (!this.hasAttribute('autofocus') || this.getAttribute('autofocus') !== value) {
      this.setAttribute('autofocus', value)
    }
  }

  get isOpen () {
    return this.hasAttribute('open')
  }

  set isOpen (bool) {
    bool ? this.setAttribute('open', '') : this.removeAttribute('open')
  }

  get name () {
    return this._selectEl.name
  }

  set name (value) {
    if (this._selectEl) {
      this._selectEl.name = value
    }

    if (!this.hasAttribute('name') || this.getAttribute('name') !== value) {
      this.setAttribute('name', value)
    }
  }

  get options () {
    return Array.from(this._options.values())
  }

  get selectedIndex () {
    return this._selectEl.selectedIndex
  }

  get sourceElement () {
    return this._selectEl
  }

  get value () {
    return this._selectEl.value
  }

  connectedCallback () {
    setTimeout(() => {
      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', 0)
      }

      this._applyListeners()
    }, 0)
  }

  attributeChangedCallback (attr, oldValue, newValue) {
    switch (attr.toLowerCase()) {
      case 'autofocus':
        this._handleAutoFocusChange(newValue)
        break

      case 'name':
        this.name = newValue
        break

      case 'open':
        this.isOpen ? this.open() : this.close()
        break

      default:
        return
    }
  }

  _handleAutoFocusChange (value) {
    if (!value) {
      this.removeAttribute('autofocus')
      return
    }

    if (value !== 'true' && value !== 'false') {
      console.error(`<chassis-select> autofocus attribute expected boolean but received "${value}"`)
      this.removeAttribute('autofocus')
      return
    }

    this.autofocus = value === 'true'
  }

  open () {
    document.body.addEventListener('click', this._bodyClickHandler)
    document.body.addEventListener('touchcancel', this._bodyClickHandler)
    document.body.addEventListener('touchend', this._bodyClickHandler)

    if (!this.isOpen) {
      this.isOpen = true
    }
  }

  close () {
    document.body.removeEventListener('click', this._bodyClickHandler)
    document.body.removeEventListener('touchcancel', this._bodyClickHandler)
    document.body.removeEventListener('touchend', this._bodyClickHandler)

    if (this.isOpen) {
      this.isOpen = false
    }
  }

  _inject (select) {
    this._selectEl = select

    this._titleEl = document.createElement('chassis-select-title')
    this._titleEl.slot = 'title'
    this.appendChild(this._titleEl)

    this._optionsEl = document.createElement('chassis-options')
    this._optionsEl.slot = 'options'
    this.appendChild(this._optionsEl)

    this.addChildren(select.children)
    this.select(this.options[0].id)
  }

  addChildren (children) {
    for (let child of children) {
      switch (child.nodeName) {
        case 'OPTION':
          this.addOption(this._generateOptionObject(child))
          break

        case 'OPTGROUP':
          this.addOptgroup(this._generateChassisOptgroup(child))
          break

        default:
          console.warn(`${child.nodeName.toLowerCase()} is not a valid child element for <chassis-select>. Removing...`)
          break
      }
    }
  }

  addOption (option, dest = this._optionsEl) {
    if (!customElements.get('chassis-option')) {
      console.error(`chassis-select requires chassis-option. Please include it in this document's <head> element.`)
      return
    }

    let label = option.sourceElement.getAttribute('label')
    let chassisOption = document.createElement('chassis-option')

    chassisOption.key = option.id
    chassisOption.innerHTML = label && label.trim() !== '' ? label : option.sourceElement.innerHTML
    chassisOption.sourceElement = option.sourceElement

    dest.appendChild(chassisOption)
    this._applyOptionListeners(chassisOption)

    option.displayElement = chassisOption
    this._options.set(option.id, option)
  }

  addOptgroup (optgroup, dest = this._optionsEl) {
    let label = document.createElement('chassis-optgroup-label')
    label.innerHTML = optgroup.getAttribute('label')

    dest.appendChild(label)
    dest.appendChild(optgroup)
  }

  select (id) {
    let option = this._options.get(id)

    if (option) {
      option.sourceElement.selected = true
      this._titleEl.title = option.displayElement.innerHTML
      this.selectedOption = option

      this.options.forEach((option) => option.displayElement.removeAttribute('selected'))
      option.displayElement.setAttribute('selected', '')
    }
  }

  _applyListeners () {
    this.addEventListener('click', (evt) => {
      if (this.hasAttribute('open')) {
        this.removeAttribute('open')
      } else {
        this.setAttribute('open', '')
      }
    })

    this.addEventListener('focus', (evt) => {
      this.addEventListener('keydown', this._arrowKeydownHandler)
    })

    this.addEventListener('blur', (evt) => {
      this.removeEventListener('keydown', this._arrowKeydownHandler)
    })
  }

  _applyOptionListeners (option) {
    option.addEventListener('click', (evt) => this.select(option.key))
  }

  _generateOptionObject (optionEl) {
    if (!customElements.get('chassis-option')) {
      console.error(`chassis-select requires chassis-option. Please include it in this document's <head> element.`)
      return
    }

    let obj = {
      id: this._generateGuid(),
      attributes: {},
      sourceElement: optionEl
    }

    for (let attr of optionEl.attributes) {
      obj.attributes[attr.name] = attr.value
    }

    return obj
  }

  _generateChassisOptgroup (optgroup) {
    if (!customElements.get('chassis-optgroup')) {
      console.error(`chassis-select requires chassis-optgroup. Please include it in this document's <head> element.`)
      return
    }

    let fauxOptgroup = document.createElement('chassis-optgroup')
    fauxOptgroup.id = this._generateGuid('optgroup')

    let label = optgroup.getAttribute('label')

    if (!label || label.trim() === '') {
      console.error('[ERROR] <optgroup> must have a label attribute!')
      return
    }

    fauxOptgroup.setAttribute('label', label)

    let options = optgroup.querySelectorAll('option')

    for (let option of options) {
      this.addOption(this._generateOptionObject(option), fauxOptgroup)
    }

    return fauxOptgroup
  }

  _generateGuid (prefix = 'option') {
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
}

customElements.define('chassis-select', ChassisSelect)
