<template>
  <div class="tabbar">
    <router-link tag="div" class="tabbar-item" to="/recommend">
      <span class="tabbar-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tabbar-item" to="/album">
      <span class="tabbar-link">专辑</span>
    </router-link>
    <router-link tag="div" class="tabbar-item" to="/rank">
      <span class="tabbar-link">排行</span>
    </router-link>
    <router-link tag="div" class="tabbar-item" to="/singer">
      <span class="tabbar-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tabbar-item" to="/search">
      <span class="tabbar-link">搜索</span>
    </router-link>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.tabbar {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 30px;
  background-color: $tabbgcolor;
  .tabbar-item {
    box-sizing: border-box;
    width: 40px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
  }
  .router-link-active {
    color: $tlftcolor;
    border-bottom: 2px solid $selection;
  }
}
</style>
