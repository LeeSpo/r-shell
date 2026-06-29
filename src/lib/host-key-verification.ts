import { APP_SETTINGS_STORAGE_KEY } from './keyboard-shortcuts';

export const UNKNOWN_HOST_KEY_PREFIX = 'UNKNOWN_HOST_KEY:';

export interface UnknownHostKeyPayload {
  host: string;
  port: number;
  fingerprint: string;
  keyType: string;
  keyData: string;
}

export function isHostKeyVerificationEnabled(): boolean {
  try {
    const raw = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) return true;
    const settings = JSON.parse(raw) as { hostKeyVerification?: boolean };
    return settings.hostKeyVerification ?? true;
  } catch {
    return true;
  }
}

export function isUnknownHostKeyError(error: string): boolean {
  return parseUnknownHostKeyError(error) !== null;
}

export function parseUnknownHostKeyError(error: string): UnknownHostKeyPayload | null {
  const index = error.indexOf(UNKNOWN_HOST_KEY_PREFIX);
  if (index === -1) return null;

  const jsonPart = error.slice(index + UNKNOWN_HOST_KEY_PREFIX.length).trim();
  try {
    const payload = JSON.parse(jsonPart) as UnknownHostKeyPayload;
    if (!payload.host || !payload.keyType || !payload.keyData) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}