import type { HomeAssistant, VolvoCardConfig } from "./types.js";

const LABELS: Record<string, string> = {
  name: "Card name (optional)",
  battery_entity: "Battery Level entity",
  range_entity: "Range entity",
  lock_entity: "Lock entity",
  odometer_entity: "Odometer entity",
};

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
    name: "range_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
  },
  {
    name: "lock_entity",
    selector: { entity: { filter: [{ domain: "lock" }] } },
  },
  {
    name: "odometer_entity",
    selector: { entity: { filter: [{ domain: "sensor" }] } },
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
    if (this._form) this._form["hass"] = hass;
  }

  setConfig(config: VolvoCardConfig): void {
    this._config = { ...config };
    if (this._form) this._form["data"] = this._config;
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
    form["computeLabel"] = (item: { name: string }) =>
      LABELS[item.name] ?? item.name;

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
