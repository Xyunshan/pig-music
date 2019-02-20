<template>
  <div class="recommend">
    <loading v-if="!songSheet.length>0"></loading>
    <scroll class="scroll" ref="scroll" v-if="slider.length" :data="songSheet">
      <div class="content" ref="content">
        <div class="recommend-xq" ref="recommendXq">
          <slider :slider="slider">
            <li class="slider-item" v-for="item in slider" :key="item.linkUrl">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" width="100%">
              </a>
            </li>
          </slider>
          <div class="recommend-list">
            <div class="list-title">
              <img src="@/common/images/hot/hot.png" class="hot-img">
              <h2 class="hot-title">热门歌单推荐</h2>
            </div>
            <!-- 歌单列表 -->
            <ul class="hot-sheet">
              <li
                class="sheet-list"
                v-for="list in songSheet"
                :key="list.content_id"
                @click.stop="selectDetail(list)"
              >
                <div class="sheet-icon">
                  <img v-lazy="list.cover" width="100%">
                </div>

                <div class="sheet-text">
                  <h3 class="sheet-title">{{list.title}}</h3>
                  <p class="username">
                    <span>{{list.username}}</span>
                  </p>
                  <P class="lsnum">
                    播放量:
                    <span>{{list.listen_num}}</span>
                  </P>
                </div>
              </li>
            </ul>
          </div>
          <div class="statement">
            <p class="emt">本软件仅供学习</p>
            <p class="emt">
              如需获得更好的体验请移步至
              <a class="emta" href="https://y.qq.com/m/download.html">QQ音乐</a>
            </p>
            <p class="emt">作者：雲山</p>
          </div>
        </div>
      </div>
    </scroll>
    <router-view/>
  </div>
</template>
<script>
import Slider from "@/bese/Slider";
import Scroll from "@/bese/scroll.vue";
import Loading from "@/bese/loading.vue";
import { getSlider, getSongSheet } from "@/api/getRecommend";
import { mapGetters, mapMutations } from "vuex";
import { createSheet } from "@/common/js/dedail.js";
import { playlistMixin } from "@/common/js/mixin.js";
export default {
  mixins: [playlistMixin],
  created() {
    this._getSlider();
    this._getSongSheet();
  },
  data() {
    return {
      slider: [],
      songSheet: []
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
    // 轮播
    _getSlider() {
      getSlider().then(res => {
        if (res.code === 0) {
          this.slider = res.data.slider;
        }
      });
    },
    // 热门
    _getSongSheet() {
      getSongSheet().then(res => {
        if (res.code === 0) {
          this.songSheet = res.recomPlaylist.data.v_hot;
        }
      });
    },
    selectDetail(list) {
      // 修改路由
      this.$router.push({ path: `/recommend/${list.content_id}` });
      // 把处理后的数据传入全局
      this.setDedail(createSheet(list));
    },
    // 映射
    ...mapMutations({
      // 映射vuex中的SET_SONG_SHEET
      setDedail: "SET_DEDAIL"
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.recommend {
  position: fixed;
  top: 66px;
  width: 100%;
  bottom: 0;
  .scroll {
    position: absolute;
    top: 0;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    .content {
      width: 100%;
      .slider-item {
        width: 100%;
      }
      .recommend-list {
        width: 100%;
        min-height: 200px;
        .list-title {
          display: flex;
          width: 100%;
          height: 40px;
          background-color: $tabbgcolor;
          line-height: 40px;
          .hot-img {
            margin: 10px;
            width: 20px;
            height: 20px;
          }
          .hot-title {
            width: 100%;
            font-size: 15px;
          }
        }
        .hot-sheet {
          width: 96%;
          padding: 0 2% 1% 2%;
          .sheet-list {
            position: relative;
            display: flex;
            width: 100%;
            height: 66px;
            margin-top: 10px;
            line-height: 22px;
            background-color: $namebgcolor;
            .sheet-icon {
              width: 66px;
              height: 66px;
            }
            .sheet-text {
              position: absolute;
              height: 66px;
              left: 76px;
              right: 0;
              font-size: 12px;

              .sheet-title {
                font-size: 13px;
              }
              .lsnum {
                color: $ftcolor;
              }
              .sheet-title,
              .username,
              .lsnum {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    .statement {
      width: 100%;
      height: 72px;
      line-height: 20px;
      text-align: center;
      color: $ftcolor;
      .emta {
        color: whitesmoke;
        text-decoration: underline;
      }
    }
  }
}
</style>

