import { invoke } from '@tauri-apps/api/core';
import { isHostKeyVerificationEnabled, parseUnknownHostKeyError } from './host-key-verification';

export interface SshConnectParams {
  connection_id: string;
  host: string;
  port: number;
  username: string;
  auth_method: string;
  password?: string | null;
  key_content?: string | null;
  passphrase?: string | null;
}

export type SftpConnectParams = SshConnectParams;

export interface ConnectResponse {
  success: boolean;
  error?: string;
  pendingHostKeyTrust?: boolean;
}

export type HostKeyTrustRequest = {
  payload: NonNullable<ReturnType<typeof parseUnknownHostKeyError>>;
  retry: () => Promise<ConnectResponse>;
};

export async function sshConnectWithHostKeyTrust(
  params: SshConnectParams,
  onTrustRequired: (request: HostKeyTrustRequest) => void,
): Promise<ConnectResponse> {
  const attempt = async (): Promise<ConnectResponse> => invoke<ConnectResponse>('ssh_connect', {
    request: {
      ...params,
      host_key_verification: isHostKeyVerificationEnabled(),
    },
  });

  const result = await attempt();
  if (result.success) {
    return result;
  }

  const payload = result.error ? parseUnknownHostKeyError(result.error) : null;
  if (payload) {
    onTrustRequired({ payload, retry: attempt });
    return { ...result, pendingHostKeyTrust: true };
  }

  return result;
}

export async function sftpConnectWithHostKeyTrust(
  params: SftpConnectParams,
  onTrustRequired: (request: HostKeyTrustRequest) => void,
): Promise<ConnectResponse> {
  const attempt = async (): Promise<ConnectResponse> => invoke<ConnectResponse>('sftp_connect', {
    request: {
      ...params,
      host_key_verification: isHostKeyVerificationEnabled(),
    },
  });

  const result = await attempt();
  if (result.success) {
    return result;
  }

  const payload = result.error ? parseUnknownHostKeyError(result.error) : null;
  if (payload) {
    onTrustRequired({ payload, retry: attempt });
    return { ...result, pendingHostKeyTrust: true };
  }

  return result;
}