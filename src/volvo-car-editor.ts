import type { HomeAssistant, VolvoCardConfig } from "./types.js";

interface PickerField {
  field: keyof VolvoCardConfig;
  label: string;
  domains: string[];
}

const PICKER_FIELDS: PickerField[] = [
  { field: "battery_entity", label: "Battery Level", domains: ["sensor"] },
  { field: "range_entity", label: "Range", domains: ["sensor"] },
  { field: "lock_entity", label: "Lock", domains: ["lock"] },
  { field: "odometer_entity", label: "Odometer", domains: ["sensor"] },
];

/**
 * Volvo Car Card editor element.
 * Rendered by HA when the user opens the visual card editor.
 * Fires `config-changed` events as the user modifies settings.
 *
 * Key constraint: innerHTML does NOT support .property bindings.
 * ha-entity-picker requires hass, value and includeDomains to be set
 * as JS properties, not HTML attributes. We build the DOM once and
 * then imperatively set properties via _applyProperties().
 */
export class VolvoCarEditor extends HTMLElement {
  private _config: VolvoCardConfig = { type: "custom:volvo-car-card" };
  private _hass?: HomeAssistant;
  private _built = false;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    // Only need to update the hass property on existing pickers, no full re-render
    if (this._built) this._applyProperties();
  }

  setConfig(config: VolvoCardConfig): void {
    this._config = { ...config };
    if (this._built) this._applyProperties();
  }

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._buildDOM();
    this._applyProperties();
    this._built = true;
  }

  /** Build the static DOM structure once. */
  private _buildDOM(): void {
    const root = this.shadowRoot!;
    root.innerHTML = `
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
        ${PICKER_FIELDS.map(
          (f) => `<ha-entity-picker
            label="${f.label}"
            data-field="${f.field}"
            allow-custom-entity
          ></ha-entity-picker>`
        ).join("\n")}
      </div>
    `;

    // Wire up event listeners once (DOM is stable after this point)
    root.querySelectorAll<HTMLElement>("ha-entity-picker").forEach((el) => {
      el.addEventListener("value-changed", (e: Event) => {
        const field = el.dataset.field as keyof VolvoCardConfig;
        const value: string = (e as CustomEvent).detail.value ?? "";
        this._updateConfig(field, value || undefined);
      });
    });

    root.querySelector<HTMLElement>("ha-textfield")?.addEventListener(
      "change",
      (e: Event) => {
        const value = (e.target as HTMLInputElement).value;
        this._updateConfig("name", value || undefined);
      }
    );
  }

  /**
   * Imperatively push JS properties onto the HA custom elements.
   * Must be called after every hass/config change because innerHTML
   * attribute syntax cannot set object properties.
   */
  private _applyProperties(): void {
    const root = this.shadowRoot;
    if (!root) return;
    const cfg = this._config;

    // Name text field – set value as property
    const nameField = root.querySelector("ha-textfield") as HTMLElement & {
      value: string;
    };
    if (nameField) nameField.value = cfg.name ?? "";

    // Entity pickers
    root.querySelectorAll<HTMLElement>("ha-entity-picker").forEach((el) => {
      const field = el.dataset.field as keyof VolvoCardConfig;
      const pickerDef = PICKER_FIELDS.find((f) => f.field === field);

      // Cast to any to set Lit/Polymer JS properties
      const picker = el as HTMLElement & Record<string, unknown>;
      picker["hass"] = this._hass;
      picker["value"] = (cfg[field] as string | undefined) ?? "";
      if (pickerDef) picker["includeDomains"] = pickerDef.domains;
    });
  }

  private _updateConfig(
    field: keyof VolvoCardConfig,
    value: string | undefined
  ): void {
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
