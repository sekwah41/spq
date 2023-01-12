# Changelog

## [2.1.0](https://github.com/sekwah41/spq/compare/v2.0.3...v2.1.0) (2023-01-12)


### Bug Fixes 🐛

* made QueuedTask private to reduce confusion ([85cc895](https://github.com/sekwah41/spq/commit/85cc895589aa2bf7a1eaefc21ef5332f62874dfc))


### Features ✨

* support adding async into the queue ([9c380b0](https://github.com/sekwah41/spq/commit/9c380b0ea81ccb813a4ccf8f724c1e24368bb9d1))

## [2.0.3](https://github.com/sekwah41/spq/compare/v2.0.2...v2.0.3) (2023-01-11)


### Bug Fixes 🐛

* typescript issue with building ([2e11d2f](https://github.com/sekwah41/spq/commit/2e11d2f34785d48623eec3293dfdc8f5ad52ac51))

## [2.0.2](https://github.com/sekwah41/spq/compare/v2.0.1...v2.0.2) (2023-01-11)


### Bug Fixes 🐛

* bump typescript version ([c4cd7b9](https://github.com/sekwah41/spq/commit/c4cd7b96ab0699f503a9f33b4d22d0476e8816ff))

## [2.0.1](https://github.com/sekwah41/spq/compare/v2.0.0...v2.0.1) (2023-01-11)


### Bug Fixes 🐛

* update example ([6ad14f8](https://github.com/sekwah41/spq/commit/6ad14f8e73ffed69b25c1a5fea56aad5dd31063e))
* updated release ([5da05bc](https://github.com/sekwah41/spq/commit/5da05bc79bdd2decac5422a4a8c377ff8cb91af3))

## v2.0.0 (Fri Oct 22 2021)

#### 💥 Breaking Change

- feat: Add default export [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))
- chore(ci): Update how envs are passed into tasks [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))
- refactor: Update project structure [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))
- docs: Rewrite readme [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))
- chore(ci): Setting up auto [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))
- feat: Re-written as typescript and added promise functions [#22](https://github.com/sekwah41/spq/pull/22) ([@sekwah41](https://github.com/sekwah41))

#### Authors: 1

- Sekwah ([@sekwah41](https://github.com/sekwah41))

---

## 1.5.0

- Added `finished` event

## 1.3.3

Undefined values were being returned from the promise handling bug that was fixed last update. Now the module is 100% working as it should but there is 1 piece of code I would like to change back if I can find why it thought catches were not being handled despite firing code.

## 1.0.0

Initial release of the project
