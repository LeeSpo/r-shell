import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadEnabledPanels, saveEnabledPanels } from '../monitor-panel-storage';

const STORAGE_KEY = 'skd-monitor-panels';

describe('monitor-panel-storage', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('returns overview as default when no storage record exists', () => {
    expect(loadEnabledPanels()).toEqual(new Set(['overview']));
  });

  it('persists and restores enabled panels', () => {
    saveEnabledPanels(['processes', 'network']);
    expect(loadEnabledPanels()).toEqual(new Set(['processes', 'network']));
  });

  it('filters invalid panel IDs on load', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ enabledPanels: ['overview', 'invalid', 'gpu', 42] }),
    );
    expect(loadEnabledPanels()).toEqual(new Set(['overview', 'gpu']));
  });

  it('allows an empty enabled set', () => {
    saveEnabledPanels([]);
    expect(loadEnabledPanels()).toEqual(new Set());
  });

  it('falls back to default when stored JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(loadEnabledPanels()).toEqual(new Set(['overview']));
  });
});