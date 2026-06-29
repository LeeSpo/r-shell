import { describe, expect, it } from 'vitest';
import { isValidPrivateKeyPem } from '../resolve-private-key';

describe('resolve-private-key', () => {
  it('accepts OpenSSH private key PEM', () => {
    const pem = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn
-----END OPENSSH PRIVATE KEY-----`;
    expect(isValidPrivateKeyPem(pem)).toBe(true);
  });

  it('accepts PKCS8 private key PEM', () => {
    const pem = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7
-----END PRIVATE KEY-----`;
    expect(isValidPrivateKeyPem(pem)).toBe(true);
  });

  it('rejects invalid content', () => {
    expect(isValidPrivateKeyPem('not a key')).toBe(false);
  });
});