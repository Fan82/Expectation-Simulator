# Expectation Simulator v3.0 | Product Architecture & Complete Development Plan

Expectation Simulator is a Web App designed to support both **quick daily adjustments** and **in-depth scenario simulations**, with PWA installation capabilities and AI-powered reflection features planned for later stages.

The development roadmap consists of **8 phases and 48 development units**. By Unit 24, the first fully usable version should be ready. Unit 48 marks the final product delivery and acceptance testing.

## Product Positioning

Expectation Simulator is not about tracking how much you accomplish each day.

Its core purpose is to help users **explore alternative possibilities and adjust their plans when reality doesn't match their original expectations.**

## Two Core Modes

- **Quick Check:** A 1–3 minute experience for making quick adjustments to daily plans.
- **Scenario Lab:** A 10–20 minute experience for exploring and comparing scenarios over multiple weeks.

## Development Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server without type checking |
| `npm run typecheck` | Run TypeScript type checking only |
| `npm run build` | Run type checking and build the application into `dist/` |
| `npm run preview` | Preview the production build locally |

## Architecture & Layer Responsibilities

The application follows a layered architecture with clear separation of responsibilities.

- **`src/domain` and `src/simulation`:** Pure TypeScript logic with no dependencies on browser APIs or AI services.
- **`src/application`:** Application state management.
- **`src/features` and `src/ui`:** Feature-specific interfaces and reusable UI components.

## Design Principles

- **Calm and spacious:** Use generous whitespace and a thoughtful visual hierarchy to help users feel that they have options rather than that they are falling behind.
- **Non-judgmental feedback:** Never use red to indicate unmet expectations or incomplete goals.
- **Accessible by default:** Prioritize mobile-first design, keyboard accessibility, and support for `prefers-reduced-motion`.
- **Deterministic calculations:** All numerical results must be calculated by application logic. AI is responsible only for interpreting and explaining those results.
- **No performance pressure:** Avoid failure labels, streak counters, or other mechanisms that encourage guilt or unnecessary pressure.