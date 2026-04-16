/** Home Assistant entity state object */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

/** Subset of the Home Assistant frontend object passed to cards */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale: {
    language: string;
    number_format: string;
  };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<void>;
  formatEntityState(stateObj: HassEntity): string;
  formatEntityAttributeValue(stateObj: HassEntity, attribute: string): string;
}

/** Configuration stored in the dashboard YAML for this card */
export interface VolvoCardConfig {
  type: string;
  /** Optional display name override for the card header */
  name?: string;
  /** Entity ID of the battery charge level sensor, e.g. sensor.xc40_battery_charge_level */
  battery_entity?: string;
  /** Entity ID of the electric range sensor, e.g. sensor.xc40_distance_to_empty_battery */
  battery_range_entity?: string;
  /** Entity ID of the lock entity, e.g. lock.xc40_lock */
  lock_entity?: string;
  /** Entity ID of the odometer sensor, e.g. sensor.xc40_odometer */
  odometer_entity?: string;
  /** Entity ID of the fuel level sensor (in liters), e.g. sensor.xc40_fuel_amount */
  fuel_entity?: string;
  /** Entity ID of the fuel range sensor, e.g. sensor.xc40_distance_to_empty_tank */
  fuel_range_entity?: string;
  /** Entity ID of a sensor whose state describes the charging status, e.g. sensor.xc40_charging_system_status */
  charging_status_entity?: string;
  /** Entity ID of a climate or button entity for remote climate control */
  climate_entity?: string;
  /** Entity ID of a button entity to start the engine */
  engine_start_entity?: string;
  /** Entity ID of a button entity to stop the engine */
  engine_stop_entity?: string;
  /** Entity ID of a camera or image entity whose entity_picture provides the vehicle image */
  vehicle_image_entity?: string;
}

/** Events fired by the card editor element */
export interface CardConfigChangedEvent extends CustomEvent {
  detail: { config: VolvoCardConfig };
}
