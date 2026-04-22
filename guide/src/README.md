# Guide Source Structure

`Guide.html` and `docs/index.html` are generated files. Edit the split source files, then rebuild.

## Files
- `chapters/*.html`: chapter body partials in final render order.
- `assets/guide.css`: inline CSS content injected into `Guide.html`.
- `assets/guide.js`: animation and diagram helper functions injected into `Guide.html`.
- `react_shell.html`: generated-page skeleton with React runtime/data/app placeholders.
- `../react_src/src/app.js`: React shell for navigation, tab state, chapter rendering, and icon refresh.
- `../react_src/vendor/*.js`: vendored React runtime for self-contained GitHub Pages output.

## Build
Run from the `guide/` folder:

```bash
python3 build_guide.py
```

The build keeps the original single-page tab UI and emits a React-driven static page.
