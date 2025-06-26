"""ComfyUI Tools package.
Initialises runtime context and exposes node mappings.
"""
from pathlib import Path

# Ensure runtime dir exists so the JS panel can read JSON even before first run
RUNTIME_DIR = Path(__file__).parent / "runtime"
RUNTIME_DIR.mkdir(exist_ok=True)

# Import side-effect module that writes context.json at import time
from . import context_writer  # noqa: F401  # pylint: disable=unused-import

# Import nodes
from .write_node import AutoWriteNode

# ---- ComfyUI registration --------------------------------------------------

NODE_CLASS_MAPPINGS = {
    "AutoWrite": AutoWriteNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "AutoWrite": "Auto Write (prod)",
}

WEB_DIRECTORY = (Path(__file__).parent / "web").as_posix()  # served statically
