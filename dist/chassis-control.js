class ChassisFormControl extends HTMLElement{constructor(){super(),this.attachShadow({mode:'open'});let a=document.createElement('div');a.insertAdjacentHTML('afterbegin',this.templateString);let b=a.querySelector('template');'content'in b?this.shadowRoot.appendChild(b.content.cloneNode(!0)):b.childNodes.forEach((a)=>{this.shadowRoot.appendChild(a.cloneNode(!0))}),b=null,this.fieldInputTypes=['color','date','datetime-local','email','file','hidden','image','month','number','password','range','reset','search','submit','tel','text','time','url','week','textarea'],this.toggleInputTypes=['checkbox','radio'],this.supportedTypes=['field','toggle','select'],this._input=null}get templateString(){return`<template><style>@charset UTF-8; @charset "UTF-8";:host{display:flex;contain:layout style;max-width:100%}:host *,:host :after,:host :before{box-sizing:border-box}:host .hidden{display:none;visibility:hidden;opacity:0}:host([type=field]){flex-direction:column}:host([type=toggle]){align-items:center}:host([type=toggle]) .label-wrapper{flex:1 1 auto;display:flex}:host([type=toggle]) .label-wrapper{flex:1 1 auto;display:flex}:host([type=toggle]) .input-wrapper{order:-1;display:flex;justify-content:center;align-items:center}:host([type=select]){flex-direction:column}chassis-control{display:flex;contain:layout style;max-width:100%}:host :after,:host :before,chassis-control *{box-sizing:border-box}chassis-control .hidden{display:none;visibility:hidden;opacity:0}chassis-control[type=field]{flex-direction:column}chassis-control[type=toggle]{align-items:center}chassis-control[type=toggle] .label-wrapper{flex:1 1 auto;display:flex}chassis-control[type=toggle] .label-wrapper{flex:1 1 auto;display:flex}chassis-control[type=toggle] .input-wrapper{order:-1;display:flex;justify-content:center;align-items:center}chassis-control[type=select]{flex-direction:column}</style><slot name="afterbegin"></slot><slot name="beforelabelwrapper"></slot><div class="label-wrapper"><slot name="beforelabel"></slot><slot name="label"></slot><slot name="afterlabel"></slot></div><slot name="afterlabelwrapper"></slot><slot name="beforeinputwrapper"></slot><div class="input-wrapper"><slot name="beforeinput"></slot><slot name="input"></slot><slot name="afterinput"></slot></div><slot name="afterinputwrapper"></slot><slot name="beforeend"></slot></template>`}static get observedAttributes(){return['disabled']}get input(){return this._input}set input(a){return this._input?void console.warn(`Setting <chassis-control> child input programmatically is not allowed.`):void(this._input=a)}get type(){return this.getAttribute('type')}set type(a){this.setAttribute('type',a)}connectedCallback(){this._guid=this._generateGuid(),setTimeout(()=>{let a=this.querySelector('label'),b=this.querySelector('input'),c=this.querySelector('textarea'),d=this.querySelector('select');a&&this._initLabel(a),b&&this._initInput(b),c&&this._initInput(c),d&&this._initSelectMenu(d)})}_generateGuid(a='input'){let b=[];for(let c=0;256>c;c++)b[c]=(16>c?'0':'')+c.toString(16);let c=0|4294967295*Math.random(),d=0|4294967295*Math.random(),e=0|4294967295*Math.random(),f=0|4294967295*Math.random();return`${a}_`+b[255&c]+b[255&c>>8]+b[255&c>>16]+b[255&c>>24]+'-'+b[255&d]+b[255&d>>8]+'-'+b[64|15&d>>16]+b[255&d>>24]+'-'+b[128|63&e]+b[255&e>>8]+'-'+b[255&e>>16]+b[255&e>>24]+b[255&f]+b[255&f>>8]+b[255&f>>16]+b[255&f>>24]}_initInput(a){a.slot=a.slot||'input',this._input=a,a.id=this._guid,0<=this.fieldInputTypes.indexOf(a.type)&&(this.type='field'),0<=this.toggleInputTypes.indexOf(a.type)&&(this.type='toggle')}_initLabel(a){this.label=a,a.slot=a.slot||'label',a.htmlFor=this._guid}_initSelectMenu(a){if(this.type='select',!customElements.get('chassis-select')){a.id=this._guid,a.slot=a.slot||'input',a.setAttribute('role','menu'),this._input=a;let b=a.querySelectorAll('option[title]');b.forEach((b)=>a.removeChild(b));for(let b of a.options)b.hasAttribute('label')&&''===b.getAttribute('label').trim()&&b.removeAttribute('label');return}let b=document.createElement('chassis-select');b.slot='input';for(let c of a.attributes)c.specified&&b.setAttribute(c.name,c.value);this.removeChild(a),b._inject(a),this.appendChild(b),this._input=b}}customElements.define('chassis-control',ChassisFormControl);