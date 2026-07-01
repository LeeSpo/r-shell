export const getUsageColor = (usage: number): string => {
  if (usage >= 90) return 'text-destructive';
  if (usage >= 75) return 'text-warning';
  if (usage >= 50) return 'text-warning';
  return 'text-success';
};

export const getProgressColor = (usage: number): string => {
  if (usage >= 90) return '[&>div]:bg-destructive';
  if (usage >= 75) return '[&>div]:bg-warning';
  if (usage >= 50) return '[&>div]:bg-warning';
  return '[&>div]:bg-success';
};

export const getGpuTempColor = (temp: number): string => {
  if (temp >= 85) return 'text-destructive';
  if (temp >= 75) return 'text-warning';
  if (temp >= 60) return 'text-warning';
  return 'text-success';
};

export const GPU_COLORS = ['#a371f7', '#3794ff', '#d29922', '#3fb950', '#f85149', '#d29922'];

export function scheduleIdleTask(task: () => void): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task);
  } else {
    task();
  }
}