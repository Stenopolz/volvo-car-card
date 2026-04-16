import { VolvoCarCard } from "./volvo-car-card.js";
import { VolvoCarEditor } from "./volvo-car-editor.js";

customElements.define("volvo-car-card", VolvoCarCard);
customElements.define("volvo-car-editor", VolvoCarEditor);

// Register the card with the HA custom card registry so it appears
// in the "Add Card" picker with a name and description.
(window as Record<string, unknown>)["customCards"] ??= [];
((window as Record<string, unknown>)["customCards"] as unknown[]).push({
  type: "volvo-car-card",
  name: "Volvo Car Card",
  description: "A card for displaying Volvo Cars integration data and controls.",
  preview: false,
  documentationURL: "https://github.com/home-assistant/core/tree/dev/homeassistant/components/volvo",
});
