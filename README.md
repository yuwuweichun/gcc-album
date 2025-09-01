# GCC Album - 3D相册展示项目

![YouTube Thumbnail](https://github.com/user-attachments/assets/c6b6ea2e-2643-4d53-89b7-ee5b848de06d)

## 📖 项目简介

这是一个基于 **React Three Fiber (R3F)** 开发的3D相册展示项目，展示了精美的3D翻书效果和相册浏览体验。

## 🎯 项目由来

本项目基于 [wass08](https://github.com/wass08) 的 [r3f-animated-book-slider-final](https://github.com/wass08/r3f-animated-book-slider-final) 仓库进行开发和学习。

**原始项目信息：**
- [Video tutorial](https://youtu.be/b7a_Y1Ja6js)
- [Live demo](https://r3f-animated-book-slider-final.vercel.app/)
- [Starter code](https://github.com/wass08/r3f-animated-book-slider-starter)

## ✨ 主要功能特性

- 🎨 **3D翻书效果**: 使用Three.js骨骼动画实现真实的翻书体验
- 📱 **响应式设计**: 支持桌面端和移动端设备
- 🎵 **音效支持**: 翻页时播放翻书音效
- 🖼️ **图片展示**: 支持多张图片的相册展示
- 🎭 **动画效果**: 流畅的翻页动画和悬停效果
- 🌟 **光照系统**: 完整的3D光照和阴影系统

## 🛠️ 技术栈

- **前端框架**: React 18
- **3D图形库**: Three.js
- **React 3D**: React Three Fiber (R3F)
- **3D工具库**: @react-three/drei
- **状态管理**: Jotai
- **样式框架**: Tailwind CSS
- **构建工具**: Vite
- **动画库**: Maath (数学工具库)

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览构建结果
```bash
npm run preview
# 或
yarn preview
```

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── Book.jsx        # 3D书本组件（核心）
│   ├── Experience.jsx  # 3D场景体验组件
│   └── UI.jsx          # 用户界面组件
├── App.jsx             # 主应用组件
├── main.jsx            # 应用入口点
└── index.css           # 全局样式
```

## 🎮 使用说明

1. 点击页面底部的页码按钮可以跳转到指定页面
2. 鼠标悬停在书页上会显示高亮效果
3. 支持键盘和触摸操作
4. 翻页时会播放翻书音效

## 🔧 自定义配置

- 在 `src/components/UI.jsx` 中修改图片列表
- 在 `src/components/Book.jsx` 中调整翻页动画参数
- 在 `src/index.css` 中自定义样式和主题

## 📚 学习资源

- [React Three Fiber 官方文档](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js 官方文档](https://threejs.org/docs/)
- [Jotai 状态管理](https://jotai.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

感谢 [wass08](https://github.com/wass08) 提供的优秀原始项目，让我们能够学习和构建这个3D相册项目。
