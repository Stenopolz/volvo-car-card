export const CARD_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }

  /* ── Card root ── */
  .card-root {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--ha-card-background, #f4f4f3);
    border-radius: var(--ha-card-border-radius, 24px);
    box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0,0,0,.08));
    overflow: hidden;
    font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif);
    color: #111;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  /* ── Energy background ── */
  .energy-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    transition: background 0.6s ease;
  }

  /* ── Content layer ── */
  .card-content {
    position: relative;
    z-index: 1;
    padding: 24px 24px 0;
    flex-shrink: 0;
  }

  /* ── Header ── */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .vehicle-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: 0.02em;
  }

  .version-badge {
    font-size: 0.6rem;
    padding: 3px 7px;
    border-radius: 10px;
    background: rgba(0,0,0,0.06);
    color: #666;
    font-family: monospace;
    white-space: nowrap;
  }

  /* ── Primary range metric ── */
  .range-metric {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 22px;
    line-height: 1;
  }

  .range-metric--combined {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .range-combined-total {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .range-breakdown {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
  }

  .range-part {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #444;
  }

  .range-part-unit {
    font-size: 0.85rem;
    color: #666;
    font-weight: 400;
  }

  .range-sep {
    font-size: 0.85rem;
    color: #999;
    font-weight: 300;
  }

  .range-part-icon {
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .range-part-icon svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .range-part-icon--fuel    { color: #3b82f6; }
  .range-part-icon--electric { color: #22c55e; }

  .range-single-icon {
    width: 18px;
    height: 18px;
    align-self: center;
    margin-left: 2px;
  }

  .range-single-icon svg {
    width: 18px;
    height: 18px;
  }

  .range-value {
    font-size: 5rem;
    font-weight: 300;
    color: #111;
    letter-spacing: -0.025em;
    line-height: 1;
  }

  .range-unit {
    font-size: 2rem;
    font-weight: 400;
    color: #222;
  }

  .range-unavailable {
    font-size: 2.5rem;
    font-weight: 300;
    color: #999;
  }

  /* ── Energy status block ── */
  .status-block {
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin-bottom: 6px;
  }

  .status-row {
    display: grid;
    grid-template-columns: 22px 46px 1fr auto;
    align-items: center;
    gap: 10px;
  }

  .status-row--fuel {
    display: inline-flex;
    grid-template-columns: unset;
  }

  .status-icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #333;
  }

  .status-icon svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .status-pct {
    font-size: 0.85rem;
    font-weight: 600;
    color: #111;
    white-space: nowrap;
  }

  .status-pct.secondary {
    font-weight: 500;
    color: #444;
  }

  /* ── Segmented progress bar ── */
  .seg-bar {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .seg {
    height: 6px;
    flex: 1;
    border-radius: 3px;
    background: rgba(0,0,0,0.1);
  }

  .seg.green { background: #22c55e; }
  .seg.blue  { background: #3b82f6; }

  /* ── Status label ── */
  .status-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-label.secondary {
    font-weight: 400;
    color: #555;
  }

  /* ── Hero image zone ── */
  .hero-zone {
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 8px 0 0;
    overflow: hidden;
  }

  .car-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
    filter: drop-shadow(0 8px 24px rgba(0,0,0,0.12));
  }

  .hero-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-placeholder svg {
    width: 96px;
    height: 96px;
    fill: rgba(0,0,0,0.08);
  }

  /* ── Quick-action buttons ── */
  .actions-bar {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 20px 24px 24px;
    flex-shrink: 0;
  }

  .circle-btn {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.88);
    box-shadow: 0 2px 10px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
    flex-shrink: 0;
  }

  .circle-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08);
  }

  .circle-btn:active {
    transform: scale(0.95);
    opacity: 0.8;
  }

  .circle-btn svg {
    width: 22px;
    height: 22px;
    fill: #1a1a1a;
    pointer-events: none;
  }

  /* ── Error ── */
  .error-box {
    padding: 16px;
    border-radius: 12px;
    background: #fef2f2;
    color: #dc2626;
    font-size: 0.9rem;
    margin: 16px;
  }

  /* ── Unavailable text ── */
  .unavailable {
    color: #aaa;
  }
`;

