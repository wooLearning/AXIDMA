#!/usr/bin/env python3
"""Build the single-file AXI DMA guide from split source partials."""

from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
SRC = ROOT / "src"
CHAPTERS = SRC / "chapters"
ASSETS = SRC / "assets"
OUT = ROOT / "Guide.html"
SITE_OUT = PROJECT / "docs" / "index.html"

CHAPTER_ORDER = [
    "01_intro.html",
    "02_programming_flow.html",
    "03_dma_engine.html",
    "04_scatter_gather.html",
    "05_csr.html",
    "06_verification_extension.html",
]


def indent_block(text: str, spaces: int = 0) -> str:
    prefix = " " * spaces
    return "\n".join(prefix + line if line else line for line in text.rstrip().splitlines())


def main() -> None:
    shell = (SRC / "guide_shell.html").read_text(encoding="utf-8")
    utility_css = (ASSETS / "tailwind_static.css").read_text(encoding="utf-8").rstrip()
    custom_css = (ASSETS / "guide.css").read_text(encoding="utf-8").rstrip()
    css = f"{utility_css}\n\n{custom_css}"
    js = (ASSETS / "guide.js").read_text(encoding="utf-8").rstrip()
    chapters = "\n\n".join(
        (CHAPTERS / chapter).read_text(encoding="utf-8").rstrip()
        for chapter in CHAPTER_ORDER
    )

    html = shell.replace("{{GUIDE_CSS}}", indent_block(css, 4))
    html = html.replace("{{CHAPTERS}}", chapters)
    html = html.replace("{{GUIDE_JS}}", indent_block(js, 4))
    OUT.write_text(html.rstrip() + "\n", encoding="utf-8")
    SITE_OUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_OUT.write_text(html.rstrip() + "\n", encoding="utf-8")
    print(f"Built {OUT} and {SITE_OUT} from {len(CHAPTER_ORDER)} chapter files.")


if __name__ == "__main__":
    main()
