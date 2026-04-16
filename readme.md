# Volvo Car Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![ha_version](https://img.shields.io/badge/homeassistant-2024.1.0%2B-yellow.svg)](https://www.home-assistant.io)
[![version](https://img.shields.io/badge/version-0.1.1-green.svg)](#)
[![maintained](https://img.shields.io/maintenance/yes/2026.svg)](#)

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card for displaying and controlling your Volvo vehicle through the [Volvo Cars integration](https://www.home-assistant.io/integrations/volvo/).

Supports electric, plug-in hybrid, and petrol vehicles with a clean card layout featuring range, battery/fuel status, vehicle image, and quick-action buttons for locks, climate and engine.

![Card preview](/images/card.png)

## Requirements

- Home Assistant with the [Volvo Cars](https://www.home-assistant.io/integrations/volvo/) integration set up and at least one vehicle configured.
- Home Assistant 2024.1.0 or newer.

## Installation

### HACS (Preferred)

[Get HACS](https://hacs.xyz/) and install Volvo Car Card extension

### Manual

1. Download [`volvo-car-card.js`](./dist/volvo-car-card.js) from the `dist/` folder.
2. Copy it to `<config>/www/volvo-car-card.js`, where `<config>` is your Home Assistant configuration directory.
3. Add the resource in your dashboard settings:

```yaml
resources:
  - url: /local/volvo-car-card.js
    type: module
```

Or via the UI: **Settings → Dashboards → ⋮ → Resources → Add resource**.

## Basic Setup

1. Edit your Lovelace dashboard.
2. Click **Add Card** and search for **Volvo Car Card**.
3. Use the visual editor to select your entities — the card will auto-discover Volvo entities if they are already set up.

## Setting up the car image
1. On your HA instance go to Settings -> Developer Tools -> Actions tab
2. Look for `volvo.get_image_url` action
3. Select your volvo car entity and choose `Exterior front` image type. You can use any image, but it might look ugly
4. Peform action and copy image URL from the response
5. Go to Settings -> Devices & Services -> Helpers
6. Click on `Create helper`
7. Select `Template`
8. Select `Image`
9. Give it a meaningful name
10. Paste URL in URL section of the config
11. Image should be displayed in the preview
12. Save and exit

Now you could set image entity in the configurator parameters.

## Configuration

The card supports full configuration through the UI editor.

![Editor preview](/images/editor.png)

### Options

| Name | Type | Required? | Description |
| --- | --- | --- | --- |
| `name` | string | optional | Override the vehicle name shown in the card header. Defaults to the friendly name derived from your entities. |
| `battery_entity` | entity | optional | Battery charge level sensor (e.g. `sensor.xc40_battery`). Required for EV/PHEV range display. |
| `battery_range_entity` | entity | optional | Electric range sensor (e.g. `sensor.xc40_distance_to_empty_battery`). |
| `fuel_entity` | entity | optional | Fuel level sensor in litres (e.g. `sensor.xc40_fuel_amount`). |
| `fuel_range_entity` | entity | optional | Fuel range sensor (e.g. `sensor.xc40_distance_to_empty_tank`). |
| `lock_entity` | entity | optional | Lock entity (e.g. `lock.xc40_lock`). Adds a lock/unlock button to the card. |
| `charging_status_entity` | entity | optional | Charging status sensor (e.g. `sensor.xc40_charging_status`). Displays the current charging state below the battery bar. |
| `climate_entity` | entity | optional | Button entity to start remote climatization (e.g. `button.xc40_start_climatization`). |
| `engine_start_entity` | entity | optional | Button entity to start the engine remotely. |
| `engine_stop_entity` | entity | optional | Button entity to stop the engine remotely. |
| `vehicle_image_entity` | entity | optional | Camera or image entity whose `entity_picture` attribute provides the vehicle photo (e.g. `image.xc40_exterior`). Falls back to a generic car silhouette when not set. |

### Example YAML

```yaml
type: custom:volvo-car-card
name: My XC40
battery_entity: sensor.xc40_battery
battery_range_entity: sensor.xc40_distance_to_empty_battery
fuel_entity: sensor.xc40_fuel_amount
fuel_range_entity: sensor.xc40_distance_to_empty_tank
lock_entity: lock.xc40_lock
charging_status_entity: sensor.xc40_charging_status
climate_entity: button.xc40_start_climatization
engine_start_entity: button.xc40_start_engine
engine_stop_entity: button.xc40_stop_engine
vehicle_image_entity: image.xc40_exterior
```

### Vehicle Types

The card automatically adapts its layout depending on which entities you configure:

| Vehicle type | Entities needed | Range display |
| --- | --- | --- |
| Battery Electric (BEV) | `battery_entity` + `battery_range_entity` | Electric range only |
| Internal Combustion (ICE) | `fuel_entity` + `fuel_range_entity` | Fuel range only |
| Plug-in Hybrid (PHEV) | All four range entities | Combined total + breakdown |

## Localisation

The card uses your Home Assistant language setting automatically. Currently supported languages:

- English (`en`)
- Swedish (`sv`)

To add a new language, see the [Developer Walkthrough](./DEVELOPER_WALKTHROUGH.md).

## Development

Read the [Developer Walkthrough](./DEVELOPER_WALKTHROUGH.md) to learn more on the details of the project.

You'll need [Bun](https://bun.sh/) installed.

```sh
bun install
bun run build
```

For a dev build with source maps:

```sh
bun run build:dev
```

To rebuild automatically on file changes:

```sh
bun run watch
```

The compiled card is written to `dist/volvo-car-card.js`.

## Credits

Built on the Home Assistant custom card framework using standard Web Components and the `ha-form` editor pattern.
