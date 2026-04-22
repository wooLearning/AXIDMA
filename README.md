# AXI DMA Guidebook

Self-contained AXI DMA learning guide for GitHub Pages.

## Website Entry

Open `docs/index.html` locally, or configure GitHub Pages to publish from the `docs/` folder.

## Edit Source

The editable source is split into content, styling, runtime behavior, and a small React app shell:

- `guide/src/chapters/*.html`: chapter body content
- `guide/src/assets/guide.css`: guide styling
- `guide/src/assets/guide.js`: diagram/animation helpers
- `guide/react_src/src/app.js`: React shell for tabs, layout, and rendering
- `guide/react_src/vendor/*.js`: vendored React runtime used by the single-file build

Build with the same command:

```bash
cd guide
python3 build_guide.py
```

That command updates both `guide/Guide.html` and `docs/index.html`. GitHub Pages still serves `docs/index.html`.

## Local Study Material

PDFs, trainee source bundles, extracted notes, and work logs are stored under `_local_materials/` and ignored by Git. They are used for study/reference while keeping the public repository clean.

## PDF Link Policy

GitHub Pages can only link to PDFs that are committed into the published site folder or hosted externally. Since PDFs are ignored by default here, PDF links inside the public HTML would work only locally unless the PDFs are uploaded somewhere public or intentionally committed.
