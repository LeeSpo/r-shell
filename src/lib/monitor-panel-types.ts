export type MonitorPanelId =
  | 'overview'
  | 'processes'
  | 'disk'
  | 'gpu'
  | 'network'
  | 'latency';

export interface MonitorPanelMeta {
  id: MonitorPanelId;
  labelKey: string;
}

export const MONITOR_PANEL_IDS: MonitorPanelId[] = [
  'overview',
  'processes',
  'disk',
  'gpu',
  'network',
  'latency',
];

export const MONITOR_PANELS: MonitorPanelMeta[] = [
  { id: 'overview', labelKey: 'systemMonitor.panelPicker.overview' },
  { id: 'processes', labelKey: 'systemMonitor.panelPicker.processes' },
  { id: 'disk', labelKey: 'systemMonitor.panelPicker.disk' },
  { id: 'gpu', labelKey: 'systemMonitor.panelPicker.gpu' },
  { id: 'network', labelKey: 'systemMonitor.panelPicker.network' },
  { id: 'latency', labelKey: 'systemMonitor.panelPicker.latency' },
];

export const DEFAULT_ENABLED_PANELS: MonitorPanelId[] = ['overview'];

export function isMonitorPanelId(value: unknown): value is MonitorPanelId {
  return typeof value === 'string' && MONITOR_PANEL_IDS.includes(value as MonitorPanelId);
}