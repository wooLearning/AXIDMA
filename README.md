# AXI DMA Guidebook

Self-contained AXI DMA learning guide for GitHub Pages.

## Website Entry

Open `docs/index.html` locally, or configure GitHub Pages to publish from the `docs/` folder.

## Edit Source

The editable source lives in `guide/src/` and is assembled by:

```bash
cd guide
python3 build_guide.py
```

That command updates both `guide/Guide.html` and `docs/index.html`.

## Local Study Material

PDFs, trainee source bundles, extracted notes, and work logs are stored under `_local_materials/` and ignored by Git. They are used for study/reference while keeping the public repository clean.

## PDF Link Policy

GitHub Pages can only link to PDFs that are committed into the published site folder or hosted externally. Since PDFs are ignored by default here, PDF links inside the public HTML would work only locally unless the PDFs are uploaded somewhere public or intentionally committed.
