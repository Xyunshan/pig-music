<template>
  <div class="header">
    <img src="@/common/images/logo/logo.png" class="logo">
    <h1 class="title">音乐猪头</h1>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.header {
  position: relative;
  width: 100%;
  height: 36px;
  background-color: $hbgcolor;
  .logo {
    width: 26px;
    height: 26px;
    margin: 5px 10px;
    position: absolute;
  }
  .title {
    width: 100%;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    margin: 0;
  }
}
</style>
