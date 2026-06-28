import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteConnectionSecrets,
  isSavePasswordsEnabled,
  storeConnectionSecrets,
} from '../credential-storage';
import { APP_SETTINGS_STORAGE_KEY } from '../keyboard-shortcuts';
import {
  ConnectionStorageManager,
  getConnectionWithCredentials,
  migratePlaintextCredentialsToKeychain,
} from '../connection-storage';

const invokeMock = vi.fn();

vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: unknown[]) => invokeMock(...args),
}));

beforeEach(() => {
  localStorage.clear();
  invokeMock.mockReset();
  ConnectionStorageManager.initialize();
});

describe('credential storage', () => {
  it('isSavePasswordsEnabled returns true by default', () => {
    expect(isSavePasswordsEnabled()).toBe(true);
  });

  it('does not store secrets when rememberPassword is false', async () => {
    await storeConnectionSecrets('conn-1', { password: 'secret' }, { rememberPassword: false });

    expect(invokeMock).not.toHaveBeenCalledWith('store_connection_secret', expect.anything());
    expect(invokeMock).toHaveBeenCalledWith('delete_connection_secrets', {
      connectionId: 'conn-1',
    });
  });

  it('persists only metadata flags in localStorage after migration', async () => {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify({ savePasswords: true }));
    invokeMock.mockResolvedValue(null);

    localStorage.setItem('skd-connections', JSON.stringify([
      {
        id: 'legacy-conn',
        name: 'Test',
        host: '1.1.1.1',
        port: 22,
        username: 'user',
        protocol: 'SSH',
        authMethod: 'password',
        password: 'plain-secret',
        createdAt: new Date().toISOString(),
        folder: 'All Connections',
      },
    ]));

    await migratePlaintextCredentialsToKeychain();

    const storedRaw = localStorage.getItem('skd-connections');
    expect(storedRaw).toBeDefined();
    expect(storedRaw).not.toContain('plain-secret');

    const loaded = ConnectionStorageManager.getConnection('legacy-conn');
    expect(loaded?.hasStoredPassword).toBe(true);
    expect(loaded?.password).toBeUndefined();
  });

  it('hydrates secrets through getConnectionWithCredentials', async () => {
    invokeMock.mockImplementation(async (command: string, args?: Record<string, unknown>) => {
      if (command === 'get_connection_secret' && args?.secretType === 'password') {
        return 'keychain-password';
      }
      return null;
    });

    ConnectionStorageManager.saveConnectionWithId('conn-2', {
      name: 'Hydrate',
      host: '1.1.1.1',
      port: 22,
      username: 'user',
      protocol: 'SSH',
      authMethod: 'password',
      hasStoredPassword: true,
    });

    const hydrated = await getConnectionWithCredentials('conn-2');
    expect(hydrated?.password).toBe('keychain-password');
  });

  it('deleteConnectionSecrets invokes backend delete command', async () => {
    await deleteConnectionSecrets('conn-3');

    expect(invokeMock).toHaveBeenCalledWith('delete_connection_secrets', {
      connectionId: 'conn-3',
    });
  });
});