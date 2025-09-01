// 导入Jotai状态管理库
// atom: 用于创建原子状态
// useAtom: 用于在组件中使用和修改原子状态
import { atom, useAtom } from "jotai";
// 导入React的useEffect钩子 - 用于处理副作用，如播放音效
import { useEffect } from "react";

// 定义图片名称数组 - 这些是相册中展示的图片文件名(不包含扩展名)
const pictures = [
  "gcc-01",  // 第1张图片
  "gcc-02",  // 第2张图片
  "gcc-03",  // 第3张图片
  "gcc-04",  // 第4张图片
  "gcc-05",  // 第5张图片
  "gcc-06",  // 第6张图片
  "gcc-07",  // 第7张图片
  "gcc-08",  // 第8张图片
  "gcc-09",  // 第9张图片
  "gcc-10"   // 第10张图片
];

// 创建页面状态原子 - 使用Jotai管理当前页码状态
// 初始值为0，表示封面页
export const pageAtom = atom(0);

// 构建页面配置数组 - 定义每页的前面和背面图片
export const pages = [
  // 第0页：封面页
  {
    front: "gcc-cover",  // 前面：封面图片
    back: pictures[0],   // 背面：第1张图片
  },
];

// 动态生成中间页面 - 每页包含两张图片(前面和背面)
// 从第1张图片开始，每两张图片组成一页
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],           // 前面：第i张图片
    back: pictures[(i + 1) % pictures.length],     // 背面：第i+1张图片
  });
}

// 添加最后一页：封底页
pages.push({
  front: pictures[pictures.length - 1],  // 前面：最后一张图片
  back: "gcc-back",                      // 背面：封底图片
});

// UI组件 - 负责渲染用户界面元素
export const UI = () => {
  // 使用useAtom获取当前页码状态和设置页码的函数
  const [page, setPage] = useAtom(pageAtom);

  // 使用useEffect监听页码变化，播放翻页音效
  useEffect(() => {
    // 创建音频对象，加载翻页音效文件
    const audio = new Audio("/audios/page-flip-01a.mp3");
    // 播放音效
    audio.play();
  }, [page]); // 依赖数组：当page变化时重新执行

  return (
    // React Fragment - 包装多个UI元素
    <>
      {/* 主界面容器 - 覆盖整个屏幕，不接收指针事件(除了特定元素) */}
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        
        {/* 左上角Logo链接 */}
        <a
          className="pointer-events-auto mt-10 ml-10"  // 启用指针事件，设置位置
          href="https://github.com/yuwuweichun"        // 链接到GitHub个人主页
        >
          {/* GCC Logo图片 */}
          <img className="w-20" src="/images/logo-gcc.jpg" alt="GCC Logo" />
        </a>

        {/* 底部页面导航区域 */}
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          {/* 导航按钮容器 - 水平滚动，居中对齐 */}
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            
            {/* 动态生成页码按钮 - 遍历所有页面 */}
            {[...pages].map((_, index) => (
              <button
                key={index}  // React key属性，用于优化渲染
                // 动态样式类：当前页高亮显示，其他页半透明
                className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"    // 当前页：白色背景，黑色文字
                    : "bg-black/30 text-white"    // 其他页：半透明黑色背景，白色文字
                }`}
                // 点击事件：跳转到指定页面
                onClick={() => setPage(index)}
              >
                {/* 按钮文字：第0页显示"Cover"，其他页显示"Page X" */}
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}

            {/* 封底页按钮 - 最后一页 */}
            <button
              className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"    // 当前页：白色背景，黑色文字
                  : "bg-black/30 text-white"    // 其他页：半透明黑色背景，白色文字
              }`}
              // 点击事件：跳转到封底页
              onClick={() => setPage(pages.length)}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>

      {/* 装饰性文字滚动区域 - 显示在屏幕中央 */}
      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          
          {/* 第一层滚动文字 - 向右滚动 */}
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            {/* 各种装饰性文字标题，使用不同的字体大小和样式 */}
            <h1 className="shrink-0 text-white text-10xl font-black">
              慕然回首
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              一起喝喝，drink drink
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              LOVE
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              穿越时空的少女
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              南平列车
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              我们熊呐
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
              芜湖~
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
              小苹果洞洞鞋！
            </h2>
          </div>

          {/* 第二层滚动文字 - 向左滚动，创建视差效果 */}
          <div className="absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max">
            {/* 重复相同的文字内容，但使用不同的动画 */}
            <h1 className="shrink-0 text-white text-10xl font-black">
              慕然回首
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              一起喝喝，drink drink
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              LOVE
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              穿越时空的少女
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              南平列车
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              我们熊呐
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
              芜湖~
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
              小苹果洞洞鞋！
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
