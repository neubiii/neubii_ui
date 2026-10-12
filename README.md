# neubii_ui

A growing Vue 3 + TypeScript component system focused on typed component APIs, accessibility, design tokens, testing, documentation, and maintainable open-source engineering workflows.

[![CI](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml/badge.svg)](https://github.com/neubiii/neubii_ui/actions/workflows/ci.yml)

> This project is intentionally being built component by component. The goal is not to maximize component count, but to understand and document the engineering decisions behind a reusable UI system.

## Why this project exists

`neubii_ui` is a hands-on exploration of the space between frontend engineering and design systems.

Rather than treating components as isolated pieces of UI, the project focuses on the systems around them:

- predictable and typed public APIs
- reusable design tokens
- native HTML semantics and accessibility
- isolated component documentation
- meaningful unit tests
- automated code-quality checks
- feature-branch and pull-request workflows
- reproducible CI

The library is deliberately kept small while the foundations are being developed. New abstractions are introduced only when an actual component requirement justifies them.

## Current component

### `NuiButton`

The first reusable component establishes the conventions future components will follow.

```vue
<NuiButton variant="primary" size="md">
  Save changes
</NuiButton>
```

Current API includes:

- `primary`, `secondary`, and `ghost` variants
- `sm`, `md`, and `lg` sizes
- typed native `button`, `submit`, and `reset` types
- native disabled behavior
- typed click events
- slot-based content
- explicit keyboard focus styling
- public TypeScript types

Its implementation, tests, Storybook stories, types, and exports are colocated so the component can be understood as one unit.

## Design-system architecture

Visual decisions are separated from component implementation through CSS custom properties.

```text
raw value
   ↓
primitive token
   ↓
semantic token
   ↓
component
```

For example:

```text
#1f2937
   ↓
--nui-color-gray-800
   ↓
--nui-color-action-primary-bg
   ↓
NuiButton
```

Components consume semantic meaning rather than owning raw visual values. Consumers can therefore override the design-system variables without changing component source code.

The token system is intentionally small. New tokens are added when repeated component requirements prove that they belong in the shared system.

## Component structure

Each component owns the files needed to understand, document, verify, and expose it.

```text
src/components/NuiButton/
├── __tests__/
│   └── NuiButton.test.ts
├── NuiButton.vue
├── NuiButton.types.ts
├── NuiButton.stories.ts
└── index.ts
```

This separates responsibilities clearly:

```text
.vue         → component implementation
.types.ts    → public TypeScript contract
.stories.ts  → interactive documentation and states
__tests__/   → behavioral verification
index.ts     → public component exports
```

## Storybook

Storybook is used as the component-development and documentation environment.

It provides isolated views of component variants and states, interactive Controls generated from the typed API, Autodocs, and automated accessibility analysis.

```bash
pnpm storybook
```

Production Storybook builds can be verified with:

```bash
pnpm build-storybook
```

The Storybook environment loads the design-system tokens without importing application-level reset styles. This helps expose accidental dependencies between reusable components and their host application.

## Testing and quality

The project currently uses:

- Vitest
- Vue Test Utils
- TypeScript / `vue-tsc`
- ESLint
- oxlint
- Storybook accessibility checks

Unit tests focus on observable component behavior rather than implementation details.

For `NuiButton`, tests currently verify slot rendering, defaults, variants and sizes, native button types, typed click events, and disabled behavior.

Run the main checks locally with:

```bash
pnpm exec vitest run
pnpm type-check
pnpm lint:check
pnpm build-only
pnpm build-storybook
```

## Continuous integration

GitHub Actions runs the same quality gates on pull requests and on `main`.

The CI pipeline verifies:

```text
frozen dependency install
        ↓
unit tests
        ↓
TypeScript
        ↓
check-only linting
        ↓
application build
        ↓
Storybook build
```

Dependency installation uses pnpm's build-script approval mechanism rather than globally allowing dependency lifecycle scripts.

## Engineering workflow

Development happens on short-lived feature or fix branches.

```text
main
  ↓
feature branch
  ↓
implementation
  ↓
local quality checks
  ↓
pull request
  ↓
GitHub Actions
  ↓
squash merge
  ↓
main
```

Branches are deleted after merge. The branch represents a unit of work, not permanent ownership of a component.

## Technology

- Vue 3
- Composition API and `<script setup>`
- TypeScript
- Vite
- pnpm
- CSS custom properties
- Storybook
- Vitest
- Vue Test Utils
- ESLint
- oxlint
- GitHub Actions

## Project structure

```text
neubii_ui/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .storybook/
├── src/
│   ├── components/
│   │   └── NuiButton/
│   ├── styles/
│   │   ├── base.css
│   │   └── tokens.css
│   ├── App.vue
│   ├── index.ts
│   └── main.ts
├── package.json
├── pnpm-lock.yaml
└── vite.config.ts
```

## Local development

Clone the repository and install dependencies:

```bash
git clone https://github.com/neubiii/neubii_ui.git
cd neubii_ui
pnpm install
```

Run the local Vue playground:

```bash
pnpm dev
```

Run Storybook:

```bash
pnpm storybook
```

## Current status

The project is in active foundation development and is not yet published as a stable npm package.

The current focus is establishing strong component conventions before expanding the library.

Next areas of work include form controls, richer interactive components, further accessibility patterns, package distribution, versioning, and contribution documentation.

## Engineering principles

**Prefer native semantics.** Use the platform before recreating behavior with JavaScript or ARIA.

**Keep APIs intentional.** Props should represent meaningful component behavior rather than exposing every CSS property.

**Design for composition.** Slots and native attributes should remain useful escape hatches where appropriate.

**Make invalid states difficult.** TypeScript should help consumers discover and use the supported API correctly.

**Test behavior, not implementation.** Refactoring internal code should not unnecessarily break tests.

**Add abstractions when evidence justifies them.** A smaller architecture that is understood is preferable to a large architecture built for hypothetical requirements.

**Keep components independent from application assumptions.** Reusable components should not secretly rely on playground resets or host application styling.

---

`neubii_ui` is an ongoing project. Components and architecture will evolve as new requirements expose where the current system works well and where it needs to change.
