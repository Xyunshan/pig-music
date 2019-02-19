<template>
  <transition name="detail">
    <div class="detail">
      <div class="top">
        <div class="return-btn">
          <span class="iconfont icon-icon-arrow-left" @click.stop="back"></span>
        </div>
        <h2 class="detail-title">{{dedail.name}}</h2>
      </div>
      <div class="bgimg" ref="bgimg">
        <img :src="dedail.image" class="dedail-bgimg">
      </div>

      <!-- 歌曲列表 -->
      <div class="songlist">
        <transition enter-active-class="animated fadeInLeft ">
          <div ref="text" class="text" v-show="songs.length>0">
            <span class="total">单曲数量：{{total}}</span>
            <p class="company">{{company}}</p>
            <span>{{year}}</span>
          </div>
        </transition>
        <div class="sc-content" ref="sct">
          <songlist v-if="songs.length>0" :songs="songs"/>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
// vuex
import { mapGetters, mapActions } from "vuex";
import { getAlbumDetail } from "@/api/getAlbum.js";
// 格式化歌曲列表
import { createSong } from "@/common/js/song.js";
// 播放列表组件
import Songlist from "@/bese/Song-list.vue";

export default {
  // 周期函数
  created() {
    console.log(this.dedail);
    this._getAlbumDetail();
  },
  mounted() {
    this.setsonglistHt();
  },
  // 计算属性
  computed: {
    // 从全局拿到数据（歌单详细数据）
    ...mapGetters(["dedail"])
  },
  data() {
    return {
      // 歌曲列表
      songs: [],
      // 歌曲总数量
      total: 0,
      // 出品
      company: "",
      year: ""
    };
  },
  methods: {
    // 返回上一级路由
    back() {
      this.$router.back();
    },
    // 设置高度
    setsonglistHt() {
      // 获取图片组件的宽度
      this.bgimgtwh = this.$refs.bgimg.clientWidth;
      //
      this.$refs.sct.style.top = this.bgimgtwh / 1.5 + "px";
      this.$refs.text.style.top = this.bgimgtwh / 2.4 + "px";
    },
    // 获取专辑详情
    _getAlbumDetail() {
      if (!this.dedail.id) {
        this.$router.back();
        return;
      }
      getAlbumDetail(this.dedail.id).then(res => {
        if (res.code === 0) {
          this.year = res.data.aDate;
          this.company = res.data.company;
          this.total = res.data.total;
          this.normalizeSongs(res.data.list);
        }
      });
    },
    // 歌曲合集传入歌曲的集合
    normalizeSongs(songlist) {
      songlist.forEach(item => {
        if (item.albummid) {
          this.songs.push(createSong(item));
        }
      });
      console.log(this.songs);
    }
  },
  components: {
    Songlist
  }
};
</script>
<style lang="scss">
@import "@/common/scss/initstyle.scss";
.detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $bgcolor;
  .top {
    position: absolute;
    top: 0;
    height: 36px;
    width: 100%;
    .return-btn {
      color: $selection;
      position: absolute;
      .icon-icon-arrow-left {
        line-height: 36px;
        font-size: 24px;
      }
    }
    .detail-title {
      background-color: rgba(0, 0, 0, 0.4);
      width: 100%;
      font-size: 14px;
      font-weight: normal;
      text-align: center;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .bgimg {
    width: 100%;
    .dedail-bgimg {
      width: 100%;
    }
  }
  .songlist {
    position: absolute;
    top: 36px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .text {
      font-size: 12px;
      position: absolute;
      left: 2%;
      width: 100px;
      line-height: 20px;
      padding-left: 10px;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.4);
      .company {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .sc-content {
      position: absolute;
      width: 100%;
      bottom: 0;
      //   background-color: $bgcolor;
      .song-pe {
        width: 100%;
        min-height: 6rem;
        // background-color: $bgc;
      }
    }
  }
}
// 动画类
.detail-enter-active,
.detail-leave-active {
  transition: all 0.3s;
}
.detail-enter,
.detail-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
