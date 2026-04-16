import type { HomeAssistant, HassEntity, VolvoCardConfig } from "./types.js";
import { CARD_STYLES } from "./styles.js";
import { VERSION } from "./version.js";
import {
  ICON_BOLT,
  ICON_FUEL_PUMP,
  ICON_LOCK,
  ICON_LOCK_OPEN,
  ICON_FAN,
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
    return 6;
  }

  getGridOptions() {
    return { rows: 6, columns: 12, min_columns: 2, min_rows: 5 };
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
      battery_entity: find("sensor", "battery_charge_level"),
      range_entity:
        find("sensor", "distance_to_empty_battery") ||
        find("sensor", "distance_to_empty_tank"),
      fuel_entity: find("sensor", "fuel_amount"),
      fuel_range_entity: find("sensor", "distance_to_empty_tank"),
      lock_entity: find("lock", "lock"),
      charging_status_entity: find("sensor", "charging_system_status"),
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

    if (!this._config) {
      this.shadowRoot.innerHTML = `<style>${CARD_STYLES}</style>
        <div class="card-root"><div class="error-box">No configuration provided.</div></div>`;
      return;
    }

    const {
      battery_entity,
      range_entity,
      lock_entity,
      fuel_entity,
      fuel_range_entity,
      charging_status_entity,
      climate_entity,
      vehicle_image_entity,
      name,
    } = this._config;

    const batteryState     = this._getState(battery_entity);
    const rangeState       = this._getState(range_entity);
    const lockState        = this._getState(lock_entity);
    const fuelState        = this._getState(fuel_entity);
    const fuelRangeState   = this._getState(fuel_range_entity);
    const chargingState    = this._getState(charging_status_entity);
    const imageState       = this._getState(vehicle_image_entity);

    const batteryPct   = batteryState  ? parseFloat(batteryState.state)  : null;
    const rangeKm      = rangeState    ? parseFloat(rangeState.state)    : null;
    const fuelPct      = fuelState     ? parseFloat(fuelState.state)     : null;
    const fuelRangeKm  = fuelRangeState ? parseFloat(fuelRangeState.state) : null;

    const isLocked    = lockState?.state === "locked";
    const isEV        = battery_entity != null;
    const cardName    = name ?? this._deriveName(lockState ?? batteryState ?? fuelState);

    // Energy background: use battery % for EV/hybrid, fuel % for ICE-only
    const energyPct     = isEV ? (batteryPct ?? 0) : (fuelPct ?? 0);
    const energyBgStyle = this._energyBgStyle(energyPct, isEV);

    // Vehicle image URL from entity_picture attribute
    const imageUrl = imageState
      ? (imageState.attributes["entity_picture"] as string | undefined) ?? ""
      : "";

    // Charging status label
    const chargingLabel = this._chargingLabel(chargingState, batteryPct);

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
            <span class="version-badge" title="Build version">${VERSION}</span>
          </div>

          <!-- Primary range metric -->
          ${this._renderRangeMetric(rangeKm, rangeState)}

          <!-- Energy status rows -->
          <div class="status-block">
            ${isEV ? this._renderChargeRow(batteryPct, chargingLabel) : ""}
            ${this._renderFuelRow(fuelPct, fuelRangeKm, isEV)}
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
            <button class="circle-btn" id="btn-lock" title="${isLocked ? "Unlock" : "Lock"}">
              ${isLocked ? ICON_LOCK : ICON_LOCK_OPEN}
            </button>
          ` : ""}
          ${lock_entity && isLocked ? `
            <button class="circle-btn" id="btn-unlock" title="Unlock">
              ${ICON_LOCK_OPEN}
            </button>
          ` : ""}
          ${climate_entity ? `
            <button class="circle-btn" id="btn-climate" title="Start climate">
              ${ICON_FAN}
            </button>
          ` : ""}
        </div>

      </div>
    `;

    this._attachHandlers(lock_entity, isLocked, climate_entity);
  }

  // ── Sub-renderers ────────────────────────────────────────────────────────

  private _renderRangeMetric(rangeKm: number | null, rangeState: HassEntity | null): string {
    if (!rangeState) {
      return `<div class="range-metric"><span class="range-unavailable">— km</span></div>`;
    }
    if (rangeKm === null || isNaN(rangeKm)) {
      return `<div class="range-metric"><span class="range-unavailable">Updating…</span></div>`;
    }
    return `
      <div class="range-metric">
        <span class="range-value">${Math.round(rangeKm).toLocaleString()}</span>
        <span class="range-unit">km</span>
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

  private _renderFuelRow(pct: number | null, rangeKm: number | null, isEV: boolean): string {
    // Omit the row entirely for EV-only vehicles with no fuel data
    if (pct === null && !this._config?.fuel_entity) return "";

    const display = pct !== null ? `${Math.round(pct)}%` : "—";
    const rangeLabel = rangeKm !== null && !isNaN(rangeKm)
      ? `${Math.round(rangeKm)} km`
      : "—";

    return `
      <div class="status-row">
        <span class="status-icon">${ICON_FUEL_PUMP}</span>
        <span class="status-pct secondary">${display}</span>
        ${this._renderSegBar(pct, "blue")}
        <span class="status-label secondary">${rangeLabel}</span>
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

  private _energyBgStyle(pct: number, isEV: boolean): string {
    const pctStr = `${Math.max(0, Math.min(100, pct))}%`;
    const fadeStart = `${Math.max(0, pct - 18)}%`;

    if (isEV) {
      // Green diffusion – mint / soft lime
      return `background: linear-gradient(to right,
        rgba(134,239,172,0.30) 0%,
        rgba(74,222,128,0.22) ${fadeStart},
        rgba(74,222,128,0.04) ${pctStr},
        transparent 100%);`;
    } else {
      // Blue diffusion – pale azure / icy blue
      return `background: linear-gradient(to right,
        rgba(147,197,253,0.30) 0%,
        rgba(59,130,246,0.20) ${fadeStart},
        rgba(59,130,246,0.04) ${pctStr},
        transparent 100%);`;
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private _chargingLabel(state: HassEntity | null, batteryPct: number | null): string {
    if (!state) {
      if (batteryPct !== null && batteryPct >= 100) return "Fully charged";
      return "Ready to drive";
    }
    const s = state.state.toLowerCase();
    if (s.includes("charging")) return state.state;
    if (s.includes("full"))     return "Fully charged";
    if (s.includes("schedul"))  return "Charge scheduled";
    return state.state || "Ready to drive";
  }

  private _getState(entityId: string | undefined): HassEntity | null {
    if (!entityId || !this._hass) return null;
    return this._hass.states[entityId] ?? null;
  }

  private _deriveName(state: HassEntity | null): string {
    if (!state) return "Volvo";
    const friendly = (state.attributes["friendly_name"] as string | undefined) ?? "";
    return (
      friendly
        .replace(/\s+(battery.*|lock.*|odometer.*|distance.*|fuel.*|charging.*|camera.*)$/i, "")
        .trim() || "Volvo"
    );
  }

  private _statesChanged(prev: HomeAssistant | null, next: HomeAssistant): boolean {
    if (!prev || !this._config) return true;
    const entities = [
      this._config.battery_entity,
      this._config.range_entity,
      this._config.lock_entity,
      this._config.fuel_entity,
      this._config.fuel_range_entity,
      this._config.charging_status_entity,
      this._config.climate_entity,
      this._config.vehicle_image_entity,
    ].filter(Boolean) as string[];

    return entities.some((id) => prev.states[id] !== next.states[id]);
  }

  private _attachHandlers(
    lock_entity: string | undefined,
    isLocked: boolean,
    climate_entity: string | undefined
  ): void {
    const root = this.shadowRoot!;

    root.getElementById("btn-lock")?.addEventListener("click", () => {
      if (!lock_entity) return;
      const svc = isLocked ? "unlock" : "lock";
      this._callService("lock", svc, lock_entity);
    });

    root.getElementById("btn-unlock")?.addEventListener("click", () => {
      if (!lock_entity) return;
      this._callService("lock", "unlock", lock_entity);
    });

    root.getElementById("btn-climate")?.addEventListener("click", () => {
      if (!climate_entity) return;
      this._callService("climate", "turn_on", climate_entity);
    });
  }

  private _callService(domain: string, service: string, entityId: string): void {
    if (!this._hass) return;
    this._hass.callService(domain, service, { entity_id: entityId }).catch((err) => {
      console.error(`[volvo-car-card] Service call ${domain}.${service} failed:`, err);
    });
  }
}

