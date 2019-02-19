<template>
  <div class="loading">
    <div class="loading-con">
      <img class="loading-icon" src="@/common/images/loading/loading.gif">
      <p class="loading-text">加载中</p>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
  .loading-con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .loading-icon {
      width: 30px;
      height: 30px;
      margin: 6px auto;
    }
    .loading-text {
      font-size: 14px;
      text-align: center;
      width: 100px;
      animation: myfirst 1.2s linear 2s infinite alternate;
    }
    @keyframes myfirst {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }
}
</style>
