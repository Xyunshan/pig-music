<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from "better-scroll";
export default {
  props: {
    // 以什么模式监听滚动事件
    data: {
      type: Array,
      default: null
    },
    probeType: {
      type: Number,
      default: 0
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true
      });
      // 如果需要监听滚动事件
      if (this.listenScroll) {
        let me = this;
        this.scroll.on("scroll", pos => {
          // 向上级派发事件
          me.$emit("scroll", pos);
        });
      }
    },
    // 刷新组件
    refresh() {
      console.log("刷新");
      this.scroll && this.scroll.refresh();
    },
    // 跳转到某一个位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        console.log("变化");
        this.refresh();
      }, 20);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
