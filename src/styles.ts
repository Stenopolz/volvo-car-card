export const CARD_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
  }

  .card-root {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.15));
    padding: 16px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, sans-serif);
  }

  /* ── Header ── */
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-header svg {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    fill: var(--primary-color);
  }

  .card-header-text {
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .card-subtitle {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  /* ── Stats grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat-card {
    background: var(--secondary-background-color, rgba(0,0,0,.04));
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--secondary-text-color);
  }

  .stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  .stat-unit {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  /* ── Battery bar ── */
  .battery-bar-wrap {
    background: var(--divider-color, rgba(0,0,0,.12));
    border-radius: 4px;
    height: 6px;
    margin-top: 4px;
    overflow: hidden;
  }

  .battery-bar {
    height: 100%;
    border-radius: 4px;
    background: var(--primary-color);
    transition: width .4s ease;
  }

  .battery-bar.low {
    background: var(--error-color, #db4437);
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: opacity .2s;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .action-btn:hover {
    opacity: 0.85;
  }

  .action-btn:active {
    opacity: 0.7;
  }

  .action-btn.secondary {
    background: var(--secondary-background-color, rgba(0,0,0,.08));
    color: var(--primary-text-color);
  }

  .action-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  /* ── Version badge ── */
  .version-badge {
    margin-left: auto;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--secondary-background-color, rgba(0,0,0,.07));
    color: var(--secondary-text-color);
    font-family: monospace;
    white-space: nowrap;
    align-self: flex-start;
  }

  /* ── Error / unavailable ── */
  .error-box {
    padding: 12px;
    border-radius: 8px;
    background: var(--error-color, #db4437);
    color: #fff;
    font-size: 0.9rem;
  }

  .unavailable {
    color: var(--disabled-text-color, rgba(0,0,0,.38));
  }
`;
