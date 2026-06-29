import { describe, expect, it } from 'vitest';
import {
  isUnknownHostKeyError,
  parseUnknownHostKeyError,
  UNKNOWN_HOST_KEY_PREFIX,
} from '../host-key-verification';

describe('host-key-verification', () => {
  it('parses unknown host key payload from wrapped connection error', () => {
    const error =
      'Failed to connect to 10.0.0.1:22: UNKNOWN_HOST_KEY:{"host":"10.0.0.1","port":22,"fingerprint":"abc","keyType":"ssh-ed25519","keyData":"AAAAC3NzaC1lZDI1NTE5AAAAI"}';

    const payload = parseUnknownHostKeyError(error);
    expect(payload).toEqual({
      host: '10.0.0.1',
      port: 22,
      fingerprint: 'abc',
      keyType: 'ssh-ed25519',
      keyData: 'AAAAC3NzaC1lZDI1NTE5AAAAI',
    });
  });

  it('detects unknown host key errors', () => {
    const error = `${UNKNOWN_HOST_KEY_PREFIX}{"host":"h","port":22,"fingerprint":"f","keyType":"ssh-ed25519","keyData":"d"}`;
    expect(isUnknownHostKeyError(error)).toBe(true);
  });

  it('returns false for regular auth failures', () => {
    expect(isUnknownHostKeyError('Password authentication failed')).toBe(false);
  });
});