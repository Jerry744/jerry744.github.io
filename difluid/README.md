# DiFluid — Brand perspective

A self-contained, bilingual, seven-chapter brand and experience vision site.

Public entry: https://www.halfmind.nl/difluid/

## Pages

- `index.html`: Brand promise and chapter directory.
- `foundation.html`: Why understanding matters and how the brand is built.
- `identity.html`: Official wordmarks, manual motion playback, color selection and type.
- `applications.html`: Supplied concept imagery and context selection.
- `experience.html`: Touchpoint continuity and the seven-stage Understanding Loop.
- `future.html`: Proposed operating cadence, pilot and learning measures.
- `resources.html`: Six explicitly unavailable download categories.

The site is an editorial brand perspective. Future experience and operating models are proposals; concept application imagery does not imply released products or production specifications.

## Maintain

No dependency installation or server rendering is required. GitHub Pages serves the generated HTML, CSS and JavaScript directly.

```sh
cd difluid
npm run build
npm run check
# From the repository root, preview with:
python3 -m http.server 4173
```

Edit content in `src/home.mjs`, `src/foundation.mjs`, `src/identity.mjs`, `src/experience.mjs` and `src/resources.mjs`. The build script creates all seven HTML files and combines shared and chapter CSS. Shared navigation and metadata live in `src/build.mjs`.

`site.js` enhances the mobile navigation and imports chapter interactions. All prose and links are rendered at build time. Without JavaScript the seven loop stages remain visible. The animation never autoplays; native controls, Play/Pause and Replay are available. Reduced-motion preferences disable CSS transitions.

## Assets and sources

Supplied assets are preserved as official wordmark SVGs and the original logo motion MP4. Brand application PNG concept studies were converted to WebP for display. These display files are separate from downloadable asset packages.

Editorial direction is based on the supplied `Binder-difluid-vi-3.pdf`, the Brand Foundation material, the brand/marketing delivery plan and the draft brand experience methodology. The PDF takes precedence for its more developed visual guidance. No internal diagnostic reports, personnel details or unpublished metrics are included.

Mona Sans and Noto Sans SC are subset from the supplied font files, with their SIL Open Font License texts in `assets/`. If adding new Chinese text, regenerate the Noto subset to cover the new characters, or rely on the configured system-font fallback. Font subsetting used FontTools and Brotli as temporary authoring tools; these are not site runtime dependencies.

## Downloads

`downloads/` intentionally contains only `.gitkeep`. No download file, empty ZIP or broken link is advertised. To enable a category later, add its approved bundle here and replace that category's disabled button in `src/resources.mjs` with a real anchor and `download` attribute; rebuild and update the placeholder check accordingly.

## Publish scope

Commit only `difluid/`. Root `index.html`, `CNAME`, other projects and the repository publishing configuration are outside this site's scope. Inspect staged paths before pushing the existing main branch. Direct chapter URLs work on GitHub Pages without rewrites.
