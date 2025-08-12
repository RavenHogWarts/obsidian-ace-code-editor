## [1.2.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.1...1.2.2) (2025-07-17)


### ✨ 新功能

* 新增快速配置模态框及相关模糊搜索组件 (#21) ([320f959](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/320f959f77a869fbb804abdb2636c59b496c74f6)), closes [#21](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/21)



## [1.2.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.0...1.2.1) (2025-07-16)


### ✨ 新功能

* 新增设置视图并优化代码嵌入初始化逻辑 (#20) ([c049ad6](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/c049ad60f9ac017646733a2c03e1d184e4b05fd8)), closes [#20](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/20)



# [1.2.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.3...1.2.0) (2025-06-22)


### ♻️ 重构

* 将 FontData 类型和全局声明移至全局接口文件 ([9a3a04b](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/9a3a04b6aa34d88977553813400b74c37033fee6))


### ✨ 新功能

* 添加编辑器实例获取及内容变化自动保存功能 ([b319713](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/b3197135dd5002c3c384bd7c0a92313d48de1e35))
* 优化代码编辑器视图注册及设置校验逻辑 ([64a9c6e](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/64a9c6e3626ae00c5d6fa18082f1e2581d76ccdc))
* 优化系统字体加载，支持多平台字体检测 ([d044492](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/d04449236b08f6ac36268e61cdf5d3d1814aa52f))


### 🐛 修复

* 修复 Ace 编辑器撤销管理 ([8dbf60a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/8dbf60ac249aa8bbb4ba60fa105ec9be8652d1a2))
* 修复 Ace 编辑器键盘处理器配置逻辑 ([3b8237a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3b8237a200aafa1ea7e8593c4db8ca8a2214039e))



## [1.1.3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.2...1.1.3) (2025-06-17)


### 🐛 修复

* 将 isDesktopOnly 设置为 false 以支持移动端 ([1b8eade](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/1b8eade6477790bd0b186285a46510175ba2d99e))



## [1.1.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.1...1.1.2) (2025-06-16)


### 🐛 修复

* 修正 customCss api 接口 ([4077cea](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/4077cea6a59d4a03e7f2a396eb8fae3680367d25))



## [1.1.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.1.0...1.1.1) (2025-06-16)


### ✨ 新功能

* 添加设置页面文档链接和样式调整 ([3d4f642](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3d4f642531ba4e4a10519155ace3f7abe6da17be))



# [1.1.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.3...1.1.0) (2025-06-16)


### ✨ 新功能

* 增强插件和自定义CSS接口，优化代码结构 ([5dc03b9](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/5dc03b9299533e43f1c764466179457b358437c1))
* 新增代码嵌入视图支持及扩展注册机制 ([739b837](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/739b837ed0ec356609cb69c8fa43a685e758d18f))


### 🐛 修复

* **i18n:** 修正默认语言设置逻辑 ([ec6c9a1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/ec6c9a187f1cefc09c7d45bda9006c8790983117))

### ♻️ 重构

* 使用 React 重构代码嵌入视图组件 ([03f7ed3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/03f7ed33b0f51683f9faf773524b2acc70d7b199))
* **AceLanguages:** 移除硬编码的workerBaseUrl常量 ([7bea1be](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7bea1be8b244fdf772e5f7c24159347af95bcd5d))


## [1.0.3-beta.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.3...1.0.3-beta.1) (2025-06-12)


### ♻️ 重构

* 使用 React 重构代码嵌入视图组件 ([03f7ed3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/03f7ed33b0f51683f9faf773524b2acc70d7b199))
* **AceLanguages:** 移除硬编码的workerBaseUrl常量 ([7bea1be](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7bea1be8b244fdf772e5f7c24159347af95bcd5d))


### ✨ 新功能

* 新增代码嵌入视图支持及扩展注册机制 ([739b837](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/739b837ed0ec356609cb69c8fa43a685e758d18f))



## [1.0.3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.2...1.0.3) (2025-06-07)


### ♻️ 重构

* 使用 esm-resolver 优化 Ace 编辑器模块加载 ([7e8506d](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/7e8506d54cdf2cd584f545f5695e331e6bf1611f))
* 优化文件内容处理逻辑，提升代码可读性 ([122b9a8](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/122b9a8d3259eef9daf5a113dfd1133bb015d6ca))



## [1.0.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.1...1.0.2) (2025-05-29)


### ♻️ 重构

* 重构设置界面 (#3) ([0dd21cd](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/0dd21cd7ad94198a1f33125f09ba1b8aac8d6338)), closes [#3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/3)


### 🐛 修复

* 插件上架审核 (#4) ([989c53b](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/989c53bdd1439df95f76aea8a5b03e64d1a69401)), closes [#4](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/4)



## [1.0.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.0.0...1.0.1) (2025-05-06)


### ♻️ 重构

* 优化图标选择器组件，提升代码简洁性和性能 ([3f3aa01](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3f3aa0157c71a2a8a5fc48c49719da67858a2e99))


### ✨ 新功能

* 优化代码编辑器设置界面，支持系统字体选择 ([efc2869](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/efc2869fe4e7c8b10c2c7669b2b50f713b4d3b8e))
* 优化系统字体加载逻辑，提升字体去重和排序 ([62d9dae](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/62d9dae87408697a31d0e33af440e559e4f04c28))


### 🐛 修复

* **i18n:** 统一英文翻译中的大小写格式 ([2044f7a](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/2044f7ad7690234a2bd1a8288a63efbde24026e3))



# [1.0.0](https://github.com/Moyf/yearly-glance/compare/11350fe43290c2ff7ed1b2c3a31c823075f25934...1.0.0) (2025-05-04)


### ✨ 新功能

* 从 obsidian-ravenhogwarts-toolkit 插件中拆分移植 (#1) ([fbbd582](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/fbbd582ce477b1361f7caea851188370f978ca54)), closes [#1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/1)



