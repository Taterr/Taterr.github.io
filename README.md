# React portfolio

A responsive, single-page portfolio template built with React and Vite for **Taterr.github.io**. Personal details and projects are sample content.

## Local development

Requires Node.js 22.12+ (Node 22 recommended).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To check the production build:

```sh
npm run build
npm run preview
```

## GitHub Pages deployment

In [repository Settings → Pages](https://github.com/Taterr/Taterr.github.io/settings/pages), set **Build and deployment → Source** to **GitHub Actions**.

The included `.github/workflows/deploy.yml` runs `npm ci` and `npm run build`, then publishes only `dist/`. It runs on pushes to `main` and can also be started manually from the Actions tab.

Do not select **Deploy from a branch → main → / (root)** for this source tree. That serves the source `index.html` and `/src/main.jsx` without compiling React, causing the browser's `text/jsx` module MIME error. The root `index.html` is Vite's input; `dist/index.html` is the deployable output and references compiled `/assets/*.js` files.

After changing the Pages source, run **Deploy portfolio to GitHub Pages** from the Actions tab and wait for it to finish. If an old page remains cached, hard-refresh the site.

`base: '/'` in `vite.config.js` is correct for `https://taterr.github.io/`. For a project site at `https://username.github.io/repository-name/`, use `base: '/repository-name/'`.

See the [Vite GitHub Pages deployment guide](https://vite.dev/guide/static-deploy#github-pages).
