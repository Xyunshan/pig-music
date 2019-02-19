<template>
  <div id="app">
    <my-header/>
    <tabbar/>
    <transition name="mv">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
    <transition name="player">
      <player></player>
    </transition>
  </div>
</template>
<script>
import Header from "@/components/header/Header";
import Tabbar from "@/components/tabbar/Tabbar";
import Player from "@/components/player/Player";
export default {
  components: {
    "my-header": Header,
    Tabbar,
    Player
  }
};
</script>
<style lang="scss">
@import "@/common/scss/initstyle.scss";
#app {
  background-color: $bgcolor;
  color: #ffffff;
  .mv-enter,
  .mv-leave-to {
    opacity: 0;
  }
  .mv-enter-active,
  .mv-leave-active {
    transition: all 0.3s ease;
  }
}
</style>

