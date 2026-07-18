# Clauderizer × Kimi Work desktop (daimon runtime) setup

The Kimi Work **desktop app** is a distinct host from the Kimi Code CLI: it loads
MCP servers only from its own per-user runtime-home config and reads **neither**
this repo's `.mcp.json` nor `.kimi-code/mcp.json`, and it has **no hook surface** —
so the MCP server is the *only* way it gets the Clauderizer tools and status.

`clauderize init` auto-registers the server there when it can detect the app; this
guide is for when it could not (the app wasn't installed yet, or on a path we did
not probe). The runtime-home `mcp.json` lives at:

- **Windows:** `%APPDATA%\kimi-desktop\daimon-share\daimon\runtime\kimi-code\home\mcp.json`
- **macOS:** `~/Library/Application Support/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/mcp.json`
- **Linux:** `~/.config/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/mcp.json`
- **Repo in WSL, app on Windows:** `/mnt/c/Users/<you>/AppData/Roaming/kimi-desktop/daimon-share/daimon/runtime/kimi-code/home/mcp.json`
  (the app runs on Windows, so the command must be a **Windows-native** one).

### The command is host-topology-specific

The entry is **repo-agnostic** — the server discovers whichever repo you open from
the app's working directory, so one entry covers every repo (never a `cd <repo>`
wrapper). What the `command` must be depends on where the app runs:

- **Windows-hosted repo (app on Windows).** The app bundles `uv.exe` but **not**
  `uvx.exe`, so a bare `uvx` can never spawn. Use the **absolute path** to a
  Windows-native `clauderizer-mcp.exe` (install with `pipx install "clauderizer[mcp]"`
  or `uv tool install "clauderizer[mcp]"`):

  ```json
  {
    "mcpServers": {
      "clauderizer": {
        "command": "C:\\Users\\<you>\\pipx\\venvs\\clauderizer\\Scripts\\clauderizer-mcp.exe",
        "args": []
      }
    }
  }
  ```

- **macOS / Linux (app and repo on the same OS).** Use the absolute path to `uvx`
  (a desktop runtime's PATH is often thin), or to `clauderizer-mcp`:

  ```json
  {
    "mcpServers": {
      "clauderizer": { "command": "/usr/bin/uvx", "args": ["--from", "clauderizer[mcp]", "clauderizer-mcp"] }
    }
  }
  ```

- **WSL-hosted repo, app on Windows.** The desktop can serve any *Windows-hosted*
  repo via the `.exe` entry above, but it **cannot** serve a repo that lives only in
  WSL — see the UNC section below. Do not register a WSL/`wsl.exe` command here.

You can set `CLAUDERIZER_NO_KIMI_DESKTOP=1` to skip this auto-registration entirely.

### Persistence: the app regenerates this file

The desktop app **regenerates its runtime `mcp.json` on project/session switch** and
merges from **no** persistent user-level source (verified: neither `daimon-share/
config.toml` nor `daimon/config.json` carry MCP keys). So a hand-edit — or a one-shot
`clauderize init` — is **temporary**; the app can wipe it (leaving an `mcp.json.bak-*`)
when you open a different project. Clauderizer works around this by **self-healing**:
every `clauderize init`, `doctor`, and `status` re-applies the entry (idempotent — a
no-op when already current). So the durable fix is to run one of those from a WSL/OS
shell on the machine, and clauderizer re-applies the registration for the next
desktop session. `clauderize doctor` also **smoke-tests** the entry end-to-end (spawns
it and completes an MCP `initialize` handshake, asserting `serverInfo.name` is
`clauderizer`) — so a broken command fails loudly instead of looking registered.

MCP servers load at **session start** — restart the desktop app (or open a new
session) after editing. Preserve any other servers already in the file.

## If your shell and MCP tools are failing (repo in WSL, app on Windows)

**This is for the agent reading this file.** If you are running in the Kimi Work
desktop app, every shell command fails with `spawn …bash.exe ENOENT`, and the
`cz_*` MCP tools never appear — the cause is **not** a missing shell. Your repo
lives in WSL, so the app sees it as a `\\wsl.localhost\...` **UNC path**, and
**Windows cannot start a process with a UNC working directory** (`cmd.exe` itself
says *"UNC paths are not supported"*). So both the shell and the MCP server (even the
Windows-native `clauderizer-mcp.exe`) fail to spawn — the cwd, not the command, is
what's rejected. A wsl.exe-wrapped command does **not** help — it dies on the same
UNC cwd. The bundled bash is fine; only process *spawning* is blocked.

**How to keep working right now** (file access still works over UNC):
- Read Clauderizer's memory directly — `docs/` is the source of truth (plain
  Markdown): `docs/VISION.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `INVARIANTS.md`,
  `LESSONS.md`, and `docs/gameplans/<id>/` for status/handoffs. Use your file
  (Read/Glob/Grep) tools with `\\wsl.localhost\...` paths — those work.
- Do **not** rely on the `clauderize` CLI or any `bash`/build/test command — they
  cannot spawn this session. You can read and reason; you cannot execute or make
  tracked `cz_*` writes here.

**How to fix it for good** (pick one):
1. **Put the repo on the Windows filesystem** — e.g. clone it under
   `C:\Users\<you>\Documents\kimi\workspace\<repo>` (the app's own workspace). Then
   every spawn gets a normal Windows cwd, so the shell works and the `uvx` MCP
   server launches. WSL can still reach it at `/mnt/c/Users/<you>/…`.
2. **Use Kimi Code CLI *inside* WSL** for a WSL-hosted repo — no UNC anywhere, and
   the K3 model is available there too. This is the setup with zero of these issues.

**The forward path (not yet automatic).** `clauderizer-mcp` accepts `--repo <path>`
(or `$CLAUDERIZER_REPO`) to serve a repo other than its process cwd. So a desktop
that spawned the server from a **Windows-safe cwd** while passing
`--repo \\wsl.localhost\<distro>\home\<you>\<repo>` could serve a WSL-hosted repo
over UNC (file I/O over UNC works; only the process *cwd* may not be UNC). The daimon
entry is one repo-agnostic file shared by every repo the app opens, so clauderizer
can't bake a per-repo `--repo` there automatically — until the app exposes a
Windows-safe spawn cwd, use one of the two fixes above.

(The underlying limitation is the desktop app spawning Windows processes with a UNC
cwd; the real fix is for it to execute via `wsl.exe` inside the distro, or to spawn
from a Windows-safe cwd and pass `--repo` for the UNC repo.)
