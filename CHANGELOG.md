# [1.4.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.3.2...1.4.0) (2025-12-20)


### ♻️ Refactor

* React hooks 简化组件和钩子导入 (#73) ([f2cc467](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/f2cc467fd47da0857b4c7d9c5579b8e8573a956e)), closes [#73](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/73)
* **settings:** 简化 AceSettings 组件接口与状态管理 (#58) ([4ad2e43](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/4ad2e4329405cb45c3ddefd0240247b32803f0fd)), closes [#58](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/58)


### ✨ Features

* 将模态框改为显式传参并移除 useModal (#57) ([c5badd2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/c5badd27c6cdd141c762ff99d3f95ce9630f88e3)), closes [#57](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/57)
* 优化 CSS 代码片段管理器 (#71) ([cd78217](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/cd782174761f89f6657cd5115e3513c375a93344)), closes [#71](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/71)
* 增加 minimap (#64) ([0c98223](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/0c98223764890be9a3b8add1c81e4b2baa689d04)), closes [#64](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/64)
* 重构 Ace 编辑器配置为选项生成器 (#62) ([24672ec](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/24672ecf93042ce27882cc5d02985fd14d1b3922)), closes [#62](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/62)
* **minimap:** 固定滑块高度并完善悬停和拖拽交互 (#65) ([a73195e](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/a73195e36ee350fe44794cf324512a1ce3afeee9)), closes [#65](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/65)
* **minimap:** 为小地图添加渲染与交互改进 (#70) ([a13e519](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/a13e51944295210997a6ae02a5ebea15f9b47ad9)), closes [#70](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/70)
* **modal:** 点击遮罩关闭并添加容器类 (#72) ([5347785](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/53477852deeef1fb7f4863f3969450d59ed2b371)), closes [#72](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/72)
* **settings:** 为设置页添加图标（ob 1.11.0） (#66) ([146a7e9](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/146a7e91a8edba032120deb02ddbdd7f3ec116e6)), closes [#66](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/66)


### 🐛 Bug Fixes

* 正确移除文件名中的 .css 扩展名 (#56) ([f5cbde2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/f5cbde2dd2f062c05086fd1f989d325a6c2611c9)), closes [#56](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/56)
* **icon-picker:** 移除多余的父类渲染调用 (#68) ([a66a8aa](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/a66a8aac74ddca92d143e88bbba8c4ba0fd783ce)), closes [#68](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/68)


### 📝 Documentation

* 更新资助链接为 afdian (#59) ([4ae8448](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/4ae8448387b32ed53d04d023cca451c83770c3ce)), closes [#59](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/59)


### 🔨 Chore

* **deps:** 升级多项依赖以保持兼容性并修复问题 (#67) ([e086f54](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/e086f5462b3f6801f2a0cfa185b5a23b5c86ef47)), closes [#67](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/67)
* **deps:** 升级若干依赖以修复问题并保持兼容 (#63) ([fe23bd0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/fe23bd059bec98139cae592afa968d5f254bf6ff)), closes [#63](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/63)
* **eslint:** 添加 ESLint 配置并升级依赖 ([d3d2c56](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/d3d2c56aa5c2798b327ee8c9d750addf506378e9))
* **funding:** 添加自定义赞助链接 (#60) ([cfc7523](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/cfc7523c74f4c269742ec6c8f24d52f645825bda)), closes [#60](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/60)
* **license:** 切换许可证为 GPL-3.0-only (#69) ([2d3f0da](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/2d3f0da7554f4e1f8e3aa7613e7a3bdd149b17d0)), closes [#69](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/69)



## [1.3.2](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.3.1...1.3.2) (2025-10-29)


### ♻️ Refactor

* 调整项目结构 ([1492293](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/1492293f315b0c4fd4ddde9faa22b7dd5767a95e))


### ✨ Features

* 统一使用路径别名将工程中的相对/相对路径导入改统一的路径别名 (#45) ([27ed130](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/27ed1308998805d28da1a91ad5f61d46891b0f6d)), closes [#45](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/45)
* 引入存储与订阅机制 (#44) ([8127563](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/81275639ba7d4e02d8133ac4a2f51a6459ffc71e)), closes [#44](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/44)
* 在编辑器设置中添加自动换行支持 (#43) ([621413d](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/621413d05baca7fedbe56fc16450e62d03244d12)), closes [#43](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/43)


### 🎨 Styles

* 引入 AceView 样式并限制编辑器溢出 (#42) ([6d3aa9c](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/6d3aa9ce1cbb1d6bbe8b482603308871ce94ee25)), closes [#42](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/42)


### 🐛 Bug Fixes

* unknown properties ([3d04cfc](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/3d04cfcd7802a5d14ea4c667c1a8c06e4add08d8))


### 🔧 CI

* 移除工作流中的 lint 检查和输出 (#49) ([0994b73](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/0994b73ca71f430b1acdbe64cc52ab74cd4c08de)), closes [#49](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/49)
* remove artifact upload and comment footer (#50) ([1b4412f](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/1b4412fb2d1a146750b17bca8105ce9fd8fdc475)), closes [#50](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/50)
* update workflows and add precheck (#47) ([b656340](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/b65634080ec8a58513d2bc68cc0827fe364dda8b)), closes [#47](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/47)


### 🔨 Chore

* 优化构建脚本 (#41) ([29b544e](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/29b544ee67f53df7e855863a95f79b70ad5e530c)), closes [#41](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/41)
* bump version 1.3.2 (#46) ([c7474c0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/c7474c0fbae80cd864db3bf5c80d6bf7949dc2f1)), closes [#46](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/46)



## [1.3.1](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.3.0...1.3.1) (2025-08-14)


### ♻️ Refactor

* 优化重构项目结构 (#37) ([2167a83](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/2167a83df0ee253ec5dc7ae8ed96c627137c2518)), closes [#37](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/37)


### ✨ Features

* 增加快捷键 Alt + P 打开obsidian命令面板 (#38) ([8f0834d](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/8f0834d2b536bfe4c6aa0c8d78cbb35a6c392702)), closes [#38](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/38)


### 🐛 Bug Fixes

* 嵌入视图未正确设置成只读模式 (#36) ([cf006c3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/cf006c351c723dc9f453deca4e595ec2bb458aad)), closes [#36](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/36)



# [1.3.0](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.3...1.3.0) (2025-08-13)


### ♻️ Refactor

* 对设置页面进行优化 (#34) ([ed5ea9f](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/ed5ea9f1488ec38c6d1d1704687874f983544d73)), closes [#34](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/34)


### ✨ Features

* 为双链添加引用代码块行号功能 (#33) ([450fd8d](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/450fd8dd7afdb609f3b20ae2059bc35bd7b6bb4e)), closes [#33](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/33) [#L10](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/L10) [#L10-L20](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/L10-L20) [file.js#L10-L20](https://github.com/file.js/issues/L10-L20) [#L10](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/L10) [#L10-L20](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/L10-L20)



## [1.2.3](https://github.com/RavenHogWarts/obsidian-ace-code-editor/compare/1.2.2...1.2.3) (2025-08-12)


### ✨ Features

* 增加配置项，优化设置界面布局 (#28) ([a5c58f9](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/a5c58f9eece8cca1897f5cdfd13640a5e9fa5cf8)), closes [#28](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/28)
* **editor:** 支持通过滚轮与接口调整编辑器字体大小 (#27) ([68dd5fd](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/68dd5fdfc68158167b8fad1e3f9dc18bbee9ae2e)), closes [#27](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/27)


### 🐛 Bug Fixes

* **i18n:** 修正语言设置逻辑，确保默认语言为英文 (#24) ([cb31f32](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/cb31f32af9b9cf246246994382dd69bd253c9954)), closes [#24](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/24)


### 📝 Documentation

* 添加最新版下载量徽章显示下载统计信息 (#22) ([556365f](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/556365f40f948357b24e40541ae9ea0511cbf8ef)), closes [#22](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/22)


### 🔧 CI

* 更新贡献和发版流程 (#29) ([358da40](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commit/358da40a8d034a2f6f31f80656ffa6bc9571f69f)), closes [#29](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues/29)



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



