const DRAFT_KEY_PREFIX = 'skd-compose-draft-';

function draftKey(connectionId: string): string {
  return `${DRAFT_KEY_PREFIX}${connectionId}`;
}

export function loadComposeDraft(connectionId: string): string {
  try {
    return sessionStorage.getItem(draftKey(connectionId)) ?? '';
  } catch {
    return '';
  }
}

export function saveComposeDraft(connectionId: string, text: string): void {
  try {
    const key = draftKey(connectionId);
    if (text.length === 0) {
      sessionStorage.removeItem(key);
      return;
    }
    sessionStorage.setItem(key, text);
  } catch {
    // Ignore quota / private-mode errors.
  }
}

export function clearComposeDraft(connectionId: string): void {
  try {
    sessionStorage.removeItem(draftKey(connectionId));
  } catch {
    // Ignore storage errors.
  }
}