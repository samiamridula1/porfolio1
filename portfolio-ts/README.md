# Samia Rahman Mridula — Portfolio (HTML + CSS + TypeScript)

No framework. Same look as before. The only change: the script is written in TypeScript.

## Files
- `index.html` — page content
- `style.css` — styles
- `src/main.ts` — **edit this** (TypeScript source)
- `script.js` — generated from `src/main.ts` (don't edit by hand)
- `Samia-Rahman-Mridula-CV.pdf` — your CV

## Run it
Just open `index.html` (or use Live Server). `script.js` is already built.

## After editing `src/main.ts`
```bash
npm install      # first time only (installs TypeScript)
npm run build    # compiles src/main.ts -> script.js
npm run watch    # or: rebuild automatically on save
```

## Add a project
Copy a `<article class="project-card" ...>` block in `index.html`.
Set `data-category` to `web`, `systems`, `game`, `ml` or `cv` (add `featured` to show it under Featured).
