import {
  DEFAULT_ENABLED_PANELS,
  isMonitorPanelId,
  type MonitorPanelId,
} from './monitor-panel-types';

const STORAGE_KEY = 'skd-monitor-panels';

interface StoredMonitorPanels {
  enabledPanels: MonitorPanelId[];
}

function parseStoredPanels(raw: string | null): MonitorPanelId[] | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredMonitorPanels>;
    if (!Array.isArray(parsed.enabledPanels)) return null;

    const validPanels = parsed.enabledPanels.filter(isMonitorPanelId);
    return validPanels;
  } catch {
    return null;
  }
}

export function loadEnabledPanels(): Set<MonitorPanelId> {
  const stored = parseStoredPanels(localStorage.getItem(STORAGE_KEY));
  if (stored === null) {
    return new Set(DEFAULT_ENABLED_PANELS);
  }
  return new Set(stored);
}

export function saveEnabledPanels(panels: MonitorPanelId[]): void {
  const payload: StoredMonitorPanels = {
    enabledPanels: panels.filter(isMonitorPanelId),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}