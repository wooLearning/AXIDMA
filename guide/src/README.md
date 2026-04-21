# Guide Source Structure

`Guide.html` is the generated single-file guide. Edit the split source files here, then rebuild.

## Files
- `guide_shell.html`: shared HTML skeleton, header, mobile/desktop navigation, footer, and placeholders.
- `chapters/*.html`: chapter body partials in final render order.
- `assets/guide.css`: inline CSS content injected into `Guide.html`.
- `assets/guide.js`: inline JavaScript content injected into `Guide.html`.

## Build
Run from the project root:

```bash
python3 build_guide.py
```

The build keeps the original single-page tab UI while making each chapter easier to edit.
