"""Vioverse local server — runs from THIS GitHub clone, watches files and safely syncs main."""
from __future__ import annotations

import io
import json
import os
import subprocess
import sys
import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
POLL_SECONDS = 5
GIT_EXCLUDES = {".git", "__pycache__", "node_modules", ".venv"}
WATCH_EXTS = {".html", ".css", ".js", ".json", ".svg", ".webp", ".png", ".jpg", ".jpeg"}
STOP = threading.Event()
RELOAD_SNIPPET = r"""
<script id="vioverse-dev-hotreload">
(() => {
  let previous = null;
  async function checkForChanges() {
    if (document.hidden) return;
    try {
      const r = await fetch('/__dev_revision?ts=' + Date.now(), {cache:'no-store'});
      if (!r.ok) return;
      const {revision} = await r.json();
      if (previous === null) previous = revision;
      else if (revision !== previous) {
        console.info('[Vioverse] Game files changed. Reloading the correct local project.');
        window.location.reload();
      }
    } catch (_) { /* server was stopped, do not spam the console */ }
  }
  checkForChanges();
  setInterval(checkForChanges, 2000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkForChanges(); });
})();
</script>
"""


def version():
    try:
        return json.loads((ROOT / "version.json").read_text(encoding="utf-8")).get("version", "unknown")
    except (OSError, ValueError, TypeError):
        return "unknown"


def revision():
    """Detect all relevant changes without reading game asset contents."""
    latest_ns = 0
    total_size = 0
    file_count = 0
    for parent, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in GIT_EXCLUDES]
        for name in files:
            if Path(name).suffix.lower() not in WATCH_EXTS:
                continue
            try:
                stat = (Path(parent) / name).stat()
            except OSError:
                continue
            latest_ns = max(latest_ns, stat.st_mtime_ns)
            total_size += stat.st_size
            file_count += 1
    return f"{latest_ns}:{total_size}:{file_count}"


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        endpoint = urlsplit(self.path).path
        if endpoint == "/__dev_revision":
            return self.send_json({"revision": revision()})
        if endpoint == "/__dev_info":
            return self.send_json({"root": str(ROOT), "version": version(), "port": self.server.server_port})
        return super().do_GET()

    def send_json(self, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_head(self):
        endpoint = urlsplit(self.path).path
        if endpoint in ("/", "/index.html"):
            try:
                html = (ROOT / "index.html").read_text(encoding="utf-8")
            except OSError:
                self.send_error(404, "No index.html in this GitHub clone")
                return None
            html = html.replace("</body>", RELOAD_SNIPPET + "\n</body>") if "</body>" in html else html + RELOAD_SNIPPET
            data = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            return io.BytesIO(data)
        return super().send_head()


def find_git():
    from shutil import which
    if which("git"):
        return which("git")
    local_app = Path(os.environ.get("LOCALAPPDATA", "")) / "GitHubDesktop"
    if local_app.is_dir():
        matches = sorted(local_app.glob("app-*/resources/app/git/cmd/git.exe"), reverse=True)
        if matches:
            return str(matches[0])
    for path in (
        Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "Git/cmd/git.exe",
        Path(os.environ.get("ProgramFiles(x86)", "C:/Program Files (x86)")) / "Git/cmd/git.exe",
    ):
        if path.is_file():
            return str(path)
    return None


def run_git(git, *args, timeout=30):
    return subprocess.run([git, *args], cwd=ROOT, capture_output=True, text=True, timeout=timeout, check=False)


def sync_loop():
    """Safe, fast-forward-only sync. Never discard local edits or rewrite browser saves."""
    if not (ROOT / ".git").exists():
        print("[Git sync] This folder has no .git folder. Live reload works; auto-pull disabled.")
        return
    git = find_git()
    if not git:
        print("[Git sync] Git not found on PATH or in GitHub Desktop. Use GitHub Desktop > Pull origin.")
        return
    print("[Git sync] Checking GitHub origin/main every ~5 seconds. Local edits are protected.")
    previous_warning = ""
    while not STOP.is_set():
        warning = ""
        try:
            branch = run_git(git, "branch", "--show-current")
            if branch.returncode or branch.stdout.strip() != "main":
                warning = "Not on main; auto-pull is paused."
            else:
                edits = run_git(git, "status", "--porcelain", "--untracked-files=no")
                if edits.returncode or edits.stdout.strip():
                    warning = "Uncommitted tracked changes detected; auto-pull is paused for safety."
                else:
                    fetched = run_git(git, "fetch", "--quiet", "origin", "main")
                    if fetched.returncode:
                        warning = "GitHub fetch failed; check internet/credentials, or use GitHub Desktop."
                    else:
                        current = run_git(git, "rev-parse", "HEAD").stdout.strip()
                        remote = run_git(git, "rev-parse", "origin/main").stdout.strip()
                        if current != remote:
                            anc = run_git(git, "merge-base", "--is-ancestor", "HEAD", "origin/main")
                            if anc.returncode:
                                warning = "Local branch diverged; open GitHub Desktop. No files overwritten."
                            else:
                                merge = run_git(git, "merge", "--ff-only", "origin/main")
                                if merge.returncode:
                                    warning = "Safe pull blocked; open GitHub Desktop. No files overwritten."
                                else:
                                    print(f"[Git sync] Updated to v{version()} from GitHub; browser will refresh.")
        except (OSError, subprocess.TimeoutExpired):
            warning = "Git command failed or timed out. Retrying."
        if warning and warning != previous_warning:
            print("[Git sync] " + warning)
        previous_warning = warning
        STOP.wait(POLL_SECONDS)


def main():
    print(f"\n[Vioverse] Folder: {ROOT}")
    print(f"[Vioverse] Game version on disk: v{version()}")
    server = None
    port = None
    # Old server windows can keep port 3000 occupied. Use 3001 rather than displaying old game.
    for candidate in (3000, 3001):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", candidate), partial(Handler, directory=str(ROOT)))
            port = candidate
            break
        except OSError:
            if candidate == 3000:
                print("[Vioverse] Port 3000 is already occupied (probably your OLD game server).")
                print("[Vioverse] Trying port 3001 to show the updated GitHub game.")
    if server is None:
        print("Could not start on ports 3000 or 3001. Close other Vioverse windows and retry.")
        return 1
    server.daemon_threads = True
    url = f"http://localhost:{port}/"
    print(f"[Vioverse] Correct game address: {url}")
    print(f"[Vioverse] Verify source folder and version: {url}__dev_info")
    print("[Vioverse] Auto-refresh: every ~2 seconds when a game file changes.")
    print("[Vioverse] Press Ctrl+C to stop this server.")
    threading.Thread(target=sync_loop, daemon=True).start()
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        print("\n[Vioverse] Stopping...")
    finally:
        STOP.set()
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
