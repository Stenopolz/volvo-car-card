import type { Translations } from "./index.js";

export const en: Translations = {
  default_name: "Volvo",
  version_tooltip: "Build version",
  no_config: "No configuration provided.",
  updating: "Updating\u2026",
  state: {
    fully_charged: "Fully charged",
    ready_to_drive: "Ready to drive",
    idle: "Not charging",
    charging: "Charging",
    scheduled: "Scheduled",
    discharging: "Discharging",
    error: "Charging error",
    done: "Fully charged",
  },
  btn: {
    lock: "Lock",
    unlock: "Unlock",
    climate: "Start climate",
    engine_start: "Start engine",
    engine_stop: "Stop engine",
  },
  editor: {
    name: "Card name",
    battery_entity: "Battery level entity",
    battery_range_entity: "Battery range entity",
    fuel_entity: "Fuel level entity",
    fuel_range_entity: "Fuel range entity",
    lock_entity: "Lock entity",
    charging_status_entity: "Charging status entity",
    climate_entity: "Start climatization entity",
    engine_start_entity: "Engine start entity",
    engine_stop_entity: "Engine stop entity",
    vehicle_image_entity: "Vehicle image entity",
  },
};
