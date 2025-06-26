"""Auto Write node that saves outputs to a production path built from env context.
The template is user-configurable via an optional input.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import List, Tuple

# Default template (can be overridden per-node)
DEFAULT_PATH_TEMPLATE = (
    "/proj/{show}/{shot}/renders/{task}/{version}/{base_name}_{frame:04d}.png"
)

# Location where context_writer.py stores its JSON
CONTEXT_JSON = Path(__file__).parent / "runtime" / "context.json"


class AutoNameNode:
    """ComfyUI node that writes images to a path generated from pipeline context."""

    CATEGORY = "redmond3d"

    @classmethod
    def INPUT_TYPES(cls):  # noqa: N802 (ComfyUI expects CamelCase)
        return {
            "required": {
                "base_name": ("STRING", {"default": "frame"}),
            },
            "optional": {
                "path_template": (
                    "STRING",
                    {
                        "multiline": False,
                        "default": DEFAULT_PATH_TEMPLATE,
                    },
                )
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prefix",)

    FUNCTION = "write"

    def write(
        self,
        base_name: str,
        path_template: str | None = None,
    ) -> Tuple[str]:
        ctx = _load_ctx()
        template = path_template or DEFAULT_PATH_TEMPLATE
        # Resolve path for frame 0 just to compute prefix
        file_path = template.format(
            base_name=base_name,
            frame=0,
            **ctx,
        )
        full_path = Path(file_path)
        prefix_path = str(full_path.parent / f"{base_name}_")
        return (prefix_path,)


def _load_ctx() -> dict[str, str]:
    """Read context.json written at startup by context_writer."""
    if CONTEXT_JSON.exists():
        try:
            return json.loads(CONTEXT_JSON.read_text())
        except json.JSONDecodeError as exc:
            print(f"[AutoWrite] Warning: could not parse context.json: {exc}")
    # Fallback to env vars directly
    return {k.lower(): os.getenv(k, "") for k in ["SHOW", "SHOT", "TASK", "VERSION"]}
