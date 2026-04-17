import { getTranslations } from "./i18n/index.js";
import type { HomeAssistant, VolvoCardConfig } from "./types.js";

/**
 * Schema consumed by <ha-form>.
 * ha-form handles all property wiring and entity picker rendering internally —
 * this is the correct HA pattern instead of individual <ha-entity-picker> elements.
 */
const SCHEMA = [
  { name: "name", selector: { text: {} } },
  {
    name: "battery_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "battery_range_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "fuel_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "fuel_range_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "lock_entity",
    selector: { entity: { filter: [{ domain: "lock" }] } },
  },
  {
    name: "charging_status_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "climate_entity",
    selector: { entity: { filter: [{ domain: "button" }] } },
  },
  {
    name: "engine_start_entity",
    selector: { entity: { filter: [{ domain: "button" }] } },
  },
  {
    name: "engine_stop_entity",
    selector: { entity: { filter: [{ domain: "button" }] } },
  },
  {
    name: "vehicle_image_entity",
    selector: { entity: { filter: [{ domain: "camera" }, { domain: "image" }] } },
  },
  {
    name: "vehicle_image_url",
    selector: { text: {} },
  },
];

/**
 * Volvo Car Card editor element.
 * Uses <ha-form> with a schema — the recommended HA pattern for card editors.
 * ha-form handles all property assignment and picker rendering internally.
 */
export class VolvoCarEditor extends HTMLElement {
  private _config: VolvoCardConfig = { type: "custom:volvo-car-card" };
  private _hass?: HomeAssistant;
  private _built = false;
  private _form?: HTMLElement & Record<string, unknown>;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._form) {
      this._form["hass"] = hass;
      this._form["computeLabel"] = this._makeComputeLabel();
    }
  }

  setConfig(config: VolvoCardConfig): void {
    this._config = { ...config };
    if (this._form) this._form["data"] = this._config;
  }

  private _makeComputeLabel(): (item: { name: string }) => string {
    const labels = getTranslations(this._hass?.language ?? "en").editor;
    return (item) => (labels as Record<string, string>)[item.name] ?? item.name;
  }

  connectedCallback(): void {
    if (this._built) return;
    this._built = true;

    this.attachShadow({ mode: "open" });
    const root = this.shadowRoot!;

    root.innerHTML = `<style>
      ha-form { display: block; }
    </style>`;

    const form = document.createElement("ha-form") as HTMLElement &
      Record<string, unknown>;
    this._form = form;

    form["hass"] = this._hass;
    form["data"] = this._config;
    form["schema"] = SCHEMA;
    form["computeLabel"] = this._makeComputeLabel();

    form.addEventListener("value-changed", (e: Event) => {
      const newConfig: VolvoCardConfig = {
        ...((e as CustomEvent).detail.value as VolvoCardConfig),
        type: "custom:volvo-car-card",
      };
      this._config = newConfig;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: newConfig },
          bubbles: true,
          composed: true,
        })
      );
    });

    root.appendChild(form);
  }
}
