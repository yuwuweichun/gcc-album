// 导入React核心库 - React是用于构建用户界面的JavaScript库
import React from 'react'
// 导入ReactDOM - 这是React的DOM渲染器，用于将React组件渲染到HTML DOM中
import ReactDOM from 'react-dom/client'
// 导入主应用组件App - 这是我们应用的主要组件
import App from './App'
// 导入全局样式文件 - 包含Tailwind CSS和自定义样式
import './index.css'

// 使用ReactDOM.createRoot创建React 18的根容器
// document.getElementById('root')获取HTML中id为'root'的元素作为渲染目标
// 这通常是index.html中的<div id="root"></div>元素
const root = ReactDOM.createRoot(document.getElementById('root'))

// 调用render方法将App组件渲染到根容器中
// React.StrictMode是一个开发模式包装器，用于：
// 1. 识别不安全的生命周期方法
// 2. 关于过时API用法的警告
// 3. 检测意外的副作用
// 4. 检测过时的context API
root.render(
  <React.StrictMode>
    {/* 渲染主应用组件 */}
    <App />
  </React.StrictMode>,
)
