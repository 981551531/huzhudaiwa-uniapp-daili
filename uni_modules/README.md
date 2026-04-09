# uni_modules

此目录用于存放通过 HBuilderX 插件市场导入的插件。

## 安装 uview-plus

### 方式一：HBuilderX 插件市场导入（推荐）

1. 访问 [uview-plus 插件市场页面](https://ext.dcloud.net.cn/plugin?id=8744)
2. 点击「使用 HBuilderX 导入插件」
3. 选择当前项目，确认导入
4. 导入后会自动在 `uni_modules/uview-plus` 目录下生成组件文件

### 方式二：npm 安装后复制

如果使用 npm 安装了 uview-plus，也可以将 `node_modules/uview-plus` 复制到此目录。

## 注意事项

- 此目录下的插件会被 uni-app 自动识别和加载
- 请勿手动修改插件内部代码，更新时会被覆盖
- 如需自定义，请在项目中覆盖对应组件
