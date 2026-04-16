import type { HomeAssistant, HassEntity, VolvoCardConfig } from "./types.js";
import { CARD_STYLES } from "./styles.js";

/** SVG icons used within the card */
const ICONS = {
  car: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>`,
  battery: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
  </svg>`,
  lock: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>`,
  unlock: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75l1.94.49C9.43 3.91 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
  </svg>`,
  range: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.49 5.48c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
  </svg>`,
  odometer: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>`,
};

/**
 * Volvo Car Card – main custom element.
 *
 * Add to your dashboard as type: custom:volvo-car-card
 */
export class VolvoCarCard extends HTMLElement {
  private _config: VolvoCardConfig | null = null;
  private _hass: HomeAssistant | null = null;
  private _initialized = false;

  // ── HA card lifecycle ────────────────────────────────────────────────────

  /** Called by HA with the config from the dashboard YAML. */
  setConfig(config: VolvoCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    if (this._initialized) this._render();
  }

  /** Called by HA whenever any entity state changes. */
  set hass(hass: HomeAssistant) {
    const prev = this._hass;
    this._hass = hass;

    // Only re-render if one of our configured entities changed
    if (this._initialized && this._config && this._statesChanged(prev, hass)) {
      this._render();
    }
  }

  /** HA uses this to estimate card height in the masonry view (1 unit = 50px). */
  getCardSize(): number {
    return 4;
  }

  /** HA uses this for sizing in the sections view. */
  getGridOptions() {
    return { rows: 4, columns: 6, min_rows: 3 };
  }

  /** HA calls this to get the editor element for the visual card editor. */
  static getConfigElement(): HTMLElement {
    return document.createElement("volvo-car-editor");
  }

  /**
   * HA calls this with (hass, entities, entitiesFallback) to pre-populate
   * a new card's YAML config. We scan hass.states for Volvo entities by
   * looking for the canonical sensor key suffixes used by the integration.
   */
  static getStubConfig(hass?: HomeAssistant): VolvoCardConfig {
    const config: VolvoCardConfig = { type: "custom:volvo-car-card" };
    if (!hass) return config;

    const ids = Object.keys(hass.states);

    const find = (domain: string, suffix: string): string | undefined =>
      ids.find(
        (id) => id.startsWith(`${domain}.`) && id.endsWith(`_${suffix}`)
      );

    config.battery_entity = find("sensor", "battery_charge_level");
    config.range_entity =
      find("sensor", "distance_to_empty_battery") ??
      find("sensor", "distance_to_empty_tank");
    config.lock_entity = find("lock", "lock");
    config.odometer_entity = find("sensor", "odometer");

    // Remove undefined keys so the YAML is clean
    (Object.keys(config) as (keyof VolvoCardConfig)[]).forEach((k) => {
      if (config[k] === undefined) delete config[k];
    });

    return config;
  }

  // ── DOM lifecycle ────────────────────────────────────────────────────────

  connectedCallback(): void {
    // Use a private flag — the scoped-custom-element-registry polyfill used
    // by HA makes this.shadowRoot unreliable as a guard against double attachment.
    if (!this._initialized) {
      this.attachShadow({ mode: "open" });
      this._initialized = true;
    }
    this._render();
  }

  disconnectedCallback(): void {
    // Do not reset _initialized — shadow root persists across moves.
  }

  // ── Rendering ────────────────────────────────────────────────────────────

  private _render(): void {
    if (!this.shadowRoot) return;

    if (!this._config) {
      this.shadowRoot.innerHTML = `<style>${CARD_STYLES}</style>
        <div class="card-root"><div class="error-box">No configuration provided.</div></div>`;
      return;
    }

    const { battery_entity, range_entity, lock_entity, odometer_entity, name } =
      this._config;

    const batteryState = this._getState(battery_entity);
    const rangeState = this._getState(range_entity);
    const lockState = this._getState(lock_entity);
    const odometerState = this._getState(odometer_entity);

    const isLocked = lockState?.state === "locked";
    const batteryPct = batteryState ? parseFloat(batteryState.state) : null;
    const rangeKm = rangeState ? parseFloat(rangeState.state) : null;
    const odometerKm = odometerState ? parseFloat(odometerState.state) : null;

    const cardName = name ?? this._deriveName(lockState ?? batteryState);
    const batteryLow = batteryPct !== null && batteryPct < 20;

    this.shadowRoot.innerHTML = `
      <style>${CARD_STYLES}</style>
      <div class="card-root">

        <!-- Header -->
        <div class="card-header">
          ${ICONS.car}
          <div class="card-header-text">
            <span class="card-title">${cardName}</span>
            <span class="card-subtitle">Volvo</span>
          </div>
        </div>

        <!-- Stats grid -->
        <div class="stats-grid">
          ${this._renderBatteryStat(batteryPct, batteryLow)}
          ${this._renderSimpleStat("Range", rangeKm, "km", ICONS.range)}
          ${this._renderSimpleStat("Odometer", odometerKm ? Math.round(odometerKm) : null, "km", ICONS.odometer)}
          ${this._renderLockStat(isLocked, !!lockState)}
        </div>

        <!-- Actions -->
        <div class="actions">
          ${lock_entity ? `
            <button class="action-btn" id="btn-lock" title="Lock">
              ${ICONS.lock} Lock
            </button>
            <button class="action-btn secondary" id="btn-unlock" title="Unlock">
              ${ICONS.unlock} Unlock
            </button>
          ` : ""}
        </div>

      </div>
    `;

    // Attach button handlers after rendering
    this.shadowRoot.getElementById("btn-lock")?.addEventListener("click", () =>
      this._callService("lock", "lock", lock_entity!)
    );
    this.shadowRoot.getElementById("btn-unlock")?.addEventListener("click", () =>
      this._callService("lock", "unlock", lock_entity!)
    );
  }

  private _renderBatteryStat(pct: number | null, low: boolean): string {
    const display = pct !== null ? `${Math.round(pct)}` : "—";
    const barWidth = pct !== null ? Math.round(pct) : 0;
    return `
      <div class="stat-card">
        <span class="stat-label">Battery</span>
        <span class="stat-value ${pct === null ? "unavailable" : ""}">
          ${display}<span class="stat-unit"> %</span>
        </span>
        <div class="battery-bar-wrap">
          <div class="battery-bar ${low ? "low" : ""}" style="width:${barWidth}%"></div>
        </div>
      </div>
    `;
  }

  private _renderSimpleStat(
    label: string,
    value: number | null,
    unit: string,
    _icon: string
  ): string {
    const display = value !== null ? `${value.toLocaleString()}` : "—";
    return `
      <div class="stat-card">
        <span class="stat-label">${label}</span>
        <span class="stat-value ${value === null ? "unavailable" : ""}">
          ${display}<span class="stat-unit"> ${unit}</span>
        </span>
      </div>
    `;
  }

  private _renderLockStat(isLocked: boolean, available: boolean): string {
    const label = available ? (isLocked ? "Locked" : "Unlocked") : "—";
    const icon = isLocked ? ICONS.lock : ICONS.unlock;
    return `
      <div class="stat-card">
        <span class="stat-label">Lock</span>
        <span class="stat-value ${!available ? "unavailable" : ""}" style="display:flex;align-items:center;gap:6px;font-size:1rem;">
          ${available ? icon : ""}
          ${label}
        </span>
      </div>
    `;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private _getState(entityId: string | undefined): HassEntity | null {
    if (!entityId || !this._hass) return null;
    return this._hass.states[entityId] ?? null;
  }

  private _deriveName(state: HassEntity | null): string {
    if (!state) return "Volvo";
    // Strip the sensor key suffix to get the friendly name, e.g.
    // "XC40 Battery Charge Level" → "XC40"
    const friendly = (state.attributes["friendly_name"] as string | undefined) ?? "";
    return friendly.replace(/\s+(battery.*|lock.*|odometer.*|distance.*)$/i, "").trim() || "Volvo";
  }

  private _statesChanged(
    prev: HomeAssistant | null,
    next: HomeAssistant
  ): boolean {
    if (!prev || !this._config) return true;
    const entities = [
      this._config.battery_entity,
      this._config.range_entity,
      this._config.lock_entity,
      this._config.odometer_entity,
    ].filter(Boolean) as string[];

    return entities.some((id) => prev.states[id] !== next.states[id]);
  }

  private _callService(domain: string, service: string, entityId: string): void {
    if (!this._hass) return;
    this._hass.callService(domain, service, { entity_id: entityId }).catch((err) => {
      console.error(`[volvo-car-card] Service call ${domain}.${service} failed:`, err);
    });
  }
}
