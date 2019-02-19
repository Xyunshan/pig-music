import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '@/components/recommend/Recommend'
import Album from '@/components/album/Album'
import Rank from '@/components/rank/Rank'
import Singer from '@/components/singer/Singer'
import Search from '@/components/search/Search'

import AMdetail from '@/components/album/Album-detail.vue'
import STdetail from '@/components/recommend/Sheet-detail.vue'
import RKdetail from '@/components/rank/Rank-detail.vue'
import SRdetail from '@/components/singer/Singer-detail.vue'

Vue.use(Router)
export default new Router({
  routes: [
    // 默认页面
    {
      path: '/',
      redirect: '/recommend'
    },
    // 推荐
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: STdetail
      }]

    },
    // 专辑
    {
      path: '/album',
      component: Album,
      children: [{
        path: ':id',
        component: AMdetail
      }]

    },
    // 排行
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RKdetail
      }]

    },
    // 歌手
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SRdetail
      }]

    },
    // 搜索
    {
      path: '/search',
      component: Search
    }
  ]
})
