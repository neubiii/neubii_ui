# neubii_ui

[![CI](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml/badge.svg)](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml)

A small Vue 3 + TypeScript component library and design system, built one component at a time.

The goal is not a large catalog. Each component is treated as a public contract: a typed API, native HTML semantics, deliberate accessibility decisions, design tokens, Storybook documentation and behavioral tests, all checked in CI.

> **Status:** early and under active development. Not published to npm yet; the API may still change.

## Principles

- **Native first.** Components render real `<button>`, `<input>`, `<textarea>` and `<select>` elements and keep native disabled, required, keyboard and form behavior instead of recreating it.
- **Small, deliberate APIs.** Props describe component states, slots handle composition, and other native attributes fall through. Variants and sizes are typed unions.
- **Token-driven styling.** Components use semantic CSS custom properties, not raw colors, and don't depend on host-application CSS.
- **Accessibility as part of the API.** Stories document what each component handles and what stays the consumer's job, such as naming an icon-only button.
- **Abstractions only when needed.** Shared tokens or helpers are added when a second component needs the same decision.

## Components

| Component | Renders | Summary |
| --- | --- | --- |
| `NuiButton` | `<button>` | Variants, sizes, loading state, `start`/`end` slots for icons, icon-only sizing |
| `NuiInput` | `<input>` | Text-like input primitive with `v-model`, sizes and an invalid state |
| `NuiTextarea` | `<textarea>` | Multiline primitive; height comes from native `rows` |
| `NuiSelect` | `<select>` | Single selection with native `<option>` and `<optgroup>` children |
| `NuiField` | label, helper, error | Wires a label, helper text, error message and required state to one input, textarea or select |

The input, textarea and select are primitives: they render no label or error text. Use `NuiField`, or your own `<label for>`.

## Documentation

**[Storybook](https://neubiii.github.io/neubii_ui/) is the component reference**: props, slots, states, examples and accessibility notes for every component. It is deployed from `main` after CI passes.

## Usage

The package is not published. To try it from another Vue 3.5+ project, build and pack it:

```bash
pnpm build    # type-check, library build, declaration files
pnpm pack     # neubii_ui-0.0.0.tgz
```

Install the tarball in the other project (`pnpm add ../path/to/neubii_ui-0.0.0.tgz`). Vue is a peer dependency.

```ts
import { NuiField, NuiInput } from 'neubii_ui'
import 'neubii_ui/style.css' // tokens + component styles, imported once
```

```vue
<NuiField label="Email" :error="emailError" required v-slot="{ controlProps }">
  <NuiInput v-bind="controlProps" v-model="email" type="email" autocomplete="email" />
</NuiField>
```

Customize appearance by overriding **semantic** tokens after importing `style.css`. Component styles are scoped, so a single consumer class won't override their colors, and primitive tokens such as `--nui-color-gray-500` have no effect when overridden on a container.

```css
.checkout-form {
  --nui-color-field-border: #0f766e;
  --nui-color-focus-ring: #7c3aed;
}
```

## Architecture

- **Colocated components.** Each folder in `src/components/` holds the `.vue` implementation, public `.types.ts`, stories, `__tests__/` and a local `index.ts`.
- **Explicit public API.** `src/index.ts` only re-exports components and their public types. `src/library.ts` is the build entry: it adds the token CSS, so the tokens ship in `dist/style.css` without the type declarations referencing CSS.
- **Two token layers** in `src/styles/tokens.css`: primitives (`--nui-color-red-600`) feed semantic roles (`--nui-color-field-border-invalid`), and components use only the semantic roles. Controls share size, typography and focus-ring tokens, so a button and an input of the same size line up.
- **Package output.** An ES module that imports Vue instead of bundling it, one stylesheet and `.d.ts` files. Storybook, tests and the playground (`src/App.vue`) are not shipped.

## Quality

- **Tests:** Vitest + Vue Test Utils, aimed at public behavior (rendered semantics, attributes, events, `v-model`, slots) rather than internals.
- **Static checks:** `vue-tsc` type-checking, ESLint and oxlint.
- **Accessibility:** the Storybook a11y addon checks stories while browsing. Automated checks catch only part of the issues, so they are not treated as proof of conformance.
- **CI** (GitHub Actions, on pull requests and pushes to `main`): unit tests → type-check → lint → library build → declaration build → Storybook build. On `main`, a separate job then deploys that same Storybook build to GitHub Pages. Only the deploy job can write to Pages; the rest of the workflow has read-only repository permissions, and only `esbuild`'s install script is allowed to run.

## Development

Requires Node.js `^22.18.0 || >=24.12.0` and pnpm.

```bash
pnpm dev               # playground
pnpm storybook         # component workbench

pnpm exec vitest run   # the checks CI runs
pnpm type-check
pnpm lint:check        # `pnpm lint` and `pnpm format` rewrite files
pnpm build
pnpm build-storybook
```

Changes go through short-lived branches and pull requests, pass CI, and are squash-merged.

## Roadmap

Likely next, in no fixed order: more form controls, npm publishing with a versioning and release workflow, visual regression testing, and contribution documentation.

## License

[MIT](LICENSE)
