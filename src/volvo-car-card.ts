import type { HomeAssistant, HassEntity, VolvoCardConfig } from "./types.js";
import { CARD_STYLES } from "./styles.js";
import { VERSION } from "./version.js";
import { getTranslations } from "./i18n/index.js";
import {
  ICON_BOLT,
  ICON_FUEL_PUMP,
  ICON_LOCK,
  ICON_LOCK_OPEN,
  ICON_FAN,
  ICON_ENGINE_ON,
  ICON_ENGINE_OFF,
} from "./icons/index.js";

/** Placeholder car silhouette shown when no vehicle_image_entity is configured. */
const CAR_PLACEHOLDER_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
</svg>`;

const SEGMENTS = 10;

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

  setConfig(config: VolvoCardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    if (this._initialized) this._render();
  }

  set hass(hass: HomeAssistant) {
    const prev = this._hass;
    this._hass = hass;
    if (this._initialized && this._config && this._statesChanged(prev, hass)) {
      this._render();
    }
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions() {
    return { rows: 8, columns: 12, min_columns: 2, min_rows: 6 };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("volvo-car-editor");
  }

  static getStubConfig(hass?: HomeAssistant): VolvoCardConfig {
    const find = (domain: string, suffix: string): string =>
      hass
        ? Object.keys(hass.states).find(
            (id) => id.startsWith(`${domain}.`) && id.endsWith(`_${suffix}`)
          ) ?? ""
        : "";

    return {
      type: "custom:volvo-car-card",
      battery_entity: find("sensor", "battery"),
      battery_range_entity: find("sensor", "distance_to_empty_battery"),
      fuel_entity: find("sensor", "fuel_amount"),
      fuel_range_entity: find("sensor", "distance_to_empty_tank"),
      lock_entity: find("lock", "lock"),
      charging_status_entity: find("sensor", "charging_status"),
      climate_entity: find("button", "start_climatization"),
      engine_start_entity: find("button", "start_engine"),
      engine_stop_entity: find("button", "stop_engine"),
      vehicle_image_entity: find("camera", "exterior"),
    };
  }

  // ── DOM lifecycle ────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (!this._initialized) {
      this.attachShadow({ mode: "open" });
      this._initialized = true;
    }
    this._render();
  }

  disconnectedCallback(): void {
    // Shadow root persists across moves; do not reset _initialized.
  }

  // ── Rendering ────────────────────────────────────────────────────────────

  private _render(): void {
    if (!this.shadowRoot) return;

    const t = getTranslations(this._hass?.language ?? "en");

    if (!this._config) {
      this.shadowRoot.innerHTML = `<style>${CARD_STYLES}</style>
        <div class="card-root"><div class="error-box">${t.no_config}</div></div>`;
      return;
    }

    const {
      battery_entity,
      battery_range_entity,
      lock_entity,
      fuel_entity,
      fuel_range_entity,
      charging_status_entity,
      climate_entity,
      engine_start_entity,
      engine_stop_entity,
      vehicle_image_entity,
      name,
    } = this._config;

    const batteryState     = this._getState(battery_entity);
    const rangeState       = this._getState(battery_range_entity);
    const lockState        = this._getState(lock_entity);
    const fuelState        = this._getState(fuel_entity);
    const fuelRangeState   = this._getState(fuel_range_entity);
    const chargingState    = this._getState(charging_status_entity);
    const imageState       = this._getState(vehicle_image_entity);

    const batteryPct   = batteryState  ? parseFloat(batteryState.state)  : null;
    const rangeKm      = rangeState    ? parseFloat(rangeState.state)    : null;
    const fuelPct      = fuelState     ? parseFloat(fuelState.state)     : null;
    const fuelRangeKm  = fuelRangeState ? parseFloat(fuelRangeState.state) : null;

    const isLocked  = lockState?.state === "locked";
    const isEV      = battery_entity != null;
    const cardName  = name ?? this._deriveName(lockState ?? batteryState ?? fuelState, t.default_name);

    // Background: EV-only → green fill (battery %); fuel range present → no background
    const energyBgStyle = fuel_range_entity
      ? ""
      : this._energyBgStyle(batteryPct ?? 0);

    // Vehicle image URL from entity_picture attribute
    const imageUrl = imageState
      ? (imageState.attributes["entity_picture"] as string | undefined) ?? ""
      : "";

    // Charging status label
    const chargingLabel = this._chargingLabel(chargingState, batteryPct, t);

    this.shadowRoot.innerHTML = `
      <style>${CARD_STYLES}</style>
      <div class="card-root">

        <!-- Energy background layer -->
        <div class="energy-bg" style="${energyBgStyle}"></div>

        <!-- Top content -->
        <div class="card-content">

          <!-- Header: vehicle name + version -->
          <div class="card-header">
            <span class="vehicle-name">${cardName}</span>
            <!-- uncomment version badge when debugging -->
            <!--<span class="version-badge" title="${t.version_tooltip}">${VERSION}</span>-->
          </div>

          <!-- Primary range metric -->
          ${this._renderRangeMetric(rangeKm, rangeState, fuelRangeKm, fuelRangeState, t)}

          <!-- Energy status rows -->
          <div class="status-block">
            ${isEV ? this._renderChargeRow(batteryPct, chargingLabel) : ""}
            ${this._renderFuelRow(fuelPct, fuelState)}
          </div>

        </div>

        <!-- Vehicle hero image -->
        <div class="hero-zone">
          ${imageUrl
            ? `<img class="car-image" src="${imageUrl}" alt="${cardName}" />`
            : `<div class="hero-placeholder">${CAR_PLACEHOLDER_SVG}</div>`}
        </div>

        <!-- Quick-action buttons -->
        <div class="actions-bar">
          ${lock_entity ? `
            <div class="btn-wrap">
              <button class="circle-btn" id="btn-lock" title="${isLocked ? t.btn.unlock : t.btn.lock}">
                ${isLocked ? ICON_LOCK_OPEN : ICON_LOCK}
              </button>
              <span class="btn-label">${isLocked ? t.btn.unlock : t.btn.lock}</span>
            </div>
          ` : ""}
          ${climate_entity ? `
            <div class="btn-wrap">
              <button class="circle-btn" id="btn-climate" title="${t.btn.climate}">
                ${ICON_FAN}
              </button>
              <span class="btn-label">${t.btn.climate}</span>
            </div>
          ` : ""}
          ${engine_start_entity ? `
            <div class="btn-wrap">
              <button class="circle-btn" id="btn-engine-start" title="${t.btn.engine_start}">
                ${ICON_ENGINE_ON}
              </button>
              <span class="btn-label">${t.btn.engine_start}</span>
            </div>
          ` : ""}
          ${engine_stop_entity ? `
            <div class="btn-wrap">
              <button class="circle-btn" id="btn-engine-stop" title="${t.btn.engine_stop}">
                ${ICON_ENGINE_OFF}
              </button>
              <span class="btn-label">${t.btn.engine_stop}</span>
            </div>
          ` : ""}
        </div>

      </div>
    `;

    this._attachHandlers(lock_entity, isLocked, climate_entity, engine_start_entity, engine_stop_entity);
  }

  // ── Sub-renderers ────────────────────────────────────────────────────────

  private _renderRangeMetric(
    rangeKm: number | null,
    rangeState: HassEntity | null,
    fuelRangeKm: number | null,
    fuelRangeState: HassEntity | null,
    t: { updating: string }
  ): string {
    const hasElectric = rangeState !== null && rangeKm !== null && !isNaN(rangeKm);
    const hasFuel     = fuelRangeState !== null && fuelRangeKm !== null && !isNaN(fuelRangeKm);

    // Both ranges available → combined "440 + 40 km" layout (fuel first)
    if (hasElectric && hasFuel) {
      const total = Math.round(fuelRangeKm!) + Math.round(rangeKm!);
      return `
        <div class="range-metric range-metric--combined">
          <div class="range-combined-total">
            <span class="range-value">${total.toLocaleString()}</span>
            <span class="range-unit">km</span>
          </div>
          <div class="range-breakdown">
            <span class="range-part">
              <span class="range-part-icon range-part-icon--fuel">${ICON_FUEL_PUMP}</span>
              ${Math.round(fuelRangeKm!)}
            </span>
            <span class="range-sep">+</span>
            <span class="range-part">
              <span class="range-part-icon range-part-icon--electric">${ICON_BOLT}</span>
              ${Math.round(rangeKm!)}
            </span>
            <span class="range-part-unit">km</span>
          </div>
        </div>
      `;
    }

    // Single range
    if (!rangeState && !fuelRangeState) {
      return `<div class="range-metric"><span class="range-unavailable">— km</span></div>`;
    }
    const km = hasElectric ? rangeKm! : hasFuel ? fuelRangeKm! : null;
    if (km === null) {
      return `<div class="range-metric"><span class="range-unavailable">${t.updating}</span></div>`;
    }
    const icon = hasElectric ? ICON_BOLT : ICON_FUEL_PUMP;
    const iconClass = hasElectric ? "range-part-icon--electric" : "range-part-icon--fuel";
    return `
      <div class="range-metric">
        <span class="range-value">${Math.round(km).toLocaleString()}</span>
        <span class="range-unit">km</span>
        <span class="range-part-icon ${iconClass} range-single-icon">${icon}</span>
      </div>
    `;
  }

  private _renderChargeRow(pct: number | null, label: string): string {
    const display = pct !== null ? `${Math.round(pct)}%` : "—";
    return `
      <div class="status-row">
        <span class="status-icon">${ICON_BOLT}</span>
        <span class="status-pct">${display}</span>
        ${this._renderSegBar(pct, "green")}
        <span class="status-label">${label}</span>
      </div>
    `;
  }

  private _renderFuelRow(liters: number | null, fuelState: HassEntity | null): string {
    if (!this._config?.fuel_entity) return "";

    const unit = (fuelState?.attributes["unit_of_measurement"] as string | undefined) ?? "L";
    const display = liters !== null && !isNaN(liters)
      ? `${Math.round(liters)} ${unit}`
      : "—";

    return `
      <div class="status-row status-row--fuel">
        <span class="status-icon">${ICON_FUEL_PUMP}</span>
        <span class="status-pct">${display}</span>
      </div>
    `;
  }

  private _renderSegBar(pct: number | null, color: "green" | "blue"): string {
    const filled = pct !== null && !isNaN(pct) ? Math.round(pct / (100 / SEGMENTS)) : 0;
    const segs = Array.from({ length: SEGMENTS }, (_, i) =>
      `<span class="seg ${i < filled ? color : ""}"></span>`
    ).join("");
    return `<div class="seg-bar">${segs}</div>`;
  }

  // ── Energy background ────────────────────────────────────────────────────

  private _energyBgStyle(batteryPct: number): string {
    const pct = Math.max(0, Math.min(100, batteryPct));
    const edgeStart = `${Math.max(0, pct - 1)}%`;
    const edgeEnd   = `${pct}%`;
    // Sharper green edge: full opacity up to near the cutoff, quick fade at the edge
    return `background: linear-gradient(to right,
      rgba(74,222,128,0.28) 0%,
      rgba(74,222,128,0.28) ${edgeStart},
      rgba(74,222,128,0.06) ${edgeEnd},
      transparent 100%);`;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private _chargingLabel(
    state: HassEntity | null,
    batteryPct: number | null,
    t: { state: { fully_charged: string; ready_to_drive: string; idle: string; charging: string; scheduled: string; discharging: string; error: string; done: string } }
  ): string {
    if (!state) {
      if (batteryPct !== null && batteryPct >= 100) return t.state.fully_charged;
      return t.state.ready_to_drive;
    }
    switch (state.state.toLowerCase().trim()) {
      case "idle":        return t.state.idle;
      case "charging":    return t.state.charging;
      case "scheduled":   return t.state.scheduled;
      case "discharging": return t.state.discharging;
      case "error":       return t.state.error;
      case "done":        return t.state.done;
      default:            return state.state || t.state.ready_to_drive;
    }
  }

  private _getState(entityId: string | undefined): HassEntity | null {
    if (!entityId || !this._hass) return null;
    return this._hass.states[entityId] ?? null;
  }

  private _deriveName(state: HassEntity | null, defaultName: string): string {
    if (!state) return defaultName;
    const friendly = (state.attributes["friendly_name"] as string | undefined) ?? "";
    return (
      friendly
        .replace(/\s+(battery.*|lock.*|odometer.*|distance.*|fuel.*|charging.*|camera.*)$/i, "")
        .trim() || defaultName
    );
  }

  private _statesChanged(prev: HomeAssistant | null, next: HomeAssistant): boolean {
    if (!prev || !this._config) return true;
    const entities = [
      this._config.battery_entity,
      this._config.battery_range_entity,
      this._config.lock_entity,
      this._config.fuel_entity,
      this._config.fuel_range_entity,
      this._config.charging_status_entity,
      this._config.climate_entity,
      this._config.engine_start_entity,
      this._config.engine_stop_entity,
      this._config.vehicle_image_entity,
    ].filter(Boolean) as string[];

    return entities.some((id) => prev.states[id] !== next.states[id]);
  }

  private _attachHandlers(
    lock_entity: string | undefined,
    isLocked: boolean,
    climate_entity: string | undefined,
    engine_start_entity: string | undefined,
    engine_stop_entity: string | undefined
  ): void {
    const root = this.shadowRoot!;

    root.getElementById("btn-lock")?.addEventListener("click", () => {
      if (!lock_entity) return;
      const svc = isLocked ? "unlock" : "lock";
      this._callService("lock", svc, lock_entity);
    });

    root.getElementById("btn-climate")?.addEventListener("click", () => {
      if (!climate_entity) return;
      const domain = climate_entity.split(".")[0];
      const service = domain === "button" ? "press" : "turn_on";
      this._callService(domain, service, climate_entity);
    });

    root.getElementById("btn-engine-start")?.addEventListener("click", () => {
      if (!engine_start_entity) return;
      this._callService("button", "press", engine_start_entity);
    });

    root.getElementById("btn-engine-stop")?.addEventListener("click", () => {
      if (!engine_stop_entity) return;
      this._callService("button", "press", engine_stop_entity);
    });
  }

  private _callService(domain: string, service: string, entityId: string): void {
    if (!this._hass) return;
    this._hass.callService(domain, service, { entity_id: entityId }).catch((err) => {
      console.error(`[volvo-car-card] Service call ${domain}.${service} failed:`, err);
    });
  }
}

