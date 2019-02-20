<template>
  <transition enter-active-class="animated bounceInUp">
    <div class="song-content" ref="sct">
      <scroll ref="scroll" class="scroll" :data="songs">
        <div class="scrollXq">
          <ul class="song-list" ref="scrollXq">
            <li
              @click.stop="selectItem(song,index)"
              class="song"
              v-for="(song,index) in songs"
              :key="song.mid"
            >
              <div class="song-top">
                <h4 class="song-name">{{song.name}}</h4>
                <p class="song-time">{{duration(song.duration)}}</p>
              </div>
              <h3 class="album-name">专辑：{{song.albumname}}</h3>
              <p class="singer-name">歌手：{{song.singer}}</p>
            </li>
          </ul>
          <div class="song-totle">
            <span>已显示全部共计{{songs.length}}首歌曲</span>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
import transTime from "@/common/js/duration.js";
import { mapActions } from "vuex";
// 滚动组件
import Scroll from "@/bese/scroll.vue";
import { playlistMixin } from "@/common/js/mixin.js";
export default {
  mixins: [playlistMixin],

  mounted() {
    this.setminHeight();
  },
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? "60px" : "0";
      if (this.$refs.scroll) {
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      }
    },
    duration(sd) {
      return transTime(sd);
    },
    // 设置提示文字的最小高度
    setminHeight() {
      this.$refs.scrollXq.style["min-height"] = `${this.$refs.scroll.$el
        .clientHeight - 30}px`;
    },
    // 传入当前歌曲列表信息和点击的索引
    selectItem(song, index) {
      this.songlist = this.songs.slice();
      this.selectPlay({ list: this.songlist, index });
    },
    ...mapActions(["selectPlay"])
  },
  components: {
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.song-content {
  width: 100%;
  height: 100%;
  .scroll {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
}

.scrollXq {
  width: 100%;
  .song-totle {
    text-align: center;
    width: 100%;
    height: 24px;
    color: $ftcolor;
  }
}
.song-list {
  padding: 1% 2%;
  width: 96%;
  height: 100%;
  background-color: $bgcolor;

  .song {
    width: 100%;
    height: 66px;
    background-color: $namebgcolor;
    margin-bottom: 10px;
    line-height: 22px;
    .song-top {
      width: 100%;
      display: flex;
      .song-name {
        width: 80%;
      }
      .song-time {
        text-align: right;
        width: 20%;
        font-size: 13px;
        color: $ftcolor;
      }
    }
    .song-name,
    .album-name,
    .singer-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .song-name,
    .album-name {
      font-size: 14px;
      font-weight: normal;
    }
    .album-name,
    .singer-name {
      width: 100%;
      padding-left: 14px;
      box-sizing: border-box;
      font-size: 12px;
      // color: $fc;
    }
  }
}
</style>

