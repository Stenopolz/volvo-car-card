import type { Translations } from "./index.js";

export const sv: Translations = {
  default_name: "Volvo",
  version_tooltip: "Byggnadsversion",
  no_config: "Ingen konfiguration angiven.",
  updating: "Uppdaterar\u2026",
  state: {
    fully_charged: "Fulladdat",
    ready_to_drive: "Redo att köra",
    idle: "Laddar inte",
    charging: "Laddar",
    scheduled: "Schemalagd",
    discharging: "Urladdning",
    error: "Laddningsfel",
    done: "Fulladdat",
  },
  btn: {
    lock: "Lås",
    unlock: "Lås upp",
    climate: "Starta klimat",
    engine_start: "Starta motor",
    engine_stop: "Stäng av motor",
  },
  editor: {
    name: "Kortnamn",
    battery_entity: "Batterinivåenhet",
    battery_range_entity: "Batteriräckviddsenhet",
    fuel_entity: "Bränslenivåenhet",
    fuel_range_entity: "Bränsleräckviddsenhet",
    lock_entity: "Låsenhet",
    charging_status_entity: "Laddningsstatusenhet",
    climate_entity: "Klimatiseringsenhet",
    engine_start_entity: "Motorstartsenhet",
    engine_stop_entity: "Motorstopenhet",
    vehicle_image_entity: "Fordonsbild",
    vehicle_image_url: "Fordonsbildens URL",
  },
};
