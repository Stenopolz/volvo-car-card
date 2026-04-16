# Volvo Car Card – Copilot Instructions

## Project Overview
This repository contains a custom [Home Assistant](https://www.home-assistant.io/) Lovelace card that surfaces data and actions from the official [Volvo Cars integration](https://github.com/home-assistant/core/tree/dev/homeassistant/components/volvo).

**Stack:**
- **Language:** TypeScript (strict mode)
- **Bundler:** [Bun](https://bun.sh) — `bun build src/index.ts --outfile dist/volvo-car-card.js`
- **No frameworks** — plain `HTMLElement` subclasses (no Lit, no React)
- **Source:** `src/` → **Bundle:** `dist/volvo-car-card.js`

---

## Architecture

```
src/
  index.ts            # Entry point; registers custom elements + HA card registry
  volvo-car-card.ts   # Main card element (VolvoCarCard extends HTMLElement)
  volvo-car-editor.ts # Visual card editor (VolvoCarEditor extends HTMLElement)
  types.ts            # Shared TypeScript interfaces
  styles.ts           # CSS (CARD_STYLES exported as a string)
```

---

## Home Assistant Custom Card Conventions

### Card Element (`VolvoCarCard`)
Must implement:
- `setConfig(config)` — validate and store config; throw to show an error card
- `set hass(hass)` — HA passes updated state here on every entity change; trigger `_render()` only when relevant entities changed (see `_statesChanged()` helper)
- `getCardSize()` — return a number (height in 50px units) for masonry view
- `getGridOptions()` — return `{ rows, columns, min_rows }` for sections view
- `static getConfigElement()` — return the editor element instance
- `static getStubConfig()` — return an empty/default config object

### Editor Element (`VolvoCarEditor`)
- Extends `HTMLElement`, uses Shadow DOM
- Receives `hass` and `setConfig()` from HA
- Fires `config-changed` custom event (bubbles, composed) with `{ detail: { config } }` on any change
- Uses HA's built-in `<ha-entity-picker>` and `<ha-textfield>` web components — they are available globally in the HA frontend

### Registering Cards
Both elements are registered via `customElements.define()` in `src/index.ts`. The card also pushes to `window.customCards[]` so it appears in the "Add Card" picker.

---

## Volvo Integration Entity Patterns

Entities follow the pattern: `<platform>.<friendly_name_slug>_<sensor_key>`

| Category | Key examples |
|----------|-------------|
| Sensors | `battery_charge_level`, `distance_to_empty_battery`, `distance_to_empty_tank`, `odometer`, `charging_status`, `charger_connection_status`, `charging_power`, `fuel_amount`, `average_speed` |
| Binary sensors | `door_front_left`, `door_front_right`, `door_rear_left`, `door_rear_right`, `hood`, `tailgate`, `engine_status`, `window_front_left/right`, `tire_front_left/right` |
| Lock | `lock` (central lock) |
| Buttons | `climatization_start`, `climatization_stop`, `engine_start`, `engine_stop`, `honk`, `flash`, `honk_flash`, `lock_reduced_guard` |

---

## Styling Guidelines

- Use HA CSS custom properties for theming — **never** hard-code colours:
  - `--primary-color` — accent/brand colour
  - `--primary-text-color` — main text
  - `--secondary-text-color` — muted text
  - `--card-background-color` / `--ha-card-background` — card surface
  - `--secondary-background-color` — subtle fills
  - `--divider-color` — borders
  - `--error-color` — errors / warnings
- All styles live in `src/styles.ts` as a CSS template string, injected into each Shadow DOM via `<style>${CARD_STYLES}</style>`
- Cards must work in both light and dark HA themes automatically

---

## Service Calls

Use `hass.callService(domain, service, { entity_id })`:

```ts
// Lock the car
hass.callService("lock", "lock", { entity_id: "lock.xc40_lock" });

// Call a Volvo button press
hass.callService("button", "press", { entity_id: "button.xc40_climatization_start" });
```

---

## Build & Test Workflow

```bash
# Install dependencies (first time)
bun install

# Production build → dist/volvo-car-card.js
bun run build

# Development build with source maps
bun run build:dev

# Watch mode for iterative development
bun run watch
```

Copy `dist/volvo-car-card.js` to your HA `<config>/www/` folder, then add a resource and use `type: custom:volvo-car-card` in your dashboard YAML.
