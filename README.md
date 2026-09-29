# React + Vite

## Deploy

Run the following command with an optional commit message:

```bash
npm run push -- "Describe your change"
```

The script runs lint and build, commits the changes, and pushes the current branch to GitHub. Pushes to `main` automatically deploy through GitHub Pages using `.github/workflows/deploy.yml`.

In the repository settings, open **Pages** and set **Source** to **GitHub Actions** once. The deployed site will be available at:

`https://salahuddinjony.github.io/SEU_frontEnd/`

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
