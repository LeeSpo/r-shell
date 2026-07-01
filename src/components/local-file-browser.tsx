import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { FilePanel } from './file-panel';
import type { FileEntry } from '@/lib/file-entry-types';

/**
 * Bottom-panel local filesystem browser for Local shell tabs.
 * Reuses FilePanel + native Tauri file commands (no SFTP connection).
 */
export function LocalFileBrowser() {
  const { t } = useTranslation();
  const [homePath, setHomePath] = useState<string | undefined>(undefined);

  useEffect(() => {
    invoke<string>('get_home_directory')
      .then((home) => setHomePath(home))
      .catch(() => setHomePath('/'));
  }, []);

  const loadLocalDirectory = useCallback(async (path: string) => {
    return invoke<FileEntry[]>('list_local_files', { path });
  }, []);

  const deleteLocalItem = useCallback(async (path: string, isDirectory: boolean) => {
    await invoke<void>('delete_local_item', { path, isDirectory });
  }, []);

  const renameLocalItem = useCallback(async (oldPath: string, newPath: string) => {
    await invoke<void>('rename_local_item', { oldPath, newPath });
  }, []);

  const createLocalDirectory = useCallback(async (path: string) => {
    await invoke<void>('create_local_directory', { path });
  }, []);

  const openInOS = useCallback(async (path: string) => {
    await invoke<void>('open_in_os', { path });
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground">
      <FilePanel
        mode="local"
        label={t('fileBrowser.local')}
        isActive
        initialPath={homePath}
        onLoadDirectory={loadLocalDirectory}
        onDelete={deleteLocalItem}
        onRename={renameLocalItem}
        onCreateDirectory={createLocalDirectory}
        onOpenInOS={openInOS}
        onFocus={() => {}}
        showPermissions={false}
      />
    </div>
  );
}