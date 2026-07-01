import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

export const BRACKETED_PASTE_START = '\x1b[200~';
export const BRACKETED_PASTE_END = '\x1b[201~';

export type TerminalInputSender = (data: string) => boolean;

export interface SendToTerminalOptions {
  /** Wrap payload in bracketed-paste escape sequences (default: true). */
  bracketedPaste?: boolean;
  /** Append a trailing line ending when the text does not end with one (default: true). */
  appendNewline?: boolean;
  /** Line ending used for submission (default: '\\n' with bracketed paste, '\\r' otherwise). */
  submitChar?: string;
  /** Convert draft newlines to submitChar (default: true when bracketed paste is off). */
  normalizeLineBreaks?: boolean;
}

interface TerminalInputContextValue {
  registerSender: (connectionId: string, sender: TerminalInputSender) => void;
  unregisterSender: (connectionId: string) => void;
  sendToTerminal: (
    connectionId: string,
    text: string,
    options?: SendToTerminalOptions,
  ) => boolean;
}

const TerminalInputContext = createContext<TerminalInputContextValue | null>(null);

export function wrapBracketedPaste(text: string): string {
  return `${BRACKETED_PASTE_START}${text}${BRACKETED_PASTE_END}`;
}

function endsWithLineBreak(text: string): boolean {
  return text.endsWith('\n') || text.endsWith('\r');
}

export function prepareTerminalPayload(
  text: string,
  options?: SendToTerminalOptions,
): string {
  const bracketedPaste = options?.bracketedPaste ?? true;
  const appendNewline = options?.appendNewline ?? true;
  const submitChar = options?.submitChar ?? (bracketedPaste ? '\n' : '\r');
  const normalizeLineBreaks = options?.normalizeLineBreaks ?? !bracketedPaste;

  let payload = text;

  if (normalizeLineBreaks) {
    payload = payload.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, submitChar);
  }

  if (appendNewline && payload.length > 0 && !endsWithLineBreak(payload) && !payload.endsWith(submitChar)) {
    payload += submitChar;
  }

  if (bracketedPaste && payload.length > 0) {
    payload = wrapBracketedPaste(payload);
  }

  return payload;
}

/** Options for compose-pane sends: raw PTY input with Enter (\\r) semantics. */
export const COMPOSE_PANE_SEND_OPTIONS: SendToTerminalOptions = {
  bracketedPaste: false,
  appendNewline: true,
  submitChar: '\r',
  normalizeLineBreaks: true,
};

export function TerminalInputProvider({ children }: { children: React.ReactNode }) {
  const sendersRef = useRef(new Map<string, TerminalInputSender>());

  const registerSender = useCallback((connectionId: string, sender: TerminalInputSender) => {
    sendersRef.current.set(connectionId, sender);
  }, []);

  const unregisterSender = useCallback((connectionId: string) => {
    sendersRef.current.delete(connectionId);
  }, []);

  const sendToTerminal = useCallback(
    (connectionId: string, text: string, options?: SendToTerminalOptions) => {
      const sender = sendersRef.current.get(connectionId);
      if (!sender) {
        return false;
      }

      const payload = prepareTerminalPayload(text, options);
      if (payload.length === 0) {
        return false;
      }

      return sender(payload);
    },
    [],
  );

  const value = useMemo(
    () => ({ registerSender, unregisterSender, sendToTerminal }),
    [registerSender, unregisterSender, sendToTerminal],
  );

  return (
    <TerminalInputContext.Provider value={value}>
      {children}
    </TerminalInputContext.Provider>
  );
}

export function useTerminalInput(): TerminalInputContextValue {
  const context = useContext(TerminalInputContext);
  if (!context) {
    throw new Error('useTerminalInput must be used within a TerminalInputProvider');
  }
  return context;
}