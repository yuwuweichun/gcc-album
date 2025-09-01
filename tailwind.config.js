/** @type {import('tailwindcss').Config} */
// Tailwind CSS配置文件 - 定义项目的样式主题和自定义配置
export default {
  // content配置：指定Tailwind应该扫描哪些文件来生成CSS类
  content: [
    "./index.html",                    // 扫描HTML入口文件
    "./src/**/*.{js,ts,jsx,tsx}",      // 扫描src目录下所有的JavaScript/TypeScript文件
  ],
  
  // theme配置：定义项目的设计主题
  theme: {
    // 字体族配置：设置默认无衬线字体
    fontFamily: {
      sans: ["Poppins", "sans-serif"],  // 主要字体：Poppins，后备字体：系统默认无衬线字体
    },
    
    // extend配置：扩展默认主题，添加自定义样式
    extend: {
      // 扩展字体大小：添加超大的字体尺寸
      fontSize: {
        "10xl": "10rem",   // 10xl = 160px (10 * 16px)
        "11xl": "11rem",   // 11xl = 176px (11 * 16px)
        "12xl": "12rem",   // 12xl = 192px (12 * 16px)
        "13xl": "13rem",   // 13xl = 208px (13 * 16px)
      },
      
      // 扩展动画：添加自定义的滚动动画
      animation: {
        // 水平滚动动画1：向右滚动，16秒循环，线性缓动
        "horizontal-scroll": "horizontal-scroll linear 16s infinite",
        // 水平滚动动画2：向左滚动，16秒循环，线性缓动
        "horizontal-scroll-2": "horizontal-scroll-2 linear 16s infinite",
      },
      
      // 关键帧定义：定义动画的具体运动过程
      keyframes: {
        // 水平滚动动画1：从原位置向右移动100%
        "horizontal-scroll": {
          from: { transform: "translateX(0)" },      // 起始位置：X轴偏移0
          to: { transform: "translateX(-100%)" },   // 结束位置：X轴向左偏移100%
        },
        // 水平滚动动画2：从右侧100%位置移动到原位置
        "horizontal-scroll-2": {
          from: { transform: "translateX(100%)" },  // 起始位置：X轴向右偏移100%
          to: { transform: "translateX(0)" },       // 结束位置：X轴偏移0
        },
      },
    },
  },
  
  // 插件配置：可以添加Tailwind插件来扩展功能
  plugins: [],
};
