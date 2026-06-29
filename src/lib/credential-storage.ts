import { invoke } from '@tauri-apps/api/core';

export type ConnectionSecretType = 'password' | 'passphrase' | 'private_key';

export interface ConnectionSecrets {
  password?: string;
  passphrase?: string;
  privateKey?: string;
}

export interface ConnectionSecretUpdate {
  password?: string;
  passphrase?: string;
  privateKey?: string;
}

export interface StoredCredentialFlags {
  hasStoredPassword: boolean;
  hasStoredPassphrase: boolean;
  hasStoredPrivateKey: boolean;
}

export function isSavePasswordsEnabled(): boolean {
  return true;
}

export async function storeConnectionSecret(
  connectionId: string,
  secretType: ConnectionSecretType,
  secret: string,
): Promise<void> {
  await invoke('store_connection_secret', {
    connectionId,
    secretType,
    secret,
  });
}

async function getConnectionSecret(
  connectionId: string,
  secretType: ConnectionSecretType,
): Promise<string | undefined> {
  const secret = await invoke<string | null>('get_connection_secret', {
    connectionId,
    secretType,
  });

  return secret ?? undefined;
}

export async function deleteConnectionSecrets(connectionId: string): Promise<void> {
  await invoke('delete_connection_secrets', { connectionId });
}

export async function storeConnectionSecrets(
  connectionId: string,
  secrets: ConnectionSecrets,
  options?: { force?: boolean; rememberPassword?: boolean },
): Promise<StoredCredentialFlags> {
  const shouldStore = options?.force ?? options?.rememberPassword ?? true;
  if (!shouldStore) {
    await deleteConnectionSecrets(connectionId);
    return { hasStoredPassword: false, hasStoredPassphrase: false, hasStoredPrivateKey: false };
  }

  let hasStoredPassword = false;
  let hasStoredPassphrase = false;
  let hasStoredPrivateKey = false;

  if (secrets.password) {
    await storeConnectionSecret(connectionId, 'password', secrets.password);
    hasStoredPassword = true;
  }

  if (secrets.passphrase) {
    await storeConnectionSecret(connectionId, 'passphrase', secrets.passphrase);
    hasStoredPassphrase = true;
  }

  if (secrets.privateKey) {
    await storeConnectionSecret(connectionId, 'private_key', secrets.privateKey);
    hasStoredPrivateKey = true;
  }

  return { hasStoredPassword, hasStoredPassphrase, hasStoredPrivateKey };
}

export async function updateConnectionSecrets(
  connectionId: string,
  secrets: ConnectionSecretUpdate,
  existing: {
    hasStoredPassword?: boolean;
    hasStoredPassphrase?: boolean;
    hasStoredPrivateKey?: boolean;
  },
  options?: { rememberPassword?: boolean },
): Promise<StoredCredentialFlags> {
  const shouldStore = options?.rememberPassword ?? true;
  if (!shouldStore) {
    await deleteConnectionSecrets(connectionId);
    return { hasStoredPassword: false, hasStoredPassphrase: false, hasStoredPrivateKey: false };
  }

  let hasStoredPassword = existing.hasStoredPassword ?? false;
  let hasStoredPassphrase = existing.hasStoredPassphrase ?? false;
  let hasStoredPrivateKey = existing.hasStoredPrivateKey ?? false;

  if (secrets.password) {
    await storeConnectionSecret(connectionId, 'password', secrets.password);
    hasStoredPassword = true;
  }

  if (secrets.passphrase) {
    await storeConnectionSecret(connectionId, 'passphrase', secrets.passphrase);
    hasStoredPassphrase = true;
  }

  if (secrets.privateKey) {
    await storeConnectionSecret(connectionId, 'private_key', secrets.privateKey);
    hasStoredPrivateKey = true;
  }

  return { hasStoredPassword, hasStoredPassphrase, hasStoredPrivateKey };
}

export async function loadConnectionSecrets(
  connectionId: string,
  flags?: {
    hasStoredPassword?: boolean;
    hasStoredPassphrase?: boolean;
    hasStoredPrivateKey?: boolean;
  },
): Promise<ConnectionSecrets> {
  const secrets: ConnectionSecrets = {};

  if (flags?.hasStoredPassword) {
    secrets.password = await getConnectionSecret(connectionId, 'password');
  }

  if (flags?.hasStoredPassphrase) {
    secrets.passphrase = await getConnectionSecret(connectionId, 'passphrase');
  }

  if (flags?.hasStoredPrivateKey) {
    secrets.privateKey = await getConnectionSecret(connectionId, 'private_key');
  }

  return secrets;
}

export async function copyConnectionSecrets(fromId: string, toId: string): Promise<StoredCredentialFlags> {
  if (!isSavePasswordsEnabled()) {
    return { hasStoredPassword: false, hasStoredPassphrase: false, hasStoredPrivateKey: false };
  }

  const [password, passphrase, privateKey] = await Promise.all([
    getConnectionSecret(fromId, 'password'),
    getConnectionSecret(fromId, 'passphrase'),
    getConnectionSecret(fromId, 'private_key'),
  ]);

  return storeConnectionSecrets(toId, { password, passphrase, privateKey }, { force: true });
}

export const KEYCHAIN_MIGRATION_FLAG = 'skd-keychain-migrated-v1';