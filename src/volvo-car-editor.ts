import type { HomeAssistant, VolvoCardConfig } from "./types.js";

/**
 * Volvo Car Card editor element.
 * Rendered by HA when the user opens the visual card editor.
 * Fires `config-changed` events as the user modifies settings.
 */
export class VolvoCarEditor extends HTMLElement {
  private _config: VolvoCardConfig = { type: "custom:volvo-car-card" };
  private _hass?: HomeAssistant;
  private _attached = false;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    // Re-render to refresh entity picker options if needed
    if (this._attached) this._render();
  }

  setConfig(config: VolvoCardConfig): void {
    this._config = { ...config };
    if (this._attached) this._render();
  }

  connectedCallback(): void {
    this._attached = true;
    this.attachShadow({ mode: "open" });
    this._render();
  }

  disconnectedCallback(): void {
    this._attached = false;
  }

  private _render(): void {
    if (!this.shadowRoot) return;

    const cfg = this._config;

    this.shadowRoot.innerHTML = `
      <style>
        .editor-root {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0;
        }
        .row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-text-color);
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: 4px;
          margin-top: 4px;
        }
      </style>
      <div class="editor-root">
        <div class="section-title">General</div>

        <div class="row">
          <label>Card Name (optional)</label>
          <ha-textfield
            label="Name override"
            .value="${cfg.name ?? ""}"
            data-field="name"
          ></ha-textfield>
        </div>

        <div class="section-title">Entities</div>

        <div class="row">
          <label>Battery Level</label>
          <ha-entity-picker
            label="Battery entity (e.g. sensor.*_battery_charge_level)"
            .hass="${this._hass}"
            .value="${cfg.battery_entity ?? ""}"
            .includeDomains="${["sensor"]}"
            data-field="battery_entity"
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <label>Range</label>
          <ha-entity-picker
            label="Range entity (e.g. sensor.*_distance_to_empty_battery)"
            .hass="${this._hass}"
            .value="${cfg.range_entity ?? ""}"
            .includeDomains="${["sensor"]}"
            data-field="range_entity"
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <label>Lock</label>
          <ha-entity-picker
            label="Lock entity (e.g. lock.*_lock)"
            .hass="${this._hass}"
            .value="${cfg.lock_entity ?? ""}"
            .includeDomains="${["lock"]}"
            data-field="lock_entity"
            allow-custom-entity
          ></ha-entity-picker>
        </div>

        <div class="row">
          <label>Odometer</label>
          <ha-entity-picker
            label="Odometer entity (e.g. sensor.*_odometer)"
            .hass="${this._hass}"
            .value="${cfg.odometer_entity ?? ""}"
            .includeDomains="${["sensor"]}"
            data-field="odometer_entity"
            allow-custom-entity
          ></ha-entity-picker>
        </div>
      </div>
    `;

    // Attach event listeners after rendering
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach((el) => {
      el.addEventListener("value-changed", (e: Event) => {
        const field = (el as HTMLElement).dataset.field as keyof VolvoCardConfig;
        const value = (e as CustomEvent).detail.value;
        this._updateConfig(field, value);
      });
    });

    this.shadowRoot.querySelectorAll("ha-textfield").forEach((el) => {
      el.addEventListener("change", (e: Event) => {
        const field = (el as HTMLElement).dataset.field as keyof VolvoCardConfig;
        const value = (e.target as HTMLInputElement).value;
        this._updateConfig(field, value || undefined);
      });
    });
  }

  private _updateConfig(field: keyof VolvoCardConfig, value: string | undefined): void {
    const newConfig: VolvoCardConfig = { ...this._config };
    if (value) {
      (newConfig as Record<string, unknown>)[field] = value;
    } else {
      delete (newConfig as Record<string, unknown>)[field];
    }
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}
