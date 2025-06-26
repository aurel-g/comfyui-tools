"""Write production context to JSON for the JS panel.
This module is imported (for side-effects) by __init__.py when ComfyUI
initialises the extension.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

WEB_DIR = Path(__file__).parent / "web"
RUNTIME_DIR = WEB_DIR / "runtime"
RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
CONTEXT_JSON = RUNTIME_DIR / "context.json"

# -------------------- Configuration -----------------------------------------

ENV_KEYS = ["SHOW", "SHOT", "TASK", "VERSION"]

# Edit this string if your pipeline layout changes.
WORKFLOW_DIR_TEMPLATE = (
    "/proj/{show}/{shot}/comp/workflows/{task}/{version}"  # no trailing slash
)

# -------------------- Helpers ----------------------------------------------

def _gather_context() -> dict[str, str]:
    """Collect env vars and derive workflow directory."""
    data: dict[str, str] = {key.lower(): os.getenv(key, "") for key in ENV_KEYS}

    # Build the directory path (may contain empty placeholders if env missing)
    wf_dir = WORKFLOW_DIR_TEMPLATE.format(**data)
    data["workflow_dir"] = wf_dir

    try:
        wf_path = Path(wf_dir)
        if wf_path.is_dir():
            data["workflows"] = [p.name for p in wf_path.glob("*.json")]
        else:
            data["workflows"] = []
    except OSError:
        data["workflows"] = []
    return data


def write_json() -> None:
    """Write the current context to disk so that the web panel can read it."""
    context = _gather_context()
    try:
        CONTEXT_JSON.write_text(json.dumps(context, indent=2))
    except OSError as exc:
        # Non-fatal; ComfyUI can still run even if we can't write the file.
        print(f"[comfyui-tools] Warning: unable to write context.json: {exc}")


# Execute immediately on import
write_json()
