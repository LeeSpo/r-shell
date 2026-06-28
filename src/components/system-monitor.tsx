import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadEnabledPanels, saveEnabledPanels } from '@/lib/monitor-panel-storage';
import type { MonitorPanelId } from '@/lib/monitor-panel-types';
import { ScrollArea } from './ui/scroll-area';
import { MonitorPanelPicker } from './monitor/monitor-panel-picker';
import { SystemOverviewPanel } from './monitor/system-overview-panel';
import { ProcessesPanel } from './monitor/processes-panel';
import { DiskUsagePanel } from './monitor/disk-usage-panel';
import { GpuMonitorPanel } from './monitor/gpu-monitor-panel';
import { NetworkUsagePanel } from './monitor/network-usage-panel';
import { NetworkLatencyPanel } from './monitor/network-latency-panel';

interface SystemMonitorProps {
  connectionId?: string;
}

export function SystemMonitor({ connectionId }: SystemMonitorProps) {
  const { t } = useTranslation();
  const [enabledPanels, setEnabledPanels] = useState(() => loadEnabledPanels());

  const handlePanelsChange = (panels: Set<MonitorPanelId>) => {
    setEnabledPanels(panels);
    saveEnabledPanels([...panels]);
  };

  if (!connectionId) {
    return null;
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2.5">
        <MonitorPanelPicker enabled={enabledPanels} onChange={handlePanelsChange} />

        {enabledPanels.size === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-6 px-2">
            {t('systemMonitor.panelPicker.noneEnabled')}
          </p>
        )}

        {enabledPanels.has('overview') && (
          <SystemOverviewPanel connectionId={connectionId} />
        )}
        {enabledPanels.has('processes') && (
          <ProcessesPanel connectionId={connectionId} />
        )}
        {enabledPanels.has('gpu') && (
          <GpuMonitorPanel connectionId={connectionId} />
        )}
        {enabledPanels.has('disk') && (
          <DiskUsagePanel connectionId={connectionId} />
        )}
        {enabledPanels.has('network') && (
          <NetworkUsagePanel connectionId={connectionId} />
        )}
        {enabledPanels.has('latency') && (
          <NetworkLatencyPanel connectionId={connectionId} />
        )}
      </div>
    </ScrollArea>
  );
}