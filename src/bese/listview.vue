<template>
  <div class="listview">
    <scroll
      ref="listview"
      class="scroll"
      :probeType="3"
      :listenScroll="listenScroll"
      @scroll="scroll"
    >
      <!-- 歌手列表 -->
      <ul class="singer-list">
        <!-- 每一个块儿类别 -->
        <li class="singer-title" v-for="group in singerList" :key="group.title" ref="listGp">
          <h3 class="title">{{group.title}}</h3>
          <ul>
            <!-- 每一个歌手 -->
            <li
              class="singer"
              v-for="item in group.items"
              :key="item.id"
              @click="selectDetail(item)"
            >
              <div class="singer-icon">
                <img v-lazy="item.image" width="100%">
              </div>
              <h3 class="singer-name">
                <span>{{item.name}}</span>
                <span class="b-name">{{item.aliasname}}</span>
              </h3>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="list-shortcut" @touchstart="onShort($event)" @touchmove.stop="onShortMove($event)">
      <ul class="list-index">
        <li
          :class="{active:index==currentIndex}"
          class="item"
          v-for="(short,index) in shortcutList"
          :key="short"
          :data-index="index"
        >{{short}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY<0">
      <h3 class="fixed-title">{{fixedTitle}}</h3>
    </div>
  </div>
</template>
<script>
import Scroll from "@/bese/scroll.vue";
import { mapGetters, mapMutations } from "vuex";
import { createSinger } from "@/common/js/dedail.js";
const ANCHOR_HEIGT = 20;
const TITLE_HEIGHT = 20;
export default {
  created() {
    this.touch = {};
    this.listenScroll = true;
  },
  props: {
    singerList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    };
  },
  // 计算属性
  computed: {
    shortcutList() {
      return this.singerList.map(item => {
        return item.title;
      });
    },
    fixedTitle() {
      return this.shortcutList[this.currentIndex];
    }
  },
  methods: {
    onShort(e) {
      let anchorIndex = e.target.getAttribute("data-index");
      // 获取点击时的位置
      this.touch.y1 = e.touches[0].pageY;
      this.touch.anchorIndex = anchorIndex;
      this.$refs.listview.scrollToElement(this.$refs.listGp[anchorIndex], 0);
    },
    onShortMove(e) {
      this.touch.y2 = e.touches[0].pageY;
      // 计算偏移量偏移了几个高度
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this.$refs.listview.scrollToElement(this.$refs.listGp[anchorIndex], 0);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 计算每个高度
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGp;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.offsetHeight;
        this.listHeight.push(height);
      }
    },
    selectDetail(list) {
      // 修改路由
      this.$router.push({ path: `/singer/${list.id}` });
      // 把处理后的数据传入全局
      this.setDedail(createSinger(list));
    },
    // 映射
    ...mapMutations({
      // 映射vuex中的SET_SONG_SHEET
      setDedail: "SET_DEDAIL"
    })
  },
  components: {
    Scroll
  },
  watch: {
    singerList() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.listview {
  position: fixed;
  top: 66px;
  bottom: 0;
  width: 100%;
  background-color: $bgcolor;
  .scroll {
    height: 100%;
    overflow: hidden;
  }
  .singer-list {
    width: 100%;
    .title {
      width: 100%;
      height: 20px;
      padding-left: 10px;
      font-size: 14px;
      line-height: 20px;
      background-color: $hbgcolor;
    }
    .singer {
      position: relative;
      padding: 5px 2%;
      width: 96%;
      height: 66px;
      .singer-icon {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        overflow: hidden;
      }
      .singer-name {
        position: absolute;
        top: 5px;
        left: 2%;
        right: 2%;
        height: 66px;
        font-weight: normal;
        padding-left: 76px;
        font-size: 14px;
        line-height: 30px;
        span {
          width: 96%;
          display: block;
          margin: 0.16rem;
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
        .b-name {
          color: $ftcolor;
        }
      }
    }
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 2px;
    transform: translateY(-50%);
    width: 18px;
    padding: 10px 0;
    text-align: center;
    border-radius: 10px;
    background-color: $tabbgcolor;
    .item {
      overflow: hidden;
      height: 20px;
      line-height: 20px;
      font-size: 13px;
    }
    .active {
      color: $tlftcolor;
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    width: 100%;
    height: 20px;
    padding-left: 10px;
    font-size: 14px;
    line-height: 20px;
    background-color: $hbgcolor;
    .fixed-title {
      color: $tlftcolor;
      font-size: 14px;
    }
  }
}
</style>

