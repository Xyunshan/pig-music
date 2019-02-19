<template>
  <div class="search">
    <div class="search-box">
      <div class="s-box">
        <input
          class="search-ipt"
          @blur="siptblur"
          @focus="siptfocus"
          placeholder="搜索歌曲、歌单、歌手、专辑"
          type="text"
          v-model="text"
        >
        <div class="search-btn" @click.stop="_getSearch(false)">
          <span class="iconfont icon-icon-9"></span>
        </div>
      </div>

      <!-- 搜索提示 -->
      <div class="search-tips" v-show="searchTips">
        <ul
          class="tips"
          v-for="item in searchTips"
          :key="item.type"
          v-show="item.itemlist.length"
          @click="hotKey($event)"
        >
          <h4 class="tips-title">{{item.name}}</h4>
          <li class="list" v-for="list in item.itemlist" :key="list.id">{{list.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 热门搜索 -->
    <div class="hots" v-show="!text">
      <h3 class="hot">热门搜索</h3>
      <ul class="hot-list" @click="hotKey($event)">
        <li class="list" v-for="tip in hotList" :key="tip.n">{{tip.k}}</li>
      </ul>
    </div>
    <!-- 歌曲列表 -->
    <div class="song-content" v-show="songs.length">
      <scroll ref="scroll" :data="songs" class="scroll">
        <div class="song-list">
          <ul class="song-xq" ref="songXq">
            <li class="song" v-for="song in songs" @click.stop="selectItem(song,0)" :key="song.mid">
              <div class="search-img">
                <img v-lazy="song.image" width="100%">
              </div>
              <div class="song-text">
                <h4 class="text">
                  <span class="song-name">{{song.name}}</span>
                  <span class="duration">{{duration(song.duration)}}</span>
                </h4>
                <p class="text aum-sgr">专辑：{{song.albumname}}</p>
                <p class="text aum-sgr">歌手：{{song.singer}}</p>
              </div>
            </li>
          </ul>
          <!-- 加载更多 -->
          <div class="loadMore">
            <span @click="loadMore">{{loadText}}</span>
            <div class="loadimg" v-show="showLoad">
              <img class="img" height="100%" src="@/common/images/loading/loading.gif">
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import { getHotSearch, getSearch, getSearchTips } from "@/api/getSearch.js";
// 格式化歌曲列表
import { createSong } from "@/common/js/song.js";
import { mapActions } from "vuex";
// 格式化时间
import transTime from "@/common/js/duration.js";
// 滚动组件
import Scroll from "@/bese/scroll.vue";
export default {
  created() {
    this._getHotSearch();
  },
  computed: {
    loadText() {
      return this.page >= this.pagenum ? "已显示全部" : "展开";
    }
  },
  data() {
    return {
      text: "",
      page: 1,
      pagenum: 0,
      showLoad: false,
      hotList: [],
      searchTips: {},
      songs: []
    };
  },
  methods: {
    duration(sd) {
      return transTime(sd);
    },
    // 获取热门搜索
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.code === 0) {
          this.hotList = res.data.hotkey;
        }
      });
    },
    // 搜素提示
    _getSearchTips() {
      getSearchTips(this.text).then(res => {
        if (res.code === 0) {
          this.searchTips = res.data;
        }
      });
    },
    // 搜索内容
    _getSearch(isLoad) {
      if (this.text) {
        if (isLoad) {
          this.showLoad = true;
        }
        getSearch(this.text, this.page).then(res => {
          if (res.code === 0) {
            this.showLoad = false;
            this.pagenum = Math.ceil(res.data.song.totalnum / 30);
            this.normalizeSongs(res.data.song.list, isLoad);
          }
          this.searchTips = "";
        });
      }
    },
    // 失去焦点时执行
    siptblur() {
      this.searchTips = "";
    },
    // 获得焦点
    siptfocus() {
      this._getSearchTips();
    },
    hotKey(e) {
      if (e.target.className === "list") {
        this.text = e.target.innerText;
        this._getSearch(false);
      }
    },
    // 加载更多
    loadMore() {
      if (this.page >= this.pagenum) {
        return;
      }
      this.page += 1;
      this._getSearch(true);
    },
    // list传入歌曲的集合
    normalizeSongs(songlist, isLoad) {
      if (!isLoad) {
        this.songs = [];
      }
      songlist.forEach(item => {
        if (item.songmid) {
          this.songs.push(createSong(item));
        }
      });
      console.log(this.songs);
    },
    // 传入当前歌曲列表信息和点击的索引
    selectItem(song, index) {
      let songlist = [song];
      this.selectPlay({ list: songlist, index });
    },
    ...mapActions(["selectPlay"])
  },
  components: {
    Scroll
  },
  watch: {
    // 当搜索的内容发生变化
    text() {
      this._getSearchTips();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.search {
  position: fixed;
  top: 66px;
  width: 100%;
  bottom: 0;
  background-color: $bgcolor;
  .search-box {
    position: relative;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 36px;
    background-color: rgb(65, 65, 65);
    .s-box {
      position: relative;
      width: 304px;
      height: 36px;
      margin: 0 auto;
      .search-ipt {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        outline: medium;
        font-size: 12px;
        width: 280px;
        height: 24px;
        margin: 0 auto;
        padding-left: 8px;
        padding-right: 24px;
        color: #000;
        border: 1px solid $bgcolor;
        border-radius: 10px;
      }
      .search-ipt:focus {
        border: 1px solid $selection;
      }
      .search-btn {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 0;
        text-align: center;
        margin: 1px 0;
        .icon-icon-9:active {
          border-radius: 50%;
          background-color: rgb(189, 189, 189);
        }
        .icon-icon-9 {
          color: #000;
          font-size: 18px;
        }
      }
    }

    // 搜索提示
    .search-tips {
      position: absolute;
      top: 36px;
      width: 78%;
      margin-top: 2px;
      margin-left: 11%;
      background-color: $tabbgcolor;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      overflow: hidden;
      .tips {
        width: 100%;
        .tips-title {
          padding-left: 10px;
          font-size: 14px;
          background-color: $namebgcolor;
          height: 24px;
          line-height: 24px;
          border-bottom: 1px solid $hbgcolor;
        }
        .list {
          width: 95%;
          margin-left: 5%;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          border-bottom: 1px solid $hbgcolor;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  // 热门搜索
  .hots {
    width: 100%;
    .hot {
      box-sizing: border-box;
      //   background-color: $tbgc;
      width: 100%;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      padding-left: 10px;
    }
    .hot-list {
      display: flex;
      flex-wrap: wrap;
      .list {
        height: 20px;
        line-height: 20px;
        padding: 0 6px;
        margin: 6px 10px;
        border-radius: 10px;
        font-size: 13px;
        color: $ftcolor;
        background-color: $hbgcolor;
      }
    }
  }
  // 歌曲列表
  .song-content {
    position: absolute;
    top: 36px;
    bottom: 0;
    width: 100%;
    background-color: $bgcolor;
    .scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .song-list {
      padding: 1% 2% 1% 2%;
      width: 96%;
      .loadMore {
        position: relative;
        text-align: center;
        height: 30px;
        width: 100%;
        line-height: 30px;
        span {
          color: rgb(124, 124, 124);
        }
        .loadimg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 24px;
          background-color: $bgcolor;
          .img {
            margin: 0 auto;
          }
        }
      }
      .song {
        position: relative;
        width: 100%;
        margin-top: 10px;
        border-radius: 10px;
        background-color: $namebgcolor;
        .search-img {
          width: 66px;
          border-radius: 10px;
          overflow: hidden;
        }
        .song-text {
          position: absolute;
          top: 0;
          right: 0;
          left: 76px;
          line-height: 22px;
          .text {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h4 {
            font-weight: normal;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .song-name {
              display: block;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .duration {
              color: $ftcolor;
              display: block;
              text-align: left;
            }
          }
          .aum-sgr {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>