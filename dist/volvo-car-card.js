var u=`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  /* ── Card root ── */
  .card-root {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--ha-card-background, #f4f4f3);
    border-radius: var(--ha-card-border-radius, 24px);
    box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0,0,0,.08));
    overflow: hidden;
    font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif);
    color: #111;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    container-type: size;
    container-name: card;
  }

  /* ── Energy background ── */
  .energy-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    transition: background 0.6s ease;
  }

  /* ── Content layer ── */
  .card-content {
    position: relative;
    z-index: 1;
    padding: 12px 16px 0;
    flex: 0 1 auto;
    overflow: hidden;
  }

  /* ── Header ── */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .vehicle-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: 0.02em;
  }

  .version-badge {
    font-size: 0.6rem;
    padding: 3px 7px;
    border-radius: 10px;
    background: rgba(0,0,0,0.06);
    color: #666;
    font-family: monospace;
    white-space: nowrap;
  }

  /* ── Primary range metric ── */
  .range-metric {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
    line-height: 1;
  }

  .range-metric--combined {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .range-combined-total {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .range-breakdown {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .range-part {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #444;
  }

  .range-part-unit {
    font-size: 0.85rem;
    color: #666;
    font-weight: 400;
  }

  .range-sep {
    font-size: 0.85rem;
    color: #999;
    font-weight: 300;
  }

  .range-part-icon {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .range-part-icon svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .range-part-icon--fuel    { color: #3b82f6; }
  .range-part-icon--electric { color: #22c55e; }

  .range-single-icon {
    width: 18px;
    height: 18px;
    align-self: center;
    margin-left: 2px;
  }

  .range-single-icon svg {
    width: 18px;
    height: 18px;
  }

  .range-value {
    font-size: clamp(1.8rem, 12cqh, 3.5rem);
    font-weight: 300;
    color: #111;
    letter-spacing: -0.025em;
    line-height: 1;
  }

  .range-unit {
    font-size: clamp(0.9rem, 5cqh, 1.5rem);
    font-weight: 400;
    color: #222;
  }

  .range-unavailable {
    font-size: 2.5rem;
    font-weight: 300;
    color: #999;
  }

  /* ── Energy status block ── */
  .status-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 4px;
  }

  .status-row {
    display: grid;
    grid-template-columns: 22px 46px 1fr auto;
    align-items: center;
    gap: 10px;
  }

  .status-row--fuel {
    display: inline-flex;
    grid-template-columns: unset;
  }

  .status-icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #333;
  }

  .status-icon svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .status-pct {
    font-size: 0.85rem;
    font-weight: 600;
    color: #111;
    white-space: nowrap;
  }

  .status-pct.secondary {
    font-weight: 500;
    color: #444;
  }

  /* ── Segmented progress bar ── */
  .seg-bar {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .seg {
    height: 6px;
    flex: 1;
    border-radius: 3px;
    background: rgba(0,0,0,0.1);
  }

  .seg.green { background: #22c55e; }
  .seg.blue  { background: #3b82f6; }

  /* ── Status label ── */
  .status-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-label.secondary {
    font-weight: 400;
    color: #555;
  }

  /* ── Hero image zone ── */
  .hero-zone {
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 8px 0 0;
    overflow: hidden;
  }

  .car-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
    filter: drop-shadow(0 8px 24px rgba(0,0,0,0.12));
  }

  .hero-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-placeholder svg {
    width: 96px;
    height: 96px;
    fill: rgba(0,0,0,0.08);
  }

  /* ── Quick-action buttons ── */
  .actions-bar {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 12px 20px 18px;
    flex-shrink: 0;
  }

  .circle-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.88);
    box-shadow: 0 2px 10px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    flex-shrink: 0;
  }

  .circle-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08);
  }

  .circle-btn:active {
    transform: scale(0.95);
    opacity: 0.8;
  }

  .circle-btn svg {
    width: 22px;
    height: 22px;
    fill: #1a1a1a;
    pointer-events: none;
  }

  /* ── Error ── */
  .error-box {
    padding: 16px;
    border-radius: 12px;
    background: #fef2f2;
    color: #dc2626;
    font-size: 0.9rem;
    margin: 16px;
  }

  /* ── Unavailable text ── */
  .unavailable {
    color: #aaa;
  }
`;var V="743d233 (2026-04-13)";var c='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M13.853 1.0645a1 1 0 0 1 .6318 1.1094l-1.2929 7.3262H17.5a1.0001 1.0001 0 0 1 .8542 1.52l-7 11.5a1 1 0 0 1-1.839-.6938l1.2929-7.3262H6.5a1 1 0 0 1-.8542-1.5199l7-11.5a1 1 0 0 1 1.2072-.4157M12 13.5l-1.5 8.5 7-11.5H12l1.5-8.5-7 11.5z" clip-rule="evenodd"/></svg>',a='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 2H7c-.552 0-1 .448-1 1v17H5V3c0-1.105.895-2 2-2h7c1.105 0 2 .895 2 2v17h-1V3c0-.552-.448-1-1-1M3.5 21a.5.5 0 0 0 0 1h14a.5.5 0 0 0 0-1z"/><path d="M8 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M8 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M19.354 4.147a.5.5 0 0 0-.707.707l2.793 2.793a.5.5 0 0 1 0 .707l-1 1A1.5 1.5 0 0 0 20 10.414V15.5a.5.5 0 0 1-1 0v-3c0-.828-.672-1.5-1.5-1.5H17v1h.5a.5.5 0 0 1 .5.5v3c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5v-5.086a.5.5 0 0 1 .146-.353l1-1c.586-.586.586-1.536 0-2.121z"/></svg>',q='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.5 7.5V10h1V7.5C18.5 3.9102 15.5899 1 12 1 8.4102 1 5.5 3.9101 5.5 7.5V10h1V7.5C6.5 4.4624 8.9624 2 12 2s5.5 2.4624 5.5 5.5"/><path fill-rule="evenodd" d="M3 12c0-.5523.4477-1 1-1h16c.5523 0 1 .4477 1 1v8c0 1.6569-1.3431 3-3 3H6c-1.6569 0-3-1.3431-3-3zm1 8v-8h16v8c0 1.1046-.8954 2-2 2H6c-1.1046 0-2-.8954-2-2" clip-rule="evenodd"/></svg>',f='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.626 1.783c2.2366-2.2366 6.1195-1.8609 8.2328.2525 2.0312 2.0311 2.4572 5.6968.5018 7.9644h-1.3952l.4389-.4388c1.7803-1.7803 1.5393-5.0266-.2526-6.8185S12.1135.7097 10.3332 2.49l-2.374 2.374-.707-.7071z"/><path fill-rule="evenodd" d="M3 12c0-.5523.4477-1 1-1h16c.5523 0 1 .4477 1 1v8c0 1.6569-1.3431 3-3 3H6c-1.6569 0-3-1.3431-3-3zm1 8v-8h16v8c0 1.1046-.8954 2-2 2H6c-1.1046 0-2-.8954-2-2" clip-rule="evenodd"/></svg>',Q='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M23 12c0 6.0751-4.9249 11-11 11S1 18.0751 1 12 5.9249 1 12 1s11 4.9249 11 11m-1 0c0 5.5228-4.4772 10-10 10S2 17.5228 2 12 6.4772 2 12 2s10 4.4772 10 10" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12 7a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9A.5.5 0 0 1 12 7" clip-rule="evenodd"/></svg>',J='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.1366 1.6976C3.9673 3.2618 1 7.2844 1 12c0 6.0751 4.9249 11 11 11s11-4.9249 11-11c0-4.7156-2.9673-8.7382-7.1366-10.3024l-.3512.9366C19.3025 4.0562 22 7.713 22 12c0 5.5228-4.4772 10-10 10S2 17.5228 2 12c0-4.287 2.6975-7.9438 6.4878-9.3658z"/><path fill-rule="evenodd" d="M12 1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9A.5.5 0 0 1 12 1" clip-rule="evenodd"/></svg>',W='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M13.6544 3.9738c-.7219.8228-1.3652 2.3777-1.5791 5.3026-.033.4507-.2684.8663-.6152 1.105-.3703.2548-.8883.3083-1.3241-.0504C9.1493 9.5188 8.7368 7.9102 9 4.9825c-.0032-.416-.0954-.7108-.2246-.917-.1294-.2068-.3142-.354-.552-.4475-.4942-.1942-1.2294-.1546-2.0406.164C4.5557 4.4214 3 6.0247 3 8.0043c0 .8148.1782 1.6473.9733 2.3451.8222.7218 2.3762 1.3651 5.2992 1.5793.4507.0331.8662.2685 1.1048.6153.2548.3702.3084.8882-.0502 1.3239-.8122.987-2.4208 1.3997-5.3488 1.1365-.416.0031-.7108.0953-.917.2244-.2068.1295-.354.3143-.4475.5521-.1942.4942-.1546 1.2294.164 2.0406.6393 1.6271 2.2426 3.1828 4.2222 3.1828.815 0 1.6477-.1783 2.3456-.9738.7219-.8228 1.3652-2.3778 1.5791-5.3026.033-.4508.2684-.8663.6152-1.105.3703-.2548.8883-.3083 1.3241.0504.9867.8122 1.3992 2.4208 1.1361 5.3484.0031.416.0953.7109.2245.9171.1294.2068.3142.3541.552.4475.4942.1942 1.2294.1546 2.0406-.1641C19.4443 19.5829 21 17.9796 21 16c0-.8148-.1782-1.6473-.9733-2.3452-.8222-.7217-2.3762-1.365-5.2992-1.5792-.4507-.0331-.8662-.2685-1.1048-.6153-.2548-.3702-.3084-.8882.0502-1.3239.8122-.987 2.4208-1.3997 5.3488-1.1365.4159-.003.7108-.0953.917-.2245.2068-.1294.3541-.3142.4475-.552.1942-.4942.1546-1.2294-.1641-2.0406C19.5829 4.5557 17.9796 3 16 3c-.815 0-1.6476.1783-2.3456.9738m-.7517-.6595C13.8595 2.2238 15.0214 2 16 2c2.5204 0 4.4171 1.9443 5.1529 3.8172.3688.9388.4855 1.9536.164 2.7719-.1644.4184-.4429.7806-.8474 1.0339C20.068 9.8744 19.5726 10 19 10h-.0227l-.0226-.002c-2.9236-.2658-4.0464.2108-4.5096.7738-.0292.0354-.0273.0517-.0273.0528-.0001.0064.0021.0303.0286.0688.0582.0846.1909.1729.3542.1848 3.0091.2206 4.8231.8923 5.8858 1.8251C21.7763 13.86 22 15.0216 22 16c0 2.5204-1.9443 4.4171-3.8172 5.1529-.9388.3688-1.9536.4855-2.7719.164-.4184-.1644-.7806-.4429-1.0339-.8474C14.1256 20.068 14 19.5726 14 19v-.0227l.0021-.0226c.2657-2.9233-.2108-4.0461-.7737-4.5095-.0341-.0281-.0505-.0274-.0526-.0273h-.0001c-.0065 0-.0303.0022-.0689.0287-.0845.0582-.1728.1908-.1847.3541-.2203 3.0109-.8919 4.8259-1.8248 5.8892-.9568 1.0905-2.1187 1.3143-3.0973 1.3143-2.5204 0-4.4171-1.9443-5.1529-3.8172-.3688-.9388-.4855-1.9537-.164-2.7719.1644-.4185.4429-.7806.8474-1.0339.4015-.2514.8969-.377 1.4695-.377h.0227l.0226.002c2.9237.2658 4.0464-.2108 4.5096-.7738.0281-.0341.0274-.0505.0274-.0526v-.0002c0-.0064-.0022-.0303-.0287-.0688-.0582-.0846-.1909-.1729-.3542-.1849-3.009-.2205-4.823-.8922-5.8858-1.825C2.2237 10.1442 2 8.9825 2 8.0042 2 5.4837 3.9443 3.587 5.8172 2.8513c.9388-.3688 1.9536-.4855 2.7719-.164.4184.1643.7806.4429 1.0339.8474.2514.4015.377.8969.377 1.4695v.0227l-.002.0225c-.2658 2.9234.2107 4.0462.7736 4.5096.0341.028.0505.0274.0526.0273h.0001c.0065 0 .0303-.0022.0689-.0287.0845-.0582.1728-.1908.1847-.3542.2203-3.0108.8919-4.8258 1.8248-5.889" clip-rule="evenodd"/></svg>';var A=`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
</svg>`,X=10;class z extends HTMLElement{_config=null;_hass=null;_initialized=!1;setConfig(o){if(!o)throw Error("Invalid configuration");if(this._config={...o},this._initialized)this._render()}set hass(o){let p=this._hass;if(this._hass=o,this._initialized&&this._config&&this._statesChanged(p,o))this._render()}getCardSize(){return 8}getGridOptions(){return{rows:8,columns:12,min_columns:2,min_rows:6}}static getConfigElement(){return document.createElement("volvo-car-editor")}static getStubConfig(o){let p=(r,l)=>o?Object.keys(o.states).find((i)=>i.startsWith(`${r}.`)&&i.endsWith(`_${l}`))??"":"";return{type:"custom:volvo-car-card",battery_entity:p("sensor","battery_charge_level"),range_entity:p("sensor","distance_to_empty_battery")||p("sensor","distance_to_empty_tank"),fuel_entity:p("sensor","fuel_amount"),fuel_range_entity:p("sensor","distance_to_empty_tank"),lock_entity:p("lock","lock"),charging_status_entity:p("sensor","charging_system_status"),vehicle_image_entity:p("camera","exterior")}}connectedCallback(){if(!this._initialized)this.attachShadow({mode:"open"}),this._initialized=!0;this._render()}disconnectedCallback(){}_render(){if(!this.shadowRoot)return;if(!this._config){this.shadowRoot.innerHTML=`<style>${u}</style>
        <div class="card-root"><div class="error-box">No configuration provided.</div></div>`;return}let{battery_entity:o,range_entity:p,lock_entity:r,fuel_entity:l,fuel_range_entity:i,charging_status_entity:x,climate_entity:h,engine_start_entity:e,engine_stop_entity:d,vehicle_image_entity:m,name:Z}=this._config,g=this._getState(o),w=this._getState(p),M=this._getState(r),s=this._getState(l),v=this._getState(i),$=this._getState(x),H=this._getState(m),b=g?parseFloat(g.state):null,Y=w?parseFloat(w.state):null,k=s?parseFloat(s.state):null,C=v?parseFloat(v.state):null,n=M?.state==="locked",D=o!=null,j=Z??this._deriveName(M??g??s),F=i?"":this._energyBgStyle(b??0),B=H?H.attributes.entity_picture??"":"",G=this._chargingLabel($,b);this.shadowRoot.innerHTML=`
      <style>${u}</style>
      <div class="card-root">

        <!-- Energy background layer -->
        <div class="energy-bg" style="${F}"></div>

        <!-- Top content -->
        <div class="card-content">

          <!-- Header: vehicle name + version -->
          <div class="card-header">
            <span class="vehicle-name">${j}</span>
            <span class="version-badge" title="Build version">${V}</span>
          </div>

          <!-- Primary range metric -->
          ${this._renderRangeMetric(Y,w,C,v)}

          <!-- Energy status rows -->
          <div class="status-block">
            ${D?this._renderChargeRow(b,G):""}
            ${this._renderFuelRow(k,s)}
          </div>

        </div>

        <!-- Vehicle hero image -->
        <div class="hero-zone">
          ${B?`<img class="car-image" src="${B}" alt="${j}" />`:`<div class="hero-placeholder">${A}</div>`}
        </div>

        <!-- Quick-action buttons -->
        <div class="actions-bar">
          ${r?`
            <button class="circle-btn" id="btn-lock" title="${n?"Unlock":"Lock"}">
              ${n?q:f}
            </button>
          `:""}
          ${r&&n?`
            <button class="circle-btn" id="btn-unlock" title="Unlock">
              ${f}
            </button>
          `:""}
          ${h?`
            <button class="circle-btn" id="btn-climate" title="Start climate">
              ${W}
            </button>
          `:""}
          ${e?`
            <button class="circle-btn" id="btn-engine-start" title="Start engine">
              ${Q}
            </button>
          `:""}
          ${d?`
            <button class="circle-btn" id="btn-engine-stop" title="Stop engine">
              ${J}
            </button>
          `:""}
        </div>

      </div>
    `,this._attachHandlers(r,n,h,e,d)}_renderRangeMetric(o,p,r,l){let i=p!==null&&o!==null&&!isNaN(o),x=l!==null&&r!==null&&!isNaN(r);if(i&&x)return`
        <div class="range-metric range-metric--combined">
          <div class="range-combined-total">
            <span class="range-value">${(Math.round(r)+Math.round(o)).toLocaleString()}</span>
            <span class="range-unit">km</span>
          </div>
          <div class="range-breakdown">
            <span class="range-part">
              <span class="range-part-icon range-part-icon--fuel">${a}</span>
              ${Math.round(r)}
            </span>
            <span class="range-sep">+</span>
            <span class="range-part">
              <span class="range-part-icon range-part-icon--electric">${c}</span>
              ${Math.round(o)}
            </span>
            <span class="range-part-unit">km</span>
          </div>
        </div>
      `;if(!p&&!l)return'<div class="range-metric"><span class="range-unavailable">— km</span></div>';let h=i?o:x?r:null;if(h===null)return'<div class="range-metric"><span class="range-unavailable">Updating…</span></div>';let e=i?c:a,d=i?"range-part-icon--electric":"range-part-icon--fuel";return`
      <div class="range-metric">
        <span class="range-value">${Math.round(h).toLocaleString()}</span>
        <span class="range-unit">km</span>
        <span class="range-part-icon ${d} range-single-icon">${e}</span>
      </div>
    `}_renderChargeRow(o,p){let r=o!==null?`${Math.round(o)}%`:"—";return`
      <div class="status-row">
        <span class="status-icon">${c}</span>
        <span class="status-pct">${r}</span>
        ${this._renderSegBar(o,"green")}
        <span class="status-label">${p}</span>
      </div>
    `}_renderFuelRow(o,p){if(!this._config?.fuel_entity)return"";let r=p?.attributes.unit_of_measurement??"L",l=o!==null&&!isNaN(o)?`${Math.round(o)} ${r}`:"—";return`
      <div class="status-row status-row--fuel">
        <span class="status-icon">${a}</span>
        <span class="status-pct">${l}</span>
      </div>
    `}_renderSegBar(o,p){let r=o!==null&&!isNaN(o)?Math.round(o/(100/X)):0;return`<div class="seg-bar">${Array.from({length:X},(i,x)=>`<span class="seg ${x<r?p:""}"></span>`).join("")}</div>`}_energyBgStyle(o){let p=Math.max(0,Math.min(100,o)),r=`${Math.max(0,p-6)}%`,l=`${p}%`;return`background: linear-gradient(to right,
      rgba(74,222,128,0.28) 0%,
      rgba(74,222,128,0.28) ${r},
      rgba(74,222,128,0.06) ${l},
      transparent 100%);`}_chargingLabel(o,p){if(!o){if(p!==null&&p>=100)return"Fully charged";return"Ready to drive"}let r=o.state.toLowerCase();if(r.includes("charging"))return o.state;if(r.includes("full"))return"Fully charged";if(r.includes("schedul"))return"Charge scheduled";return o.state||"Ready to drive"}_getState(o){if(!o||!this._hass)return null;return this._hass.states[o]??null}_deriveName(o){if(!o)return"Volvo";return(o.attributes.friendly_name??"").replace(/\s+(battery.*|lock.*|odometer.*|distance.*|fuel.*|charging.*|camera.*)$/i,"").trim()||"Volvo"}_statesChanged(o,p){if(!o||!this._config)return!0;return[this._config.battery_entity,this._config.range_entity,this._config.lock_entity,this._config.fuel_entity,this._config.fuel_range_entity,this._config.charging_status_entity,this._config.climate_entity,this._config.engine_start_entity,this._config.engine_stop_entity,this._config.vehicle_image_entity].filter(Boolean).some((l)=>o.states[l]!==p.states[l])}_attachHandlers(o,p,r,l,i){let x=this.shadowRoot;x.getElementById("btn-lock")?.addEventListener("click",()=>{if(!o)return;let h=p?"unlock":"lock";this._callService("lock",h,o)}),x.getElementById("btn-unlock")?.addEventListener("click",()=>{if(!o)return;this._callService("lock","unlock",o)}),x.getElementById("btn-climate")?.addEventListener("click",()=>{if(!r)return;let h=r.split(".")[0],e=h==="button"?"press":"turn_on";this._callService(h,e,r)}),x.getElementById("btn-engine-start")?.addEventListener("click",()=>{if(!l)return;this._callService("button","press",l)}),x.getElementById("btn-engine-stop")?.addEventListener("click",()=>{if(!i)return;this._callService("button","press",i)})}_callService(o,p,r){if(!this._hass)return;this._hass.callService(o,p,{entity_id:r}).catch((l)=>{console.error(`[volvo-car-card] Service call ${o}.${p} failed:`,l)})}}var T={name:"Card name (optional)",battery_entity:"Battery level entity (sensor)",range_entity:"Electric range entity (sensor)",fuel_entity:"Fuel level entity (sensor)",fuel_range_entity:"Fuel range entity (sensor)",lock_entity:"Lock entity",charging_status_entity:"Charging status entity (sensor, optional)",climate_entity:"Start climate entity (button, optional)",engine_start_entity:"Engine start entity (button)",engine_stop_entity:"Engine stop entity (button)",vehicle_image_entity:"Vehicle image entity (camera/image, optional)"},U=[{name:"name",selector:{text:{}}},{name:"battery_entity",selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"range_entity",selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"fuel_entity",selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"fuel_range_entity",selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"lock_entity",selector:{entity:{filter:[{domain:"lock"}]}}},{name:"charging_status_entity",selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"climate_entity",selector:{entity:{filter:[{domain:"climate"},{domain:"button"}]}}},{name:"engine_start_entity",selector:{entity:{filter:[{domain:"button"}]}}},{name:"engine_stop_entity",selector:{entity:{filter:[{domain:"button"}]}}},{name:"vehicle_image_entity",selector:{entity:{filter:[{domain:"camera"},{domain:"image"}]}}}];class t extends HTMLElement{_config={type:"custom:volvo-car-card"};_hass;_built=!1;_form;set hass(o){if(this._hass=o,this._form)this._form.hass=o}setConfig(o){if(this._config={...o},this._form)this._form.data=this._config}connectedCallback(){if(this._built)return;this._built=!0,this.attachShadow({mode:"open"});let o=this.shadowRoot;o.innerHTML=`<style>
      ha-form { display: block; }
    </style>`;let p=document.createElement("ha-form");this._form=p,p.hass=this._hass,p.data=this._config,p.schema=U,p.computeLabel=(r)=>T[r.name]??r.name,p.addEventListener("value-changed",(r)=>{let l={...r.detail.value,type:"custom:volvo-car-card"};this._config=l,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:l},bubbles:!0,composed:!0}))}),o.appendChild(p)}}customElements.define("volvo-car-card",z);customElements.define("volvo-car-editor",t);window.customCards??=[];window.customCards.push({type:"volvo-car-card",name:"Volvo Car Card",description:"A card for displaying Volvo Cars integration data and controls.",preview:!1,documentationURL:"https://github.com/home-assistant/core/tree/dev/homeassistant/components/volvo"});
