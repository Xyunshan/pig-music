<template>
  <div class="rank">
    <scroll ref="scroll" class="scroll">
      <div class="content">
        <ul class="rank-list">
          <li
            v-for="item in topList"
            :key="item.id"
            class="rank-cn"
            @click.stop="selectDetail(item)"
          >
            <div class="rank-icon">
              <img v-lazy="item.picUrl" width="100%">
            </div>
            <div class="rank-text">
              <h3 class="rank-name">{{item.topTitle}}</h3>
              <p v-for="(song,index) in item.songList" :key="index" class="song">
                {{index+1}} {{song.songname}}
                <span>- {{song.singername}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>
<script>
import { getRank } from "@/api/getRank.js";
import Scroll from "@/bese/scroll.vue";
import { createRank } from "@/common/js/dedail.js";
import { mapGetters, mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin.js";

export default {
  mixins: [playlistMixin],

  created() {
    this._getRank();
  },
  data() {
    return {
      topList: []
    };
  },
  methods: {
    handlePlaylist(playList) {
      const bottom = playList.length > 0 ? "60px" : "0";
      if (this.$refs.scroll) {
        this.$refs.scroll.$el.style.bottom = bottom;
        this.$refs.scroll.refresh();
      }
    },
    _getRank() {
      getRank().then(res => {
        if (res.code === 0) {
          this.topList = res.data.topList;
          console.log(this.topList);
        }
      });
    },
    // 点击每一块板块时执行
    selectDetail(data) {
      // 修改路由
      this.$router.push({ path: `/rank/${data.id}` });
      // 把处理后的数据传入全局
      this.setDedail(createRank(data));
    },
    // 映射
    ...mapMutations({
      // 映射vuex中的SET_SONG_SHEET
      setDedail: "SET_DEDAIL"
    })
  },
  components: {
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.rank {
  position: fixed;
  top: 66px;
  width: 100%;
  bottom: 0;
  background-color: $bgcolor;
  .scroll {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .content {
    width: 100%;
    .rank-list {
      padding: 1% 2% 1% 2%;
      width: 96%;
      .rank-cn {
        position: relative;
        background-color: $namebgcolor;
        width: 100%;
        margin-bottom: 10px;
        .rank-icon {
          height: 80px;
          width: 80px;
        }
        .rank-text {
          position: absolute;
          top: 0;
          left: 90px;
          right: 0;
          white-space: nowrap;
          .rank-name,
          .song {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rank-name {
            font-size: 14px;
          }
          .song {
            margin-top: 4px;
            font-size: 12px;
            span {
              color: $ftcolor;
            }
          }
        }
      }
    }
  }
}
</style>