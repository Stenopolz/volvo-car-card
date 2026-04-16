var h=`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .card-root {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.15));
    padding: 16px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, sans-serif);
  }

  /* ── Header ── */
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-header svg {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    fill: var(--primary-color);
  }

  .card-header-text {
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .card-subtitle {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  /* ── Stats grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    background: var(--secondary-background-color, rgba(0,0,0,.04));
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .stat-unit {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  /* ── Battery bar ── */
  .battery-bar-wrap {
    background: var(--divider-color, rgba(0,0,0,.12));
    border-radius: 4px;
    height: 6px;
    margin-top: 4px;
    overflow: hidden;
  }

  .battery-bar {
    height: 100%;
    border-radius: 4px;
    background: var(--primary-color);
    transition: width .4s ease;
  }

  .battery-bar.low {
    background: var(--error-color, #db4437);
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: opacity .2s;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .action-btn:hover {
    opacity: 0.85;
  }

  .action-btn:active {
    opacity: 0.7;
  }

  .action-btn.secondary {
    background: var(--secondary-background-color, rgba(0,0,0,.08));
    color: var(--primary-text-color);
  }

  .action-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  /* ── Error / unavailable ── */
  .error-box {
    padding: 12px;
    border-radius: 8px;
    background: var(--error-color, #db4437);
    color: #fff;
    font-size: 0.9rem;
  }

  .unavailable {
    color: var(--disabled-text-color, rgba(0,0,0,.38));
  }
`;var g={car:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>`,battery:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
  </svg>`,lock:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>`,unlock:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75l1.94.49C9.43 3.91 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </svg>`,range:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.49 5.48c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
  </svg>`,odometer:`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>`};class s extends HTMLElement{_config=null;_hass=null;_shadowAttached=!1;setConfig(r){if(!r)throw Error("Invalid configuration");if(this._config={...r},this._shadowAttached)this._render()}set hass(r){let o=this._hass;if(this._hass=r,this._shadowAttached&&this._config&&this._statesChanged(o,r))this._render()}getCardSize(){return 4}getGridOptions(){return{rows:4,columns:6,min_rows:3}}static getConfigElement(){return document.createElement("volvo-car-editor")}static getStubConfig(r){let o={type:"custom:volvo-car-card"};if(!r)return o;let a=Object.keys(r.states),x=(p,d)=>a.find((b)=>b.startsWith(`${p}.`)&&b.endsWith(`_${d}`));return o.battery_entity=x("sensor","battery_charge_level"),o.range_entity=x("sensor","distance_to_empty_battery")??x("sensor","distance_to_empty_tank"),o.lock_entity=x("lock","lock"),o.odometer_entity=x("sensor","odometer"),Object.keys(o).forEach((p)=>{if(o[p]===void 0)delete o[p]}),o}connectedCallback(){if(!this.shadowRoot)this.attachShadow({mode:"open"});this._shadowAttached=!0,this._render()}disconnectedCallback(){this._shadowAttached=!1}_render(){if(!this.shadowRoot)return;if(!this._config){this.shadowRoot.innerHTML=`<style>${h}</style>
        <div class="card-root"><div class="error-box">No configuration provided.</div></div>`;return}let{battery_entity:r,range_entity:o,lock_entity:a,odometer_entity:x,name:p}=this._config,d=this._getState(r),b=this._getState(o),c=this._getState(a),m=this._getState(x),l=c?.state==="locked",n=d?parseFloat(d.state):null,y=b?parseFloat(b.state):null,z=m?parseFloat(m.state):null,H=p??this._deriveName(c??d),q=n!==null&&n<20;this.shadowRoot.innerHTML=`
      <style>${h}</style>
      <div class="card-root">

        <!-- Header -->
        <div class="card-header">
          ${g.car}
          <div class="card-header-text">
            <span class="card-title">${H}</span>
            <span class="card-subtitle">Volvo</span>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="stats-grid">
          ${this._renderBatteryStat(n,q)}
          ${this._renderSimpleStat("Range",y,"km",g.range)}
          ${this._renderSimpleStat("Odometer",z?Math.round(z):null,"km",g.odometer)}
          ${this._renderLockStat(l,!!c)}
        </div>

        <!-- Actions -->
        <div class="actions">
          ${a?`
            <button class="action-btn" id="btn-lock" title="Lock">
              ${g.lock} Lock
            </button>
            <button class="action-btn secondary" id="btn-unlock" title="Unlock">
              ${g.unlock} Unlock
            </button>
          `:""}
        </div>

      </div>
    `,this.shadowRoot.getElementById("btn-lock")?.addEventListener("click",()=>this._callService("lock","lock",a)),this.shadowRoot.getElementById("btn-unlock")?.addEventListener("click",()=>this._callService("lock","unlock",a))}_renderBatteryStat(r,o){let a=r!==null?`${Math.round(r)}`:"—",x=r!==null?Math.round(r):0;return`
      <div class="stat-card">
        <span class="stat-label">Battery</span>
        <span class="stat-value ${r===null?"unavailable":""}">
          ${a}<span class="stat-unit"> %</span>
        </span>
        <div class="battery-bar-wrap">
          <div class="battery-bar ${o?"low":""}" style="width:${x}%"></div>
        </div>
      </div>
    `}_renderSimpleStat(r,o,a,x){let p=o!==null?`${o.toLocaleString()}`:"—";return`
      <div class="stat-card">
        <span class="stat-label">${r}</span>
        <span class="stat-value ${o===null?"unavailable":""}">
          ${p}<span class="stat-unit"> ${a}</span>
        </span>
      </div>
    `}_renderLockStat(r,o){let a=o?r?"Locked":"Unlocked":"—",x=r?g.lock:g.unlock;return`
      <div class="stat-card">
        <span class="stat-label">Lock</span>
        <span class="stat-value ${!o?"unavailable":""}" style="display:flex;align-items:center;gap:6px;font-size:1rem;">
          ${o?x:""}
          ${a}
        </span>
      </div>
    `}_getState(r){if(!r||!this._hass)return null;return this._hass.states[r]??null}_deriveName(r){if(!r)return"Volvo";return(r.attributes.friendly_name??"").replace(/\s+(battery.*|lock.*|odometer.*|distance.*)$/i,"").trim()||"Volvo"}_statesChanged(r,o){if(!r||!this._config)return!0;return[this._config.battery_entity,this._config.range_entity,this._config.lock_entity,this._config.odometer_entity].filter(Boolean).some((x)=>r.states[x]!==o.states[x])}_callService(r,o,a){if(!this._hass)return;this._hass.callService(r,o,{entity_id:a}).catch((x)=>{console.error(`[volvo-car-card] Service call ${r}.${o} failed:`,x)})}}var w=[{field:"battery_entity",label:"Battery Level",domains:["sensor"]},{field:"range_entity",label:"Range",domains:["sensor"]},{field:"lock_entity",label:"Lock",domains:["lock"]},{field:"odometer_entity",label:"Odometer",domains:["sensor"]}];class u extends HTMLElement{_config={type:"custom:volvo-car-card"};_hass;_built=!1;set hass(r){if(this._hass=r,this._built)this._applyProperties()}setConfig(r){if(this._config={...r},this._built)this._applyProperties()}connectedCallback(){if(!this.shadowRoot)this.attachShadow({mode:"open"});this._buildDOM(),this._applyProperties(),this._built=!0}_buildDOM(){let r=this.shadowRoot;r.innerHTML=`
      <style>
        .editor-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 4px 0;
        }
        .section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: 4px;
        }
        ha-textfield,
        ha-entity-picker {
          display: block;
          width: 100%;
        }
      </style>
      <div class="editor-root">
        <div class="section-title">General</div>
        <ha-textfield
          label="Card name (optional)"
          data-field="name"
        ></ha-textfield>

        <div class="section-title">Entities</div>
        ${w.map((o)=>`<ha-entity-picker
            label="${o.label}"
            data-field="${o.field}"
            allow-custom-entity
          ></ha-entity-picker>`).join(`
`)}
      </div>
    `,r.querySelectorAll("ha-entity-picker").forEach((o)=>{o.addEventListener("value-changed",(a)=>{let x=o.dataset.field,p=a.detail.value??"";this._updateConfig(x,p||void 0)})}),r.querySelector("ha-textfield")?.addEventListener("change",(o)=>{let a=o.target.value;this._updateConfig("name",a||void 0)})}_applyProperties(){let r=this.shadowRoot;if(!r)return;let o=this._config,a=r.querySelector("ha-textfield");if(a)a.value=o.name??"";r.querySelectorAll("ha-entity-picker").forEach((x)=>{let p=x.dataset.field,d=w.find((c)=>c.field===p),b=x;if(b.hass=this._hass,b.value=o[p]??"",d)b.includeDomains=d.domains})}_updateConfig(r,o){let a={...this._config};if(o)a[r]=o;else delete a[r];this._config=a,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}}customElements.define("volvo-car-card",s);customElements.define("volvo-car-editor",u);window.customCards??=[];window.customCards.push({type:"volvo-car-card",name:"Volvo Car Card",description:"A card for displaying Volvo Cars integration data and controls.",preview:!1,documentationURL:"https://github.com/home-assistant/core/tree/dev/homeassistant/components/volvo"});
