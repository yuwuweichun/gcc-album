// 导入@react-three/drei中的3D组件和工具
// Environment: 提供环境光照和反射
// Float: 为3D对象添加浮动动画效果
// OrbitControls: 提供鼠标/触摸控制，允许用户旋转、缩放和平移3D场景
import { Environment, Float, OrbitControls } from "@react-three/drei";
// 导入自定义的Book组件 - 这是3D书本的核心组件
import { Book } from "./Book";

// Experience组件 - 负责构建整个3D场景环境
export const Experience = () => {
  return (
    // React Fragment - 包装多个3D元素
    <>
      {/* Float组件 - 为书本添加浮动动画效果 */}
      <Float
        // 初始旋转：绕x轴旋转-45度(-Math.PI/4)，让书本稍微倾斜
        rotation-x={-Math.PI / 4}
        // 浮动强度：控制上下浮动的幅度
        floatIntensity={1}
        // 浮动速度：控制浮动的频率
        speed={2}
        // 旋转强度：控制旋转的幅度
        rotationIntensity={2}
      >
        {/* Book组件 - 3D书本的主要组件 */}
        <Book />
      </Float>

      {/* OrbitControls - 提供用户交互控制 */}
      {/* 允许用户：
          - 左键拖拽：旋转视角
          - 右键拖拽：平移视角  
          - 滚轮：缩放视角 */}
      <OrbitControls />

      {/* Environment组件 - 设置环境光照和反射 */}
      {/* preset="studio" 使用工作室预设，提供柔和的环境光照 */}
      <Environment preset="studio"></Environment>

      {/* 方向光源 - 模拟太阳光或主要光源 */}
      <directionalLight
        // 光源位置：x=2(右侧)，y=5(上方)，z=2(前方)
        position={[2, 5, 2]}
        // 光照强度：2.5提供明亮的光照
        intensity={2.5}
        // 启用阴影投射
        castShadow
        // 阴影贴图尺寸：2048x2048提供高质量的阴影
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        // 阴影偏移：-0.0001防止阴影出现"阴影痤疮"现象
        shadow-bias={-0.0001}
      />

      {/* 地面平面 - 用于接收阴影，增强3D效果 */}
      <mesh 
        // 位置：y=-1.5，位于场景下方
        position-y={-1.5} 
        // 旋转：绕x轴旋转-90度，使平面水平放置
        rotation-x={-Math.PI / 2} 
        // 启用阴影接收
        receiveShadow
      >
        {/* 平面几何体：宽度100，高度100，覆盖整个场景 */}
        <planeGeometry args={[100, 100]} />
        {/* 阴影材质：半透明黑色，用于显示阴影 */}
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
