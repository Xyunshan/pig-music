<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        scrollY: false,
        click: true
      });
    },
    // 刷新组件
    refresh() {
      this.scroll && this.scroll.refresh();
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>



