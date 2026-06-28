# skd

skd is a macOS lightweight terminal workspace focused on SSH, local shells, SFTP file management, host profiles, and proxy-based connections.

## Features

- **SSH terminal sessions** — Interactive PTY terminals over SSH with password, public key, and keyboard-interactive authentication
- **Local shell sessions** — Open a local terminal tab alongside remote sessions
- **Multi-tab terminal workspace** — Tab groups with split panes (up, down, left, right) and drag-and-drop tab management
- **SFTP file manager** — Dual-panel file browser with upload, download, rename, delete, and transfer queue
- **Host profiles and bookmarks** — Save connections in a tree-view sidebar with folders, favorites, tags, and session restore
- **Password and private key authentication** — RSA, Ed25519, and ECDSA key support
- **Proxy configuration** — HTTP, SOCKS4, and SOCKS5 proxies for SSH connections

## Tech Stack

- **Tauri 2** — Desktop shell using the OS native webview
- **Rust** — SSH/SFTP backend (`russh`, `russh-sftp`, `portable-pty`, `tokio`)
- **React 19** — UI with TypeScript and Tailwind CSS
- **xterm.js** — Terminal emulation with WebGL rendering
- **CodeMirror 6** — Remote file editor
- **react-i18next** — User-facing strings

## Requirements

- macOS (Apple Silicon or Intel)
- Node.js + pnpm
- Rust toolchain

## Development

```bash
pnpm install
pnpm tauri dev
```

Other useful commands:

```bash
pnpm dev          # Frontend only (Vite on port 1420)
pnpm test         # Frontend unit tests (Vitest)
pnpm lint         # ESLint
cd src-tauri && cargo test   # Rust unit tests
```

## Build

Produces a macOS `.app` bundle and `.dmg` installer:

```bash
pnpm build && pnpm tauri build
```

Local build without updater artifacts:

```bash
pnpm tauri:build:local
```

## Acknowledgements

This project started as a fork of [R-Shell](https://github.com/GOODBOY008/r-shell) by GOODBOY008, licensed under the MIT License.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.

Original R-Shell copyright is retained. See [NOTICE](NOTICE) for attribution details.