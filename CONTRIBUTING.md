# Contributing to GO WITH US

This repository is currently in **Phase 0** (specifications). When application code lands, use this guide so product, design, and architecture stay aligned.

---

## 1. Before you write code

Read:
* `docs/PRODUCT.md` (especially non-negotiables)
* `docs/ROADMAP.md` (build the current phase only)
* The feature’s page spec and user flow

---

## 2. Scope discipline

Build discovery and itinerary planning. Do not add:
* Hotel or flight checkout
* Payments or marketplaces
* Social feeds or DMs
* AI as a required path for core flows

---

## 3. Engineering habits

* TypeScript strict; no `any`.
* Small components; pages stay orchestrators.
* Native `fetch` via `lib/api`; no Axios.
* Match fixture types to API contracts.
* Include loading, empty, and error UI.
* Confirm destructive actions (delete trip, delete account).

---

## 4. Design habits

* Use tokens from `docs/DESIGN_SYSTEM.md`.
* Respect Motion / GSAP / Lenis ownership in `docs/ANIMATION_GUIDELINES.md`.
* Keep photography sharp; no gimmicky image distortion.
* Write UI copy per `docs/CONTENT_GUIDELINES.md`.

---

## 5. Pull requests

* Describe the user-facing change and the phase it belongs to.
* Note fixture vs live API usage.
* Include screenshots or recordings for UI work.
* Call out any spec updates in the same PR.

---

## 6. Related documents

* `AGENTS.md`
* `docs/TESTING.md`
* `docs/SECURITY.md`
* `docs/PROJECT_STRUCTURE.md`
