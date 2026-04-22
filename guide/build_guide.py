#!/usr/bin/env python3
"""Build the React-based single-file AXI DMA guide."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
SRC = ROOT / "src"
CHAPTERS = SRC / "chapters"
ASSETS = SRC / "assets"
REACT_SRC = ROOT / "react_src"
OUT = ROOT / "Guide.html"
SITE_OUT = PROJECT / "docs" / "index.html"

CHAPTER_ORDER = [
    "01_intro.html",
    "02_programming_flow.html",
    "03_dma_engine.html",
    "04_scatter_gather.html",
    "05_csr.html",
    "06_verification_extension.html",
    "07_system_level.html",
]

NAV_ITEMS = [
    {"id": "intro", "desktopLabel": "1. Big Picture", "mobileLabel": "1. Big Picture"},
    {"id": "axi4", "desktopLabel": "2. AXI4 Burst", "mobileLabel": "2. Burst"},
    {"id": "axi", "desktopLabel": "3. AXI-Stream", "mobileLabel": "3. Stream"},
    {"id": "sg", "desktopLabel": "4. SG 프로세스 심화", "mobileLabel": "4. SG 모드"},
    {"id": "csr", "desktopLabel": "5. CSR 비트맵", "mobileLabel": "5. CSR"},
    {"id": "case", "desktopLabel": "6. TEA 파이프라인", "mobileLabel": "6. TEA 사례"},
    {"id": "system", "desktopLabel": "7. OS/Video 디버깅", "mobileLabel": "7. System"},
]


def indent_block(text: str, spaces: int = 0) -> str:
    prefix = " " * spaces
    return "\n".join(prefix + line if line else line for line in text.rstrip().splitlines())


def extract_chapter(chapter_html: str) -> tuple[str, str]:
    match = re.match(
        r"\s*(?:<!--.*?-->\s*)?<section\s+id=\"([a-z0-9-]+)-section\"[^>]*>(.*)</section>\s*",
        chapter_html,
        flags=re.DOTALL,
    )
    if not match:
        raise ValueError("Chapter partial must contain one top-level section with id='<tab>-section'.")
    return match.group(1), match.group(2).strip()


def script_assignment(name: str, value: object) -> str:
    return f"window.{name} = {json.dumps(value, ensure_ascii=False)};"


def main() -> None:
    shell = (SRC / "react_shell.html").read_text(encoding="utf-8")
    utility_css = (ASSETS / "tailwind_static.css").read_text(encoding="utf-8").rstrip()
    custom_css = (ASSETS / "guide.css").read_text(encoding="utf-8").rstrip()
    css = f"{utility_css}\n\n{custom_css}"
    js = (ASSETS / "guide.js").read_text(encoding="utf-8").rstrip()
    react_runtime = (REACT_SRC / "vendor" / "react.production.min.js").read_text(encoding="utf-8").rstrip()
    react_dom_runtime = (REACT_SRC / "vendor" / "react-dom.production.min.js").read_text(encoding="utf-8").rstrip()
    react_app = (REACT_SRC / "src" / "app.js").read_text(encoding="utf-8").rstrip()

    chapters: dict[str, dict[str, str]] = {}
    for chapter in CHAPTER_ORDER:
        tab_id, chapter_body = extract_chapter((CHAPTERS / chapter).read_text(encoding="utf-8"))
        chapters[tab_id] = {"id": tab_id, "html": chapter_body}

    guide_data = "\n".join(
        [
            script_assignment("GUIDE_NAV_ITEMS", NAV_ITEMS),
            script_assignment("GUIDE_CHAPTERS", chapters),
        ]
    )

    html = shell.replace("{{GUIDE_CSS}}", indent_block(css, 4))
    html = html.replace("{{REACT_RUNTIME}}", indent_block(react_runtime, 4))
    html = html.replace("{{REACT_DOM_RUNTIME}}", indent_block(react_dom_runtime, 4))
    html = html.replace("{{GUIDE_JS}}", indent_block(js, 4))
    html = html.replace("{{GUIDE_DATA}}", indent_block(guide_data, 4))
    html = html.replace("{{REACT_APP}}", indent_block(react_app, 4))
    OUT.write_text(html.rstrip() + "\n", encoding="utf-8")
    SITE_OUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_OUT.write_text(html.rstrip() + "\n", encoding="utf-8")
    print(f"Built React guide {OUT} and {SITE_OUT} from {len(CHAPTER_ORDER)} chapter files.")


if __name__ == "__main__":
    main()
