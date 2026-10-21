# neubii_ui

[![CI](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml/badge.svg)](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml)

A growing Vue 3 + TypeScript component and design system, built one component at a time.

The goal is not a large component catalog. Each component is treated as a small public contract: a typed API, native HTML semantics, accessibility decisions, design tokens, Storybook documentation and behavioral tests, all checked in CI.

What makes it interesting to read:

- **Native first.** Components render real `<button>`, `<input>`, `<textarea>` and `<select>` elements and rely on native disabled, readonly and required behavior instead of recreating it.
- **Small, deliberate APIs.** Props describe component states. Composition happens through slots. Everything else falls through as native attributes.
- **Token-driven styling.** Components consume semantic CSS custom properties, not raw colors.
- **Documented trade-offs.** Stories and docs explain what the component handles and what stays the consumer's responsibility, such as naming an icon-only button.

> **Status:** under active development. Not yet published to npm, and the API may still change.

## Components

### NuiButton

A native `<button>` with variants, sizes, a loading state and slot-based composition.

```vue
<NuiButton :loading="isSaving">
  <template #start>
    <SaveIcon aria-hidden="true" />
  </template>

  Save changes
</NuiButton>
```

```vue
<NuiButton icon-only variant="ghost" aria-label="Close">
  <CloseIcon aria-hidden="true" />
</NuiButton>
```

- `primary`, `secondary` and `ghost` variants; `sm`, `md` and `lg` sizes
- typed native `type`: `button` (default), `submit`, `reset`
- native `disabled`
- `loading`: natively disables the button, sets `aria-busy="true"` and shows a CSS spinner
- stable loading layout: the label stays rendered underneath the spinner, so the button keeps its width and accessible name
- spinner rotation is turned off under `prefers-reduced-motion: reduce`
- `start`, `default` and `end` slots that accept any Vue content
- `iconOnly`: compact, square-by-default sizing for icon-only buttons; the consumer provides the accessible name (`aria-label` or `aria-labelledby`)
- native attribute fallthrough and a typed `click` event

There is no icon library and no `icon` prop. Icons are ordinary slot content.

### NuiInput

A native text-like `<input>` primitive.

```vue
<label for="email">Email</label>
<NuiInput
  id="email"
  v-model="email"
  type="email"
  invalid
  aria-describedby="email-error"
/>
<p id="email-error">Enter a complete email address.</p>
```

- `v-model` with a `string` value
- `text`, `email`, `password`, `search`, `tel` and `url` types
- `sm`, `md` and `lg` sizes
- native `disabled`, `readonly` and `required`
- `invalid` state that sets `aria-invalid="true"`
- native attribute fallthrough (`autocomplete`, `aria-describedby`, …)

NuiInput deliberately stays a primitive. It does not render a label, helper text or error message. Those are composed by the consumer, as in the example above, until a dedicated field component is justified.

### NuiTextarea

A native `<textarea>` primitive for multiline text.

```vue
<label for="message">Message</label>
<NuiTextarea id="message" v-model="message" rows="4" maxlength="500" />
```

- `v-model` with a `string` value
- `sm`, `md` and `lg` sizes (padding only; height comes from native `rows`)
- native `disabled`, `readonly` and `required`
- `invalid` state that sets `aria-invalid="true"`
- native resizing is left in place
- native attribute fallthrough (`rows`, `maxlength`, `aria-describedby`, …)

Like NuiInput, it does not render a label, helper text or error message.

### NuiSelect

A native single-selection `<select>` primitive. Options are native `<option>` and `<optgroup>` elements in the default slot.

```vue
<label for="country">Country</label>
<NuiSelect id="country" v-model="country">
  <option value="" disabled>Select a country</option>
  <option value="de">Germany</option>
  <option value="in">India</option>
</NuiSelect>
```

- required `v-model` with a `string` value: initialize it to an option's value, or to `''` with an empty-value prompt option as above
- `sm`, `md` and `lg` sizes
- native `disabled` and `required`
- `invalid` state that sets `aria-invalid="true"`
- native appearance, dropdown arrow and keyboard behavior are left in place
- native attribute fallthrough (`form`, `autocomplete`, `aria-describedby`, …)

There is no `options`, `placeholder` or `multiple` prop. Like NuiInput, it does not render a label, helper text or error message.

## Architecture

### Component structure

Each component keeps everything needed to understand it in one folder:

```text
src/components/NuiButton/
├── __tests__/
│   └── NuiButton.test.ts
├── NuiButton.vue
├── NuiButton.types.ts
├── NuiButton.stories.ts
└── index.ts
```

```text
.vue         → implementation
.types.ts    → public TypeScript contract
.stories.ts  → interactive documentation
__tests__/   → behavioral contract
index.ts     → public exports
```

`src/index.ts` is the library entry point. It re-exports components and their public types and imports the design tokens.

### Design tokens

Styling decisions live in CSS custom properties in `src/styles/tokens.css`, in two layers:

```text
primitive token          semantic token                   component
--nui-color-gray-800  →  --nui-color-action-primary-bg  →  NuiButton
--nui-color-red-600   →  --nui-color-field-border-invalid →  NuiInput
```

Components only reference semantic roles, so a theme can change what "primary action" or "invalid field" means without editing component CSS.

Controls also share a small sizing and typography contract, so a button and an input of the same size line up:

- `--nui-control-min-height-{sm,md,lg}` and matching block and inline padding (NuiTextarea uses the padding but not the single-line minimum heights)
- `--nui-control-font-size` and `--nui-control-line-height`
- `--nui-focus-ring-width`, `--nui-focus-ring-offset` and `--nui-color-focus-ring` for the visible focus outline
- `--nui-opacity-disabled`

New tokens are added only when more than one component needs the same decision.

### Composition over configuration

- Props describe meaningful component states.
- Slots handle composition.
- Native attributes stay available through Vue attribute fallthrough.
- CSS custom properties carry design-system decisions.

Button icons are a concrete example. This project avoids:

```vue
<NuiButton icon="save.svg" />
```

and prefers:

```vue
<NuiButton>
  <template #start>
    <SaveIcon />
  </template>

  Save
</NuiButton>
```

The library stays independent of any icon set, and the consumer keeps control over the icon's markup and accessibility attributes.

## Accessibility

Accessibility is treated as part of each component's API and reviewed through semantics, stories and automated checks. In practice:

- native `<button>`, `<input>`, `<textarea>` and `<select>` elements, with native disabled, readonly and required semantics
- a visible `:focus-visible` outline driven by shared focus tokens
- `aria-busy` on loading buttons; `aria-invalid` on invalid inputs, textareas and selects
- icon-only buttons leave naming to the consumer, and the docs show how (`aria-label`)
- slot content is never automatically hidden; stories mark decorative icons with `aria-hidden="true"`
- Input, Textarea and Select stories pair the control with a `<label for>` and link visible error text with `aria-describedby`
- the loading spinner respects `prefers-reduced-motion`
- the Storybook accessibility addon checks each story in the Storybook UI

Automated checks catch only a subset of issues, so they are not treated as proof of conformance.

## Testing and quality

| Tool | Purpose |
| --- | --- |
| Vitest + Vue Test Utils | behavioral unit tests |
| TypeScript / `vue-tsc` | type-checking, including `.vue` files |
| ESLint + oxlint | linting |
| Storybook + a11y addon | component documentation; accessibility checks while browsing stories |

Tests target public behavior: rendered semantics, attributes, emitted events and slot output. They don't target internal implementation details. NuiButton, NuiInput, NuiTextarea and NuiSelect are currently covered by 53 unit tests.

Storybook loads only the design tokens, not the playground's base styles. This exposes components that accidentally depend on host-application CSS.

### CI

GitHub Actions (`.github/workflows/ci.yml`) runs on pull requests to `main` and on pushes to `main`:

```text
pnpm install --frozen-lockfile
  ↓
pnpm exec vitest run
  ↓
pnpm type-check
  ↓
pnpm lint:check
  ↓
pnpm build-only
  ↓
pnpm build-storybook
```

The workflow has read-only repository permissions. Dependency install scripts are not allowed globally: `pnpm-workspace.yaml` explicitly approves only `esbuild`'s build script.

The Storybook accessibility addon is not part of CI; CI verifies that Storybook builds.

## Engineering workflow

```text
main
 ↓
short-lived feature / refactor branch
 ↓
implementation
 ↓
local quality gates
 ↓
pull request
 ↓
GitHub Actions
 ↓
squash merge
 ↓
branch cleanup
```

## Getting started

Requires Node.js `^22.18.0 || >=24.12.0` and pnpm.

```bash
git clone https://github.com/neubiii/neubii_ui.git
cd neubii_ui
pnpm install

pnpm dev          # local playground (src/App.vue)
pnpm storybook    # component workbench on port 6006
```

Quality gates (the same checks CI runs):

```bash
pnpm exec vitest run
pnpm type-check
pnpm lint:check
pnpm build-only
pnpm build-storybook
```

## Project structure

```text
neubii_ui/
├── .github/workflows/ci.yml
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── components/
│   │   ├── NuiButton/
│   │   ├── NuiInput/
│   │   ├── NuiSelect/
│   │   └── NuiTextarea/
│   ├── styles/
│   │   ├── base.css        # playground-only reset
│   │   └── tokens.css      # design tokens
│   ├── App.vue             # playground
│   ├── index.ts            # library entry point
│   └── main.ts
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
└── vitest.config.ts
```

## Engineering principles

- **Prefer native semantics.** Use the platform before recreating behavior with JavaScript or ARIA.
- **Keep public APIs intentional.** A prop must represent a real component state, not a CSS property.
- **Compose, don't couple.** Slots instead of icon props; native attributes instead of wrapper props.
- **Test behavior, not implementation.** Internal refactors shouldn't break tests.
- **Add abstractions when requirements justify them.** For example, a spacing value shared by a single component stays local until a second component needs it.
- **Stay independent of the host app.** Components must not rely on application resets or global styles.
- **Let TypeScript make supported states discoverable.** Variants, sizes and types are typed unions, not free strings.

## Roadmap

Current components: `NuiButton`, `NuiInput`, `NuiTextarea`, `NuiSelect`.

Likely next areas, in no fixed order:

- field composition (label, helper and error text around inputs)
- additional form controls
- library build and package distribution
- versioning and release workflow
- visual regression testing
- contribution documentation
