<template>
  <div ref="slider" class="slider">
    <ul class="slider-group" ref="sliderGroup">
      <slot></slot>
    </ul>
    <ul class="dots">
      <li
        class="dot"
        v-for="(item, index) in dots"
        :class="{active: currentPageIndex === index}"
        :key="index"
      ></li>
    </ul>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  // 周期函数
  // 在dom加载完成后执行
  mounted() {
    setTimeout(() => {
      this._initWidth();
      this._initSlider();
      this._autoPlay();
      // 每当窗口大小变化时
    }, 20);
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._initWidth(true);
      this.slider.refresh();
    });
  },
  //页面离开后执行
  deactivated() {
    clearTimeout(this.timer);
  },
  // 页面进入时执行
  activated() {
    // this._autoPlay();
  },
  props: {
    // 是否是无缝滚动
    loop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 小点
      dots: [],
      currentPageIndex: 0
    };
  },
  // 定义函数
  methods: {
    // 初始化轮播图的宽度
    _initWidth(isResize) {
      let width = 0;
      // 获取组件视口的宽度
      let sliderWidth = this.$refs.slider.clientWidth;
      // 获取所有的子元素
      this.children = this.$refs.sliderGroup.children;
      // 小点的数量

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        // 每一个子元素的宽度
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      // 如果是无缝滚动需要增加两个位置
      if (this.loop && !isResize) {
        this.dots = new Array(this.children.length);
        width += 2 * sliderWidth;
      }
      // 设置组件的总宽度
      this.$refs.sliderGroup.style.width = width + "px";
    },
    // 初始化轮播组件
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop, // 开启循环播放
          threshold: 0.3, // 滚动距离超过宽度/高度的 30% 时切换图片
          speed: 400 // 切换动画时长 400ms
        }
      });
      // 轮播一次切换后执行
      this.slider.on("scrollEnd", () => {
        // 获取当前滚动到第几页
        let pageIndex = this.slider.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        clearTimeout(this.timer);
        this._autoPlay();
      });
    },
    // 自动轮播
    _autoPlay() {
      let pageIndex = this.currentPageIndex + 1;
      if (pageIndex == this.children.length - 2) {
        pageIndex = 0;
      }
      //   定时器一段时间后跳转到第几页
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, 3000);
    }
  }
};
</script>
<style lang="scss" scoped>
.slider {
  position: relative;
  width: 100%;
  .slider-group {
    display: flex;
  }
  .dots {
    position: absolute;
    bottom: 10px;
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: center;
    .dot {
      width: 6px;
      height: 6px;
      background-color: #acacac;
      margin: 0 4px;
      border-radius: 3px;
      transition: width 0.2s linear;
    }
    .active {
      width: 12px;
      background-color: #ffffff;
    }
  }
}
</style>
