## [1.2.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.1...1.2.2) (2025-07-17)


### ✨ Features

* Added quick configuration modal and related fuzzy search components (#21) ([320f959](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/320f959f77a869fbb804abdb2636c59b496c74f6)), closes [#21](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/21)



## [1.2.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.0...1.2.1) (2025-07-16)


### ✨ Features

* Added settings view and optimized code embedding initialization logic (#20) ([c049ad6](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/c049ad60f9ac017646733a2c03e1d184e4b05fd8)), closes [#20](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/20)



# [1.2.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.3...1.2.0) (2025-06-22)


### ♻️ Refactor

* Moved FontData type and global declarations to global interface file ([9a3a04b](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/9a3a04b6aa34d88977553813400b74c37033fee6))


### ✨ Features

* Added editor instance retrieval and auto-save functionality for content changes ([b319713](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/b3197135dd5002c3c384bd7c0a92313d48de1e35))
* Optimized code editor view registration and settings validation logic ([64a9c6e](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/64a9c6e3626ae00c5d6fa18082f1e2581d76ccdc))
* Optimized system font loading with multi-platform font detection support ([d044492](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/d04449236b08f6ac36268e61cdf5d3d1814aa52f))


### 🐛 Bug Fixes

* Fixed Ace editor undo management ([8dbf60a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/8dbf60ac249aa8bbb4ba60fa105ec9be8652d1a2))
* Fixed Ace editor keyboard handler configuration logic ([3b8237a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3b8237a200aafa1ea7e8593c4db8ca8a2214039e))


## [1.1.3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.2...1.1.3) (2025-06-17)


### 🐛 Bug Fixes

* Set isDesktopOnly to false to support mobile devices ([1b8eade](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/1b8eade6477790bd0b186285a46510175ba2d99e))



## [1.1.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.1...1.1.2) (2025-06-16)


### 🐛 Bug Fixes

* Fixed customCss API interface ([4077cea](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/4077cea6a59d4a03e7f2a396eb8fae3680367d25))



## [1.1.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.0...1.1.1) (2025-06-16)


### ✨ Features

* Added documentation links and style adjustments to settings page ([3d4f642](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3d4f642531ba4e4a10519155ace3f7abe6da17be))



# [1.1.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.3...1.1.0) (2025-06-16)


### ✨ Features

* Enhanced plugin and custom CSS interfaces, optimized code structure ([5dc03b9](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/5dc03b9299533e43f1c764466179457b358437c1))
* Added code embedding view support and extension registration mechanism ([739b837](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/739b837ed0ec356609cb69c8fa43a685e758d18f))


### 🐛 Bug Fixes

* **i18n:** Fixed default language setting logic ([ec6c9a1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/ec6c9a187f1cefc09c7d45bda9006c8790983117))

### ♻️ Refactor

* Refactored code embedding view component using React ([03f7ed3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/03f7ed33b0f51683f9faf773524b2acc70d7b199))
* **AceLanguages:** Removed hardcoded workerBaseUrl constant ([7bea1be](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7bea1be8b244fdf772e5f7c24159347af95bcd5d))

## [1.0.3-beta.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.3...1.0.3-beta.1) (2025-06-12)


### ♻️ Refactor

* Refactored code embedding view component using React ([03f7ed3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/03f7ed33b0f51683f9faf773524b2acc70d7b199))
* **AceLanguages:** Removed hardcoded workerBaseUrl constant ([7bea1be](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7bea1be8b244fdf772e5f7c24159347af95bcd5d))


### ✨ Features

* Added code embedding view support and extension registration mechanism ([739b837](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/739b837ed0ec356609cb69c8fa43a685e758d18f))



## [1.0.3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.2...1.0.3) (2025-06-07)


### ♻️ Refactor

* Optimized Ace editor module loading using esm-resolver ([7e8506d](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7e8506d54cdf2cd584f545f5695e331e6bf1611f))
* Enhanced file content processing logic for better code readability ([122b9a8](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/122b9a8d3259eef9daf5a113dfd1133bb015d6ca))



## [1.0.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.1...1.0.2) (2025-05-29)


### ♻️ Refactor

* Refactored settings interface (#3) ([0dd21cd](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/0dd21cd7ad94198a1f33125f09ba1b8aac8d6338)), closes [#3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/3)


### 🐛 Bug Fixes

* Plugin marketplace review (#4) ([989c53b](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/989c53bdd1439df95f76aea8a5b03e64d1a69401)), closes [#4](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/4)



## [1.0.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.0...1.0.1) (2025-05-06)


### ♻️ Refactor

* Optimized icon selector component, improving code simplicity and performance ([3f3aa01](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3f3aa0157c71a2a8a5fc48c49719da67858a2e99))


### ✨ Features

* Enhanced code editor settings interface with system font selection support ([efc2869](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/efc2869fe4e7c8b10c2c7669b2b50f713b4d3b8e))
* Optimized system font loading logic, improved font deduplication and sorting ([62d9dae](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/62d9dae87408697a31d0e33af440e559e4f04c28))


### 🐛 Bug Fixes

* **i18n:** Standardized capitalization format in English translations ([2044f7a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/2044f7ad7690234a2bd1a8288a63efbde24026e3))



# [1.0.0](https://github.com/Moyf/yearly-glance/compare/11350fe43290c2ff7ed1b2c3a31c823075f25934...1.0.0) (2025-05-04)


### ✨ Features

* Split and transplanted from the obsidian-ravenhogwarts-toolkit plugin (#1) ([fbbd582](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/fbbd582ce477b1361f7caea851188370f978ca54)), closes [#1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/1)



