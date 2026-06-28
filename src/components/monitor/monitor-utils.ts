export const getUsageColor = (usage: number): string => {
  if (usage >= 90) return 'text-red-500';
  if (usage >= 75) return 'text-orange-500';
  if (usage >= 50) return 'text-yellow-500';
  return 'text-green-500';
};

export const getProgressColor = (usage: number): string => {
  if (usage >= 90) return '[&>div]:bg-red-500';
  if (usage >= 75) return '[&>div]:bg-orange-500';
  if (usage >= 50) return '[&>div]:bg-yellow-500';
  return '[&>div]:bg-green-500';
};

export const getGpuTempColor = (temp: number): string => {
  if (temp >= 85) return 'text-red-500';
  if (temp >= 75) return 'text-orange-500';
  if (temp >= 60) return 'text-yellow-500';
  return 'text-green-500';
};

export const GPU_COLORS = ['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#ec4899', '#eab308'];

export function scheduleIdleTask(task: () => void): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task);
  } else {
    task();
  }
}