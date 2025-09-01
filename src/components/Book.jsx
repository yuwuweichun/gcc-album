// 导入@react-three/drei中的工具函数
// useCursor: 用于改变鼠标指针样式，提供交互反馈
// useTexture: 用于加载和管理3D纹理(图片)
import { useCursor, useTexture } from "@react-three/drei";
// 导入@react-three/fiber中的useFrame钩子 - 用于在每一帧执行动画逻辑
import { useFrame } from "@react-three/fiber";
// 导入Jotai状态管理 - 用于管理页码状态
import { useAtom } from "jotai";
// 导入maath库的easing函数 - 提供平滑的动画缓动效果
import { easing } from "maath";
// 导入React的钩子函数
// useEffect: 处理副作用，如设置定时器
// useMemo: 缓存计算结果，避免重复计算
// useRef: 创建可变的引用对象
// useState: 管理组件内部状态
import { useEffect, useMemo, useRef, useState } from "react";
// 导入Three.js的核心类和工具
import {
  Bone,                    // 骨骼类 - 用于骨骼动画系统
  BoxGeometry,             // 盒子几何体 - 用于创建书页的3D形状
  Color,                   // 颜色类 - 用于定义材质颜色
  Float32BufferAttribute,  // 32位浮点数缓冲区属性 - 用于存储顶点数据
  MathUtils,               // 数学工具类 - 提供数学计算函数
  MeshStandardMaterial,    // 标准材质 - 提供真实的物理光照效果
  Skeleton,                // 骨骼类 - 管理骨骼层次结构
  SkinnedMesh,             // 蒙皮网格 - 支持骨骼动画的3D模型
  SRGBColorSpace,          // sRGB颜色空间 - 确保颜色显示正确
  Uint16BufferAttribute,   // 16位无符号整数缓冲区属性 - 用于存储索引数据
  Vector3,                 // 3D向量类 - 表示3D空间中的点或方向
} from "three";
// 导入Three.js的数学工具函数 - 角度转弧度
import { degToRad } from "three/src/math/MathUtils.js";
// 导入UI组件中定义的状态和配置
import { pageAtom, pages } from "./UI";

// ==================== 动画参数配置 ====================
// 缓动因子：控制翻页动画的速度，值越小动画越慢
const easingFactor = 0.5;
// 折叠缓动因子：控制书页折叠动画的速度
const easingFactorFold = 0.3;
// 内侧曲线强度：控制书页内侧弯曲的程度
const insideCurveStrength = 0.18;
// 外侧曲线强度：控制书页外侧弯曲的程度
const outsideCurveStrength = 0.05;
// 翻页曲线强度：控制翻页过程中书页弯曲的程度
const turningCurveStrength = 0.09;

// ==================== 书页几何参数 ====================
// 书页宽度：1.28个单位
const PAGE_WIDTH = 1.28;
// 书页高度：1.71个单位，保持4:3的宽高比
const PAGE_HEIGHT = 1.71;
// 书页厚度：0.003个单位，非常薄
const PAGE_DEPTH = 0.003;
// 书页分段数：30段，用于创建骨骼动画
const PAGE_SEGMENTS = 30;
// 每段宽度：总宽度除以段数
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

// ==================== 创建书页几何体 ====================
// 使用BoxGeometry创建盒子形状的书页
// 参数：宽度、高度、深度、宽度分段数、高度分段数
const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,  // 宽度分为30段，用于骨骼动画
  2               // 高度分为2段
);

// 将几何体向右移动半个宽度，使原点位于书页左边缘
// 这样便于后续的骨骼动画计算
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

// ==================== 准备骨骼动画数据 ====================
// 获取几何体的位置属性
const position = pageGeometry.attributes.position;
// 创建临时向量对象，用于存储顶点位置
const vertex = new Vector3();
// 存储每个顶点的骨骼索引
const skinIndexes = [];
// 存储每个顶点的骨骼权重
const skinWeights = [];

// 遍历几何体的每个顶点，为骨骼动画做准备
for (let i = 0; i < position.count; i++) {
  // 从位置属性中获取当前顶点
  vertex.fromBufferAttribute(position, i);
  // 获取顶点的x坐标
  const x = vertex.x;

  // 计算骨骼索引：根据x坐标确定顶点属于哪个骨骼段
  // Math.floor(x / SEGMENT_WIDTH)计算段数，Math.max确保不为负数
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  
  // 计算骨骼权重：顶点在段内的相对位置(0-1之间)
  // 权重表示顶点受相邻两个骨骼影响的程度
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  // 设置骨骼索引：每个顶点最多受4个骨骼影响
  // 这里主要使用当前段和下一段，其他设为0
  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  
  // 设置骨骼权重：当前段权重为(1-weight)，下一段权重为weight
  // 这样创建平滑的过渡效果
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

// 将骨骼索引和权重数据添加到几何体中
pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)  // 4表示每个顶点4个索引
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)  // 4表示每个顶点4个权重
);

// ==================== 材质配置 ====================
// 创建白色颜色对象，用于书页材质
const whiteColor = new Color("white");
// 创建橙色发光颜色，用于悬停效果
const emissiveColor = new Color("orange");

// 创建基础材质数组：前面、背面、左面、右面
const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),  // 前面：白色
  new MeshStandardMaterial({ color: "#111" }),     // 背面：深灰色
  new MeshStandardMaterial({ color: whiteColor }),  // 左面：白色
  new MeshStandardMaterial({ color: whiteColor }),  // 右面：白色
];

// ==================== 预加载纹理 ====================
// 遍历所有页面，预加载纹理以提高性能
pages.forEach((page) => {
  // 预加载前面纹理 - 使用BASE_URL
  useTexture.preload(`${import.meta.env.BASE_URL}textures/${page.front}.jpg`);
  // 预加载背面纹理 - 使用BASE_URL
  useTexture.preload(`${import.meta.env.BASE_URL}textures/${page.back}.jpg`);
  // 预加载粗糙度贴图(用于封面) - 使用BASE_URL
  useTexture.preload(`${import.meta.env.BASE_URL}textures/gcc-cover-roughness.jpg`);
});

// ==================== 单页组件 ====================
// Page组件：表示书中的一页，包含完整的翻页动画逻辑
const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  // 使用useTexture加载纹理 - 使用BASE_URL
  const [picture, picture2, pictureRoughness] = useTexture([
    `${import.meta.env.BASE_URL}textures/${front}.jpg`,  // 前面纹理
    `${import.meta.env.BASE_URL}textures/${back}.jpg`,   // 背面纹理
    // 只有封面(第0页)和封底(最后一页)才加载粗糙度贴图
    ...(number === 0 || number === pages.length - 1
      ? [`${import.meta.env.BASE_URL}textures/gcc-cover-roughness.jpg`]
      : []),
  ]);
  
  // 设置纹理的颜色空间为sRGB，确保颜色显示正确
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  
  // 创建组引用，用于控制整页的旋转
  const group = useRef();
  // 记录翻页开始时间，用于动画计算
  const turnedAt = useRef(0);
  // 记录上一帧的opened状态，用于检测状态变化
  const lastOpened = useRef(opened);

  // 创建蒙皮网格引用
  const skinnedMeshRef = useRef();

  // ==================== 创建蒙皮网格 ====================
  // 使用useMemo缓存计算结果，避免重复创建
  const manualSkinnedMesh = useMemo(() => {
    // 创建骨骼数组
    const bones = [];
    
    // 为每个段创建对应的骨骼
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      
      if (i === 0) {
        // 第一个骨骼位于原点
        bone.position.x = 0;
      } else {
        // 其他骨骼按段宽度分布
        bone.position.x = SEGMENT_WIDTH;
      }
      
      // 将骨骼连接成层次结构：每个骨骼都是前一个骨骼的子对象
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    
    // 创建骨骼系统
    const skeleton = new Skeleton(bones);

    // 创建材质数组：基础材质 + 前面材质 + 背面材质
    const materials = [
      ...pageMaterials,  // 基础材质(前面、背面、左面、右面)
      
      // 前面材质：使用前面纹理
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,  // 设置纹理贴图
        // 封面使用粗糙度贴图，其他页面使用固定粗糙度值
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness,  // 封面：使用粗糙度贴图
            }
          : {
              roughness: 0.1,  // 其他页面：固定粗糙度值
            }),
        emissive: emissiveColor,           // 发光颜色
        emissiveIntensity: 0,              // 初始发光强度为0
      }),
      
      // 背面材质：使用背面纹理
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,  // 设置纹理贴图
        // 封底使用粗糙度贴图，其他页面使用固定粗糙度值
        ...(number === pages.length - 1
          ? {
              roughnessMap: pictureRoughness,  // 封底：使用粗糙度贴图
            }
          : {
              roughness: 0.1,  // 其他页面：固定粗糙度值
            }),
        emissive: emissiveColor,           // 发光颜色
        emissiveIntensity: 0,              // 初始发光强度为0
      }),
    ];
    
    // 创建蒙皮网格：将几何体、材质和骨骼系统结合
    const mesh = new SkinnedMesh(pageGeometry, materials);
    
    // 启用阴影投射和接收
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    // 禁用视锥体剔除，确保网格始终渲染
    mesh.frustumCulled = false;
    
    // 将第一个骨骼添加到网格中
    mesh.add(skeleton.bones[0]);
    
    // 绑定骨骼系统到网格
    mesh.bind(skeleton);
    
    return mesh;
  }, []); // 空依赖数组：只在组件首次渲染时创建

  // ==================== 动画帧循环 ====================
  // useFrame在每一帧执行，用于更新动画
  useFrame((_, delta) => {
    // 安全检查：确保蒙皮网格已创建
    if (!skinnedMeshRef.current) {
      return;
    }

    // ==================== 悬停发光效果 ====================
    // 根据悬停状态设置发光强度
    const emissiveIntensity = highlighted ? 0.22 : 0;
    
    // 平滑过渡发光强度，创建自然的发光效果
    // 使用MathUtils.lerp进行线性插值，0.1是插值因子
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    // ==================== 翻页动画控制 ====================
    // 检测opened状态变化，记录翻页开始时间
    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();  // 记录当前时间戳
      lastOpened.current = opened;     // 更新状态
    }
    
    // 计算翻页动画进度：0-1之间，使用正弦函数创建平滑的动画曲线
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    // ==================== 目标旋转角度计算 ====================
    // 基础目标角度：opened为true时-90度，false时90度
    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    
    // 如果书本未完全关闭，添加页面的角度偏移
    // 每页偏移0.8度，创建书页的层次感
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    // ==================== 骨骼动画更新 ====================
    // 获取所有骨骼
    const bones = skinnedMeshRef.current.skeleton.bones;
    
    // 遍历每个骨骼，更新其旋转
    for (let i = 0; i < bones.length; i++) {
      // 确定旋转目标：第一个骨骼旋转整个组，其他骨骼旋转自身
      const target = i === 0 ? group.current : bones[i];

      // ==================== 曲线效果计算 ====================
      // 内侧曲线强度：前8段使用正弦函数创建内侧弯曲
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      
      // 外侧曲线强度：后8段使用余弦函数创建外侧弯曲
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      
      // 翻页曲线强度：使用正弦函数创建翻页过程中的弯曲
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
      
      // ==================== 最终旋转角度计算 ====================
      // 综合各种曲线效果，计算最终的旋转角度
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      
      // 折叠旋转角度：用于创建书页的折叠效果
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
      
      // ==================== 书本关闭状态处理 ====================
      if (bookClosed) {
        if (i === 0) {
          // 第一段：使用目标旋转角度，不折叠
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          // 其他段：不旋转，不折叠
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      
      // ==================== 应用旋转动画 ====================
      // 使用easing.dampAngle平滑地更新Y轴旋转
      easing.dampAngle(
        target.rotation,    // 目标对象的旋转
        "y",                // Y轴旋转
        rotationAngle,      // 目标角度
        easingFactor,       // 缓动因子
        delta               // 时间增量
      );

      // ==================== 折叠动画 ====================
      // 计算折叠强度：后8段使用正弦函数创建折叠效果
      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      
      // 应用X轴折叠旋转
      easing.dampAngle(
        target.rotation,           // 目标对象的旋转
        "x",                       // X轴旋转
        foldRotationAngle * foldIntensity,  // 折叠角度
        easingFactorFold,          // 折叠缓动因子
        delta                      // 时间增量
      );
    }
  });

  // ==================== 交互状态管理 ====================
  // 使用Jotai获取页码状态和设置函数
  const [_, setPage] = useAtom(pageAtom);
  // 本地状态：是否高亮显示
  const [highlighted, setHighlighted] = useState(false);
  // 使用useCursor改变鼠标指针样式
  useCursor(highlighted);

  // ==================== 渲染 ====================
  return (
    // 组容器：包装整个页面，处理交互事件
    <group
      {...props}
      ref={group}
      // 鼠标进入事件：设置高亮状态
      onPointerEnter={(e) => {
        e.stopPropagation();  // 阻止事件冒泡
        setHighlighted(true);
      }}
      // 鼠标离开事件：取消高亮状态
      onPointerLeave={(e) => {
        e.stopPropagation();  // 阻止事件冒泡
        setHighlighted(false);
      }}
      // 点击事件：切换页面状态
      onClick={(e) => {
        e.stopPropagation();  // 阻止事件冒泡
        // 如果页面已打开，跳转到当前页；否则跳转到下一页
        setPage(opened ? number : number + 1);
        setHighlighted(false);  // 取消高亮
      }}
    >
      {/* 使用primitive渲染Three.js对象 */}
      <primitive
        object={manualSkinnedMesh}  // 蒙皮网格对象
        ref={skinnedMeshRef}        // 引用
        // 设置Z轴位置：根据页码和当前页计算深度偏移
        // 创建书页的层次感
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

// ==================== 书本主组件 ====================
// Book组件：管理整个书本，包含所有页面
export const Book = ({ ...props }) => {
  // 使用Jotai获取当前页码
  const [page] = useAtom(pageAtom);
  // 延迟页码：用于创建平滑的翻页动画
  const [delayedPage, setDelayedPage] = useState(page);

  // ==================== 延迟翻页逻辑 ====================
  // 使用useEffect监听页码变化，实现延迟翻页效果
  useEffect(() => {
    let timeout;  // 定时器引用
    
    // 递归函数：逐步更新延迟页码
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        // 如果延迟页码等于目标页码，停止更新
        if (page === delayedPage) {
          return delayedPage;
        } else {
          // 设置定时器，延迟更新页码
          timeout = setTimeout(
            () => {
              goToPage();  // 递归调用
            },
            // 如果页码差距大于2，使用较短的延迟(50ms)；否则使用较长的延迟(150ms)
            Math.abs(page - delayedPage) > 2 ? 50 : 150
          );
          
          // 根据页码差距决定是增加还是减少
          if (page > delayedPage) {
            return delayedPage + 1;  // 向前翻页
          }
          if (page < delayedPage) {
            return delayedPage - 1;  // 向后翻页
          }
        }
      });
    };
    
    // 开始翻页动画
    goToPage();
    
    // 清理函数：清除定时器
    return () => {
      clearTimeout(timeout);
    };
  }, [page]); // 依赖数组：当page变化时重新执行

  // ==================== 渲染 ====================
  return (
    // 书本组：整体旋转-90度，使书本水平放置
    <group {...props} rotation-y={-Math.PI / 2}>
      {/* 遍历所有页面配置，创建Page组件 */}
      {[...pages].map((pageData, index) => (
        <Page
          key={index}                    // React key属性
          page={delayedPage}             // 当前延迟页码
          number={index}                 // 页面编号
          opened={delayedPage > index}   // 是否已打开
          bookClosed={delayedPage === 0 || delayedPage === pages.length}  // 书本是否完全关闭
          {...pageData}                  // 传递页面数据(前面、背面纹理)
        />
      ))}
    </group>
  );
};
