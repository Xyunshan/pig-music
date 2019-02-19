<template>
  <div class="album">
    <!-- 筛选列表 -->
    <ul class="tags" v-show="tags.area">
      <li class="list" v-for="(tag,index) in tags" :key="index">
        <screen ref="screen" class="screen">
          <ul class="tags-list" :class="index">
            <li
              class="list-text"
              :class="{selection:item.id===tagsId[index]}"
              v-for="item in tag"
              :key="item.id"
              @click="choiceTags(index,item.id)"
            >{{item.name}}</li>
          </ul>
        </screen>
      </li>
    </ul>
    <!-- 专辑列表 -->
    <div class="content" ref="content">
      <scroll class="scroll" ref="scroll" :data="albumList">
        <div class="album-content">
          <ul class="album-xq" ref="albumXq">
            <li
              class="album-list"
              v-for="album in albumList"
              :key="album.album_id"
              @click="selectDetail(album)"
            >
              <div class="album-icon">
                <img v-lazy="album.album_img" class="album-img">
                <div class="circle"></div>
              </div>
              <div class="album-text">
                <h3 class="album-name">专辑：{{album.album_name}}</h3>
                <p class="singer-name">{{album.album_singer}}</p>
                <p class="public-time">{{album.public_time}}</p>
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
    <router-view/>
  </div>
</template>
<script>
import Scroll from "@/bese/scroll.vue";
import Screen from "@/bese/Screen.vue";
import { getAlbum } from "@/api/getAlbum.js";
import { createAlbum } from "@/common/js/album.js";
import { mapGetters, mapMutations } from "vuex";
import { createAlbumlist } from "@/common/js/dedail.js";
export default {
  created() {
    this._getAlbum();
  },
  mounted() {
    this.setminHeight();
  },
  computed: {
    loadText() {
      return this.page >= this.total ? "已显示全部" : "展开";
    }
  },
  data() {
    return {
      showLoad: false,
      // tag数据
      tags: [],
      // 获取数据的id
      tagsId: {
        area: 1,
        company: -1,
        genre: -1,
        type: -1,
        year: -1
      },
      // 页数
      page: 1,
      // 专辑列表
      albumList: [],
      // 专辑总数量
      total: 0
    };
  },
  methods: {
    loadMore() {
      if (this.page >= this.total) {
        return;
      }
      this.page += 1;
      this._getAlbum(true);
    },
    // isMore判断是否是加载更多请求的数据
    _getAlbum(isMore) {
      if (!isMore) {
        this.albumList = [];
      }
      if (isMore) {
        this.showLoad = true;
      }
      getAlbum(this.tagsId, this.page).then(res => {
        if (res.code === 0) {
          this.showLoad = false;
          this.tags = res.albumlib.data.tags;
          this.normalizeAlbum(res.albumlib.data.list);
          this.total = Math.ceil(res.albumlib.data.total / 20);
          console.log(this.albumList);
        }
      });
    },
    // 设置提示文字的最小高度
    setminHeight() {
      this.$refs.albumXq.style["min-height"] = `${this.$refs.scroll.$el
        .clientHeight - 30}px`;
    },
    choiceTags(index, id) {
      this.tagsId[index] = id;
      this._getAlbum();
    },
    // list传入歌曲的集合
    normalizeAlbum(albumList) {
      albumList.forEach(item => {
        if (item.album_id) {
          this.albumList.push(createAlbum(item));
        }
      });
      console.log(this.albumList);
    },
    selectDetail(album) {
      // 修改路由
      this.$router.push({ path: `/album/${album.album_id}` });
      // 把处理后的数据传入全局
      this.setDedail(createAlbumlist(album));
    },
    // 映射
    ...mapMutations({
      // 映射vuex中的SET_SONG_SHEET
      setDedail: "SET_DEDAIL"
    })
  },
  components: {
    Scroll,
    Screen
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.album {
  position: fixed;
  top: 66px;
  width: 100%;
  bottom: 0;
  background-color: $bgcolor;
  .tags {
    width: 100%;
    height: 110px;
    font-size: 13px;
    border-bottom: 2px solid $selection;
    .list {
      height: 20px;
      width: 100%;
      margin-top: 2px;
      line-height: 20px;
      .screen {
        width: 100%;
        white-space: nowrap;
        .area {
          width: 204px;
        }
        .company {
          width: 1646px;
        }
        .genre {
          width: 590px;
        }
        .type {
          width: 258px;
        }
        .year {
          width: 660px;
        }
        .tags-list {
          .list-text {
            display: inline-block;
            margin-left: 8px;
          }
          .selection {
            color: $tlftcolor;
          }
        }
      }
    }
  }
  .content {
    position: absolute;
    top: 118px;
    bottom: 0;
    width: 100%;
    .scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
      .album-content {
        width: 98%;
        padding: 0 1% 1% 1%;
        .album-xq {
          .album-list {
            position: relative;
            width: 100%;
            height: 66px;
            margin-top: 10px;
            background-color: $namebgcolor;
            border-radius: 33px;
            .album-icon {
              position: absolute;
              .album-img {
                width: 66px;
                height: 66px;
                border-radius: 50%;
              }
              .circle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                background-color: $namebgcolor;
                border: 6px solid rgb(82, 82, 82);
                border-radius: 50%;
              }
            }
            .album-text {
              padding-left: 76px;
              line-height: 22px;
              white-space: nowrap;
              .album-name,
              .singer-name,
              .public-time {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .public-time {
                color: $ftcolor;
              }
            }
          }
        }

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
      }
    }
  }
}
</style>