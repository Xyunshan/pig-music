<template>
  <div class="singer">
    <div class="content">
      <listview :singerList="singerList"></listview>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { getSinger } from "@/api/getSinger.js";
import { createSinger } from "@/common/js/singer.js";
import Listview from "@/bese/listview";
// 定义常量
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  created() {
    this._getSinger();
  },

  data() {
    return {
      singerList: []
    };
  },
  methods: {
    _getSinger() {
      getSinger().then(res => {
        if (res.code === 0) {
          this.singerList = this.normalizeSinger(res.data.list);
        }
      });
    },
    // 重新处理我们的数据
    normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(createSinger(item));
        }
        const key = item.Findex;
        // 如果不存在则创建它
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(createSinger(item));
      });
      // 为了得到有序列表处理列表
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      // 排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    }
  },
  components: {
    Listview
  }
};
</script>
<style lang="scss" scoped>
</style>