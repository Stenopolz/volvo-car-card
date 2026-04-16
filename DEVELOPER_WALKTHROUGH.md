# Volvo Car Card — Developer Walkthrough

*Audience: A developer experienced in Kotlin/Android, new to TypeScript and browser-based UI.*

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [TypeScript vs Kotlin — A Quick Orientation](#2-typescript-vs-kotlin--a-quick-orientation)
3. [Project Layout and Build System](#3-project-layout-and-build-system)
4. [How Home Assistant Custom Cards Work](#4-how-home-assistant-custom-cards-work)
5. [File-by-file Walkthrough](#5-file-by-file-walkthrough)
   - [src/types.ts](#srcTypests)
   - [src/icons/index.ts](#srciconsindexts)
   - [src/version.ts and scripts/version.ts](#srcversionts-and-scriptsversionts)
   - [src/styles.ts](#srcstylets)
   - [src/volvo-car-card.ts](#srcvolvo-car-cardts) ← main card logic
   - [src/volvo-car-editor.ts](#srcvolvo-car-editorts)
   - [src/index.ts](#srcindexts)
6. [Data Flow End-to-End](#6-data-flow-end-to-end)
7. [CSS Concepts Used in This Project](#7-css-concepts-used-in-this-project)
8. [Common Tasks / How-Tos](#8-common-tasks--how-tos)

---

## 1. The Big Picture

Home Assistant (HA) is a home automation platform that runs as a local web server. Its frontend is a single-page web app. Users build dashboards by adding **cards** — small rectangular widgets that display sensor data and trigger actions.

This project is one such card: a premium-looking widget that shows your Volvo's remaining range, battery/fuel level, a photo of the car, and buttons to lock/unlock, start climate, and control the engine.

The card is delivered as a single JavaScript file (`dist/volvo-car-card.js`) that the user drops into their HA `www/` folder and references in their `configuration.yaml`. HA then loads it into the browser alongside its own frontend code.

**Technology stack:**
- **TypeScript** — like Kotlin for the JVM, TypeScript is a typed language that compiles down to JavaScript (like how Kotlin compiles to JVM bytecode). Here it compiles (via Bun) to a browser-ready `.js` file.
- **Web Components / Custom Elements** — the browser's built-in component system, analogous to Android's `View`/`ViewGroup` hierarchy. Our card is a single custom HTML element.
- **Shadow DOM** — CSS encapsulation for Web Components. Think of it like a private `RecyclerView` with its own stylesheet that cannot leak in or out.
- **Bun** — a fast JavaScript runtime and bundler (like Gradle but for JS/TS). Replaces the need for npm/webpack.

---

## 2. TypeScript vs Kotlin — A Quick Orientation

Before diving into code, here are the TypeScript concepts you'll encounter most.

### Types and interfaces

```typescript
// TypeScript interface — like a Kotlin interface, but purely for compile-time
// type checking. No runtime overhead whatsoever.
interface HassEntity {
  entity_id: string;   // non-nullable by default (like Kotlin)
  state: string;
  attributes: Record<string, unknown>;  // like Map<String, Any?> in Kotlin
}
```

`Record<K, V>` is TypeScript's built-in map type, equivalent to Kotlin's `Map<K, V>`.  
`unknown` is the safe equivalent of `Any?` — you cannot use it without a type check (like Kotlin's `Any?` with smart casts).

### Optional fields and null safety

```typescript
interface VolvoCardConfig {
  name?: string;          // ? means optional — type is string | undefined
  battery_entity?: string;
}
```

`string | undefined` in TypeScript ≈ `String?` in Kotlin. TypeScript does not distinguish between `null` and `undefined` in everyday use — both mean "absent". The `??` operator is the null-coalescing operator, same as Kotlin's `?:` Elvis operator:

```typescript
const name = config.name ?? "Volvo";  // same as: config.name ?: "Volvo" in Kotlin
```

### Optional chaining

```typescript
state?.attributes["friendly_name"]  // only accesses attributes if state is not null/undefined
```

This is identical to Kotlin's `state?.attributes["friendly_name"]`.

### Classes

```typescript
export class VolvoCarCard extends HTMLElement {
  private _config: VolvoCardConfig | null = null;
  // ...
}
```

TypeScript classes are very close to Kotlin classes. Key differences:
- Access modifiers (`private`, `public`) are TypeScript-only; after compilation they disappear. The underscore prefix `_config` is a convention (not enforced) signalling "internal use".
- `| null` means the field can hold either a `VolvoCardConfig` object or `null` — like `VolvoCardConfig?` in Kotlin.

### `export` and `import`

```typescript
// Exporting — like Kotlin's public top-level declarations
export class VolvoCarCard extends HTMLElement { ... }
export const CARD_STYLES = `...`;

// Importing — like Kotlin's import statement  
import { VolvoCarCard } from "./volvo-car-card.js";
import type { HomeAssistant } from "./types.js";
```

`import type` means "import only for type checking, strip at runtime" — like Kotlin's `typealias` tricks, but simpler.

### Template literals (string templates)

```typescript
const msg = `Hello, ${name}! Battery at ${pct}%`;
```

Identical to Kotlin's `"Hello, $name! Battery at $pct%"` string templates. The multi-line backtick strings are used extensively to build HTML:

```typescript
return `
  <div class="status-row">
    <span>${ICON_BOLT}</span>
    <span>${display}</span>
  </div>
`;
```

This is TS's equivalent of Kotlin's multiline `"""..."""` strings.

### Arrow functions

```typescript
const find = (domain: string, suffix: string): string => { ... };
entities.filter(Boolean)   // Boolean is a built-in filter function
entities.some((id) => prev.states[id] !== next.states[id]);
```

Arrow functions `(params) => body` are like Kotlin lambdas `{ params -> body }`. They're used heavily for callbacks and functional operations (`.map`, `.filter`, `.some`, `.find`).

### `Array.from` and array creation

```typescript
Array.from({ length: SEGMENTS }, (_, i) => `<span class="seg"></span>`)
```

Equivalent to Kotlin's `(0 until SEGMENTS).map { i -> "<span>" }`. Creates an array of 10 items by calling the callback for each index.

### Getters and setters

```typescript
set hass(hass: HomeAssistant) {
  this._hass = hass;
  // ...
}
```

TypeScript has language-level property setters (same syntax as Kotlin's `set(value)`). HA calls `card.hass = newHass` and this setter fires automatically.

---

## 3. Project Layout and Build System

```
volvo-car-card/
├── src/
│   ├── index.ts              ← Entry point: registers custom elements
│   ├── volvo-car-card.ts     ← Main card component (the View)
│   ├── volvo-car-editor.ts   ← Configuration editor component
│   ├── types.ts              ← Interfaces / data models
│   ├── styles.ts             ← All CSS (as a string constant)
│   ├── version.ts            ← Auto-generated build version stamp
│   └── icons/
│       ├── index.ts          ← Exports SVG strings as constants
│       ├── bolt.svg          ← Source SVG files (not bundled directly)
│       └── ...
├── scripts/
│   └── version.ts            ← Pre-build script that stamps version.ts
├── dist/
│   └── volvo-car-card.js     ← Built output — the only file HA needs
├── package.json              ← Project config + build scripts (like build.gradle)
└── tsconfig.json             ← TypeScript compiler settings
```

### Build system: Bun

Bun is used instead of the traditional Node.js + npm + webpack chain. It's faster and simpler. Think of it like Gradle — you run `bun run build` and it handles everything.

```json
// package.json scripts section
"build": "bun scripts/version.ts && bun build src/index.ts --outfile dist/volvo-car-card.js --target browser --minify"
```

This does two things in sequence (`&&`):
1. Runs `scripts/version.ts` — stamps the current git hash into `src/version.ts`
2. Bundles all TypeScript files starting from `src/index.ts` into one minified JS file for the browser

**`tsconfig.json`** tells the TypeScript compiler how to type-check the code:
- `"target": "ES2020"` — what JavaScript standard to compile to (like Android's minSdkVersion in a way)
- `"strict": true` — enables strict null checks (like Kotlin's non-nullable types by default)
- `"noEmit": true` — `tsc` (TypeScript compiler) only type-checks, never writes files; Bun handles actual compilation
- `"lib": ["ES2020", "DOM"]` — tells TypeScript about built-in browser APIs (`HTMLElement`, `document`, etc.)

---

## 4. How Home Assistant Custom Cards Work

HA's dashboard frontend is built on Web Components — a W3C browser standard for creating reusable custom HTML elements. Our card is just a class that extends `HTMLElement`.

Think of it like extending Android's `View` class, but instead of `onDraw()` you set `innerHTML`, and instead of `onAttachedToWindow()` you have `connectedCallback()`.

### The contract HA expects from a card:

| HA calls this on your element | What it's for |
|-------------------------------|---------------|
| `element.setConfig(config)` | Passes the YAML config the user wrote |
| `element.hass = hassObject` (setter) | Passes the live HA state (all entities) every time any state changes |
| `element.getCardSize()` | Returns an integer size hint (in 50px units) for layout |
| `element.getGridOptions()` | Returns grid slot dimensions for sections-view dashboards |
| `ClassName.getConfigElement()` | (static) Returns a config editor element for the visual editor |
| `ClassName.getStubConfig(hass)` | (static) Returns a default config for the "Add card" picker |

### The Web Components lifecycle:

| Browser calls this | Kotlin analog | When |
|--------------------|---------------|------|
| `connectedCallback()` | `onAttachedToWindow()` | Element is inserted into the DOM |
| `disconnectedCallback()` | `onDetachedFromWindow()` | Element is removed from the DOM |

### Shadow DOM

Every card creates a Shadow DOM — an isolated subtree attached to the element:

```typescript
this.attachShadow({ mode: "open" });
```

Think of it like a sealed `FrameLayout` with its own private resources. CSS inside the shadow cannot affect the page outside, and page CSS cannot style elements inside. This is critical because multiple different cards coexist on the same HA dashboard page, and each needs CSS isolation.

The shadow root is accessed via `this.shadowRoot`. Setting `this.shadowRoot.innerHTML = "..."` is how you render — it replaces the entire subtree, similar to calling `view.removeAllViews()` followed by inflation.

---

## 5. File-by-file Walkthrough

---

### `src/types.ts`

**Role:** Pure data model definitions. No logic. Like a Kotlin data classes / interfaces file.

```typescript
export interface HassEntity {
  entity_id: string;       // e.g. "sensor.xc40_battery_charge_level"
  state: string;           // e.g. "82" (always a string, even for numbers!)
  attributes: Record<string, unknown>;  // e.g. { unit_of_measurement: "%" }
  last_changed: string;    // ISO timestamp
  last_updated: string;
}
```

> **Important gotcha:** HA entity state is **always a string**, even for numeric sensors. `"82"` not `82`. That's why you see `parseFloat(state.state)` throughout the card code.

```typescript
export interface HomeAssistant {
  states: Record<string, HassEntity>;  // Map<entityId, entity>
  callService(domain, service, serviceData?): Promise<void>;
  // ...
}
```

`Promise<void>` ≈ Kotlin's `Deferred<Unit>` from coroutines. The card calls `.catch()` on it (like `.exceptionally()`) to handle errors.

```typescript
export interface VolvoCardConfig {
  type: string;
  name?: string;
  battery_entity?: string;
  // ...all other optional config fields
}
```

All entity config fields are optional (`?`) because the card gracefully handles any combination — EV-only, fuel-only, or hybrid. You don't have to configure all of them.

---

### `src/icons/index.ts`

**Role:** Stores Volvo design-system icons as TypeScript string constants.

```typescript
export const ICON_BOLT = `<svg xmlns="..." width="24" height="24" ...>...</svg>`;
export const ICON_FUEL_PUMP = `<svg ...>...</svg>`;
// ...
```

Each icon is an **inline SVG string**. Instead of referencing external image files (which would need separate HTTP requests and CORS handling), the SVG markup is embedded directly in the JavaScript bundle.

**Why not `<img src="icon.svg">`?** Because the card lives inside Shadow DOM with strict encapsulation. External references don't always resolve correctly. Inline SVGs also allow CSS to style them via `fill: currentColor` — the SVG inherits the text color of its container, making theming easy.

The physical `.svg` files in `src/icons/` exist as human-readable references but are **not** imported directly by Bun — only `index.ts` is imported.

---

### `src/version.ts` and `scripts/version.ts`

**`src/version.ts`** is auto-generated on every build:

```typescript
export const VERSION = "743d233 (2026-04-13)";
```

It's a single exported constant containing the git short hash and build date. Displayed as a tiny badge in the card header so you can tell which build is deployed in HA.

**`scripts/version.ts`** is the pre-build script that generates it:

```typescript
import { execSync } from "child_process";  // like Runtime.exec() in Java
import { writeFileSync } from "fs";        // like FileOutputStream

const hash = execSync("git rev-parse --short HEAD").toString().trim();
const date = new Date().toISOString().split("T")[0];  // "2026-04-13"

writeFileSync("src/version.ts", `export const VERSION = "${hash} (${date})";\n`);
```

This runs **before** the TypeScript compilation step in the build script. By the time Bun bundles the TypeScript, `src/version.ts` already has fresh content.

> **Note:** Never manually edit `src/version.ts`. It is overwritten on every build. The `.gitignore` could include it, but currently it's committed so the last built version is visible in source control.

---

### `src/styles.ts`

**Role:** All CSS for the card, exported as a single string constant `CARD_STYLES`.

```typescript
export const CARD_STYLES = `
  :host { ... }
  .card-root { ... }
  /* ... */
`;
```

**Why a string?** Because this CSS lives inside Shadow DOM, not in an external `.css` file. It gets injected as a `<style>` tag directly into the shadow root:

```typescript
this.shadowRoot.innerHTML = `<style>${CARD_STYLES}</style><div class="card-root">...`;
```

The CSS is injected fresh on every `_render()` call. This is not ideal for performance in complex apps, but it's simple and perfectly fine for a single card that re-renders only when state changes.

**Key CSS concepts used:**

#### `:host`

```css
:host {
  display: block;
  width: 100%;
  height: 100%;
}
```

`:host` refers to the custom element itself (the `<volvo-car-card>` tag in the outer DOM). Because elements are `inline` by default in HTML, you must explicitly set `display: block`. `width/height: 100%` makes the card fill whatever slot HA assigns it.

#### Flexbox layout

```css
.card-root {
  display: flex;
  flex-direction: column;  /* children stack vertically */
}
.hero-zone {
  flex: 1;        /* "take all remaining space" */
  min-height: 0;  /* allow shrinking below content size */
}
.actions-bar {
  flex-shrink: 0; /* "do not shrink — always show buttons" */
}
```

Flexbox is the browser equivalent of Android's `LinearLayout`. `flex: 1` on a child is like `android:layout_weight="1"`. `flex-shrink: 0` means "don't compress this element even under space pressure" — like `wrap_content` with `GONE`-proof behavior.

#### CSS Custom Properties (variables)

```css
background: var(--ha-card-background, #f4f4f3);
```

`var(--ha-card-background, #f4f4f3)` reads the CSS variable `--ha-card-background` from the HA theme, falling back to `#f4f4f3` if it's not defined. This allows the card to automatically adopt the user's chosen HA theme colors. Think of it like reading a value from Android's `Theme.resolveAttribute()`.

#### Container Query Units (`cqh`)

```css
.range-value {
  font-size: clamp(1.8rem, 12cqh, 3.5rem);
}
```

`cqh` = **container query height** unit. `12cqh` = 12% of the nearest container's height. The "container" here is `.card-root`, which we declared with `container-type: size`. 

`clamp(min, preferred, max)` = clamp the value between min and max. This makes the range number fluid: small on a compact card, large on a tall one. There's no direct Android equivalent — the closest is `ConstraintLayout` percentage dimensions combined with `sp` text sizing.

#### CSS Grid

```css
.status-row {
  display: grid;
  grid-template-columns: 22px 46px 1fr auto;
}
```

CSS Grid is for two-dimensional layouts. This creates a 4-column row:
- `22px` — fixed icon column
- `46px` — fixed percentage label column  
- `1fr` — segmented bar takes all remaining space ("fraction unit", like `weight`)
- `auto` — rightmost label takes its content width

#### Z-index layering

The card uses three stacked layers achieved via `position: absolute/relative` and `z-index`:
1. **z-index 0** — `.energy-bg`: the green gradient background
2. **z-index 1** — `.card-content`, `.hero-zone`, `.actions-bar`: visible content above

---

### `src/volvo-car-card.ts`

**Role:** The main card element. All rendering logic and HA interaction. This is the equivalent of an Android `Fragment` or `Activity`.

```typescript
export class VolvoCarCard extends HTMLElement {
  private _config: VolvoCardConfig | null = null;
  private _hass: HomeAssistant | null = null;
  private _initialized = false;
  // ...
}
```

**Fields:**
- `_config` — the user's YAML configuration for this card
- `_hass` — the live HA state object (updated by HA on every state change)
- `_initialized` — guards against double shadow-root attachment (HA's polyfill for web components can call `connectedCallback` multiple times)

#### `setConfig(config)`

Called by HA once when the card is first placed on a dashboard, and again whenever the user edits the config in the UI.

```typescript
setConfig(config: VolvoCardConfig): void {
  if (!config) throw new Error("Invalid configuration");
  this._config = { ...config };    // { ...obj } is the spread operator
  if (this._initialized) this._render();
}
```

`{ ...config }` creates a **shallow copy** of the config object — like Kotlin's `config.copy()` on a data class. This prevents the card from accidentally mutating the object HA passed in.

#### `set hass(hass: HomeAssistant)`

Called by HA every time any entity in HA changes state — which can be dozens of times per minute across a busy home. The card must only re-render if its own entities changed.

```typescript
set hass(hass: HomeAssistant) {
  const prev = this._hass;
  this._hass = hass;
  if (this._initialized && this._config && this._statesChanged(prev, hass)) {
    this._render();
  }
}
```

`_statesChanged()` checks whether any of the configured entity IDs have a different state object reference in the new `hass` snapshot. HA is immutable-state-style — every state update creates a new object, so reference equality (`!==`) is a reliable change check, identical in concept to `StateFlow` distinctUntilChanged.

#### `connectedCallback()`

```typescript
connectedCallback(): void {
  if (!this._initialized) {
    this.attachShadow({ mode: "open" });
    this._initialized = true;
  }
  this._render();
}
```

Called when the element is inserted into the DOM. Creates the Shadow DOM on first attachment. Calls `_render()` immediately so the card shows something as soon as it appears.

#### `getCardSize()` and `getGridOptions()`

```typescript
getCardSize(): number { return 8; }

getGridOptions() {
  return { rows: 8, columns: 12, min_columns: 2, min_rows: 6 };
}
```

These tell HA how much space the card wants:
- `getCardSize()` = height in units of 50px (used in masonry view)
- `getGridOptions()` = grid slot request in sections view. `columns: 12` = full 12-column width. `rows: 8` = 8 rows tall (~448px). `min_rows: 6` = the user can shrink it to 6 rows but not less.

#### `getStubConfig(hass?)` (static)

```typescript
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
    // ...
  };
}
```

When the user adds the card from HA's "Add Card" picker, HA calls this static method to pre-fill a sensible default config. The inner `find` function searches all known entity IDs for one matching the expected naming pattern of the Volvo integration. 

`Object.keys(hass.states)` returns an array of all entity ID strings — like `map.keys().toList()` in Kotlin. `.find(predicate)` returns the first match or `undefined`.

#### `_render()`

The heart of the card. Called whenever config or relevant state changes. Rebuilds the entire shadow DOM from scratch.

```typescript
private _render(): void {
  if (!this.shadowRoot) return;
  // ...destructure config fields
  const { battery_entity, range_entity, ... } = this._config;
```

**Destructuring assignment** — `const { a, b } = obj` is shorthand for `val a = obj.a; val b = obj.b`. Like Kotlin's `component functions` but built into the language.

```typescript
  const batteryPct = batteryState ? parseFloat(batteryState.state) : null;
```

This is a ternary expression — `condition ? valueIfTrue : valueIfFalse`. Equivalent to Kotlin's `if (batteryState != null) batteryState.state.toFloat() else null`. `parseFloat()` is like Kotlin's `String.toFloat()` but returns `NaN` on failure instead of throwing.

```typescript
  this.shadowRoot.innerHTML = `
    <style>${CARD_STYLES}</style>
    <div class="card-root">
      ...
      ${isEV ? this._renderChargeRow(batteryPct, chargingLabel) : ""}
      ...
    </div>
  `;
```

Setting `innerHTML` replaces the entire shadow DOM subtree with new HTML. Conditional rendering is done with ternary `? :` expressions inside the template literal — if `isEV` is false, an empty string is inserted (nothing rendered).

After setting `innerHTML`, the method calls `_attachHandlers()` to wire up click listeners on the newly created DOM elements.

#### `_renderRangeMetric()`

Returns an HTML string for the primary range display at the top of the card. Handles three cases:

1. **Hybrid** (both electric range and fuel range configured): Shows total km with a breakdown row — `440 km` with `⛽ 400 + ⚡ 40 km` below.
2. **Single range** (either electric or fuel): Shows `480 km` with an appropriate icon.
3. **No range entity**: Shows `— km`.

The `!` operator at the end of a variable (e.g., `fuelRangeKm!`) is TypeScript's **non-null assertion** — "I assert this is not null here, trust me". Used after a guard check like `if (hasFuel)`. Like Kotlin's `!!` operator.

#### `_renderChargeRow()` and `_renderFuelRow()`

Return HTML strings for the energy status rows beneath the range metric.

- **Charge row**: Shows a bolt icon, battery percentage, a 10-segment progress bar, and a charging label.
- **Fuel row**: Shows only a fuel pump icon and the liters value (e.g., "45 L"), using `display: inline-flex` so it hugs its content rather than stretching full-width. Returns `""` (empty string) if no `fuel_entity` is configured.

#### `_renderSegBar()`

```typescript
private _renderSegBar(pct: number | null, color: "green" | "blue"): string {
  const filled = pct !== null && !isNaN(pct) ? Math.round(pct / (100 / SEGMENTS)) : 0;
  const segs = Array.from({ length: SEGMENTS }, (_, i) =>
    `<span class="seg ${i < filled ? color : ""}"></span>`
  ).join("");
  return `<div class="seg-bar">${segs}</div>`;
}
```

Creates a 10-segment progress bar. `SEGMENTS = 10`. `pct / (100 / 10) = pct / 10` = how many segments are filled. `Array.from({ length: 10 }, (_, i) => ...)` creates an array of 10 strings, then `.join("")` concatenates them without separator — like `buildString` in Kotlin.

`"green" | "blue"` is a **union type** — the parameter can only be one of those two string values. The compiler will error if you pass anything else. Similar to a Kotlin sealed class or enum in intent, but it's just string literals.

#### `_energyBgStyle()`

```typescript
private _energyBgStyle(batteryPct: number): string {
  const pct = Math.max(0, Math.min(100, batteryPct));  // clamp to 0-100
  const edgeStart = `${Math.max(0, pct - 6)}%`;
  const edgeEnd   = `${pct}%`;
  return `background: linear-gradient(to right,
    rgba(74,222,128,0.28) 0%,
    rgba(74,222,128,0.28) ${edgeStart},
    rgba(74,222,128,0.06) ${edgeEnd},
    transparent 100%);`;
}
```

Generates an inline CSS background style for the green energy fill. The gradient goes from solid green on the left, to a sharper edge at the battery percentage position, to transparent. For example, at 80% battery, the green fill covers the left 80% with a quick fade at the edge.

This is applied to `.energy-bg` — an `position: absolute; inset: 0` layer that sits behind all content. Only shown for EV-only cars (not for cars with fuel range).

#### `_attachHandlers()`

```typescript
private _attachHandlers(lock_entity, isLocked, climate_entity, ...): void {
  const root = this.shadowRoot!;

  root.getElementById("btn-lock")?.addEventListener("click", () => {
    const svc = isLocked ? "unlock" : "lock";
    this._callService("lock", svc, lock_entity);
  });
  // ...
}
```

After `_render()` sets `innerHTML`, the DOM elements exist but have no event listeners. `_attachHandlers` uses `getElementById` to find buttons and attaches click listeners. The `?.` is optional chaining — if the element doesn't exist (e.g., `lock_entity` was not configured so the button wasn't rendered), the expression short-circuits to `undefined` and nothing happens.

The arrow function `() => { ... }` passed to `addEventListener` is a **closure** — it captures `isLocked` and `lock_entity` from the outer scope. Like a Kotlin lambda that closes over variables.

`this.shadowRoot!` — the `!` is the non-null assertion. We know `shadowRoot` is set here because `_attachHandlers` is only called from `_render()`, which already guards with `if (!this.shadowRoot) return`.

#### `_callService()`

```typescript
private _callService(domain: string, service: string, entityId: string): void {
  if (!this._hass) return;
  this._hass.callService(domain, service, { entity_id: entityId })
    .catch((err) => {
      console.error(`[volvo-car-card] Service call ${domain}.${service} failed:`, err);
    });
}
```

Calls a HA service (think: sends a command to a HA integration). `callService` returns a `Promise<void>`. We ignore the success case (no `.then()`) but log errors with `.catch()`. 

HA services are addressed as `domain.service`. Examples:
- `lock.lock` / `lock.unlock` — lock/unlock the car
- `button.press` — press a HA button entity (triggers the integration to send a command to the car)

---

### `src/volvo-car-editor.ts`

**Role:** The visual configuration editor that appears in HA's dashboard edit mode. Users use this instead of editing YAML manually.

```typescript
export class VolvoCarEditor extends HTMLElement {
  private _config: VolvoCardConfig = { type: "custom:volvo-car-card" };
  private _hass?: HomeAssistant;
  private _built = false;
  private _form?: HTMLElement & Record<string, unknown>;
```

`HTMLElement & Record<string, unknown>` is a TypeScript **intersection type** — the variable must be both an `HTMLElement` and a key-value map. The `&` is like "implements both interfaces". Used here because `<ha-form>` is a HA-specific custom element not typed in our code, so we access its properties via index notation: `form["hass"] = ...`.

```typescript
const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "battery_entity", selector: { entity: { filter: [{ domain: "sensor" }] } } },
  // ...
];
```

`SCHEMA` is a plain JavaScript array of objects describing each field. HA's `<ha-form>` element reads this schema and automatically renders the appropriate input for each field — a text input for `name`, an entity picker (with domain filtering) for entity fields.

```typescript
form["computeLabel"] = (item: { name: string }) =>
  LABELS[item.name] ?? item.name;
```

`computeLabel` is set as a function that `<ha-form>` calls to get the human-readable label for each field. `LABELS` is a plain object used as a lookup map (`Record<string, string>`). If no label is found, fall back to the field name itself.

```typescript
form.addEventListener("value-changed", (e: Event) => {
  const newConfig = { ...(e as CustomEvent).detail.value, type: "custom:volvo-car-card" };
  this.dispatchEvent(new CustomEvent("config-changed", {
    detail: { config: newConfig },
    bubbles: true,
    composed: true,
  }));
});
```

When the user changes any field, `<ha-form>` fires a `value-changed` event. The editor responds by dispatching its own `config-changed` event, which bubbles up the DOM to HA's dashboard editor, which then calls `card.setConfig(newConfig)`.

`bubbles: true` — the event travels up the DOM tree (event bubbling, like Android's event propagation).  
`composed: true` — the event crosses Shadow DOM boundaries (required because the editor lives in its own shadow root).

---

### `src/index.ts`

**Role:** Entry point. Registers the custom elements with the browser and announces the card to HA's card registry.

```typescript
import { VolvoCarCard } from "./volvo-car-card.js";
import { VolvoCarEditor } from "./volvo-car-editor.js";

customElements.define("volvo-car-card", VolvoCarCard);
customElements.define("volvo-car-editor", VolvoCarEditor);
```

`customElements.define("tag-name", ClassName)` tells the browser: "whenever you see `<volvo-car-card>` in HTML, instantiate `VolvoCarCard`". This is the Web Components equivalent of registering a `View` factory. Custom element tag names must contain a hyphen (W3C spec requirement).

```typescript
(window as Record<string, unknown>)["customCards"] ??= [];
((window as Record<string, unknown>)["customCards"] as unknown[]).push({
  type: "volvo-car-card",
  name: "Volvo Car Card",
  description: "A card for displaying Volvo Cars integration data and controls.",
});
```

HA's frontend watches `window.customCards` — a global array where custom card plugins register themselves. `??=` is the **nullish assignment** operator: initialize the array only if it doesn't already exist (like `if (list == null) list = mutableListOf()`). This registration makes the card appear in HA's "Add Card" picker with its name and description.

`window as Record<string, unknown>` — casting `window` to a map type so TypeScript allows us to write to arbitrary properties. Like casting to `(Any?)` and hoping for the best in Kotlin, but this is safe because that's exactly what `window` is in JavaScript.

---

## 6. Data Flow End-to-End

Here's how a state change flows through the system:

```
HA Backend (Python)
  → entity state changes (e.g., battery goes from 82% to 81%)
  → HA Frontend gets WebSocket event
  → HA Frontend creates new hass object (immutable snapshot)
  → HA Frontend calls: card.hass = newHass
  → VolvoCarCard.set hass(hass) fires
  → _statesChanged() compares old vs new states for configured entities
  → if changed: _render() is called
  → _render() reads new state values, builds HTML string, sets shadowRoot.innerHTML
  → Browser parses and renders the new DOM
  → _attachHandlers() wires up click listeners
```

When a user presses a button:

```
User clicks button
  → click event fires
  → _attachHandlers() listener runs
  → _callService("lock", "unlock", "lock.xc40_lock") called
  → hass.callService("lock", "unlock", { entity_id: "lock.xc40_lock" }) called
  → HA Frontend sends WebSocket message to backend
  → HA Backend calls Volvo integration → API call to Volvo cloud
  → Volvo cloud → car unlocks
  → State change propagates back → card re-renders with new lock state
```

---

## 7. CSS Concepts Used in This Project

A quick reference for the CSS patterns in `styles.ts`.

| Concept | Where used | Android equivalent |
|---------|-----------|-------------------|
| `display: flex; flex-direction: column` | `.card-root` | `LinearLayout` vertical |
| `flex: 1` | `.hero-zone` | `layout_weight="1"` |
| `flex-shrink: 0` | `.actions-bar` | `wrap_content` that won't compress |
| `display: grid; grid-template-columns: 22px 46px 1fr auto` | `.status-row` | `ConstraintLayout` with chains |
| `position: absolute; inset: 0` | `.energy-bg` | `FrameLayout` fill parent |
| `var(--ha-card-background, #f4f4f3)` | `.card-root` | `theme.resolveAttribute(R.attr.cardBackground)` |
| `clamp(1.8rem, 12cqh, 3.5rem)` | `.range-value` | Proportional SP sizing |
| `overflow: hidden` | `.card-root` | `clipChildren="true"` |
| `border-radius: 24px` | `.card-root` | `ShapeAppearance` |
| `filter: drop-shadow(...)` | `.car-image` | `CardView` elevation shadow |
| `transition: transform 0.15s ease` | `.circle-btn` | `ViewPropertyAnimator` |
| `fill: currentColor` | SVG icons | Tint via `ImageView.setColorFilter()` |

---

## 8. Common Tasks / How-Tos

### Add a new action button

1. Add an entity field to `VolvoCardConfig` in `src/types.ts`:
   ```typescript
   /** Entity ID of the button to honk the horn */
   horn_entity?: string;
   ```

2. Add to the editor schema in `src/volvo-car-editor.ts`:
   ```typescript
   { name: "horn_entity", selector: { entity: { filter: [{ domain: "button" }] } } }
   ```
   And add a label in `LABELS`:
   ```typescript
   horn_entity: "Horn entity (button)",
   ```

3. In `src/volvo-car-card.ts`, destructure the new field in `_render()`:
   ```typescript
   const { ..., horn_entity } = this._config;
   ```
   Add to `_statesChanged()` entities list, render the button in the `actions-bar`, and handle it in `_attachHandlers()`.

4. Run `bun run build`. Copy `dist/volvo-car-card.js` to HA's `www/` folder and reload.

---

### Add a new icon

1. Copy the SVG file to `src/icons/` (e.g., `horn.svg`).
2. Open `src/icons/index.ts` and add an export:
   ```typescript
   export const ICON_HORN = `<svg ...>...</svg>`;
   ```
   (Paste the SVG content inline as a string.)
3. Import it in `src/volvo-car-card.ts`:
   ```typescript
   import { ..., ICON_HORN } from "./icons/index.js";
   ```

---

### Change the card's default size

In `src/volvo-car-card.ts`:
```typescript
getCardSize(): number { return 8; }  // height in ~50px units for masonry view
getGridOptions() {
  return { rows: 8, columns: 12, min_columns: 2, min_rows: 6 };
  //        ↑ rows in sections view (each row ≈ 56px in HA)
}
```

---

### Debug a render issue

Add temporary `console.log` calls in `_render()` — they appear in the browser DevTools console (F12 → Console). Unlike Android's Logcat, browser dev tools are available directly in the dashboard tab.

```typescript
console.log("[volvo-car-card] batteryPct:", batteryPct, "rangeKm:", rangeKm);
```

For CSS debugging, use DevTools → Inspector → select a shadow root element → inspect computed styles. HA dashboards run in a standard browser, so all standard web debugging tools work.

---

### Build and deploy

```bash
bun run build        # type-check + bundle → dist/volvo-car-card.js
bun run build:dev    # same but with source maps (for debugging in browser DevTools)
bun run watch        # rebuilds automatically on file save (like Gradle continuous build)
```

After building, copy `dist/volvo-car-card.js` to your HA server's `/config/www/` directory (e.g., via Samba, SSH, or the File Editor add-on). Then hard-refresh the browser (`Ctrl+Shift+R`) on the HA dashboard to load the new version.
