// 导入@react-three/drei中的Loader组件 - 用于显示3D资源加载进度
import { Loader } from "@react-three/drei";
// 导入@react-three/fiber中的Canvas组件 - 这是React Three Fiber的核心组件，用于创建3D渲染画布
import { Canvas } from "@react-three/fiber";
// 导入React的Suspense组件 - 用于处理异步组件的加载状态
import { Suspense } from "react";
// 导入自定义的Experience组件 - 包含3D场景的主要内容和逻辑
import { Experience } from "./components/Experience";
// 导入自定义的UI组件 - 包含用户界面元素，如导航按钮等
import { UI } from "./components/UI";

// 主应用组件App - 这是整个应用的根组件
function App() {
  return (
    // React Fragment - 用于包装多个元素而不创建额外的DOM节点
    <>
      {/* UI组件 - 显示在3D场景上层的用户界面 */}
      <UI />
      
      {/* Loader组件 - 显示3D模型和纹理的加载进度 */}
      <Loader />
      
      {/* Canvas组件 - 创建3D渲染画布，这是React Three Fiber的核心 */}
      <Canvas 
        // 启用阴影渲染
        shadows 
        // 配置相机参数
        camera={{
          // 相机位置：x轴偏移-0.5，y轴高度1，z轴距离根据屏幕宽度动态调整
          // 移动端使用更大的z值(9)，桌面端使用较小的z值(4)
          position: [-0.5, 1, window.innerWidth > 800 ? 4 : 9],
          // 视野角度(FOV) - 45度提供自然的视角
          fov: 45,
        }}
      >
        {/* 创建一个组(group)来包装所有3D对象，y轴位置为0 */}
        <group position-y={0}>
          {/* Suspense包装器 - 处理异步加载的3D组件 */}
          <Suspense fallback={null}>
            {/* Experience组件 - 包含3D场景的主要内容(书本、光照、环境等) */}
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </>
  );
}

// 导出App组件供其他文件使用
export default App;
