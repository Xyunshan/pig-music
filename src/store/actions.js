import * as types from './mutation-types'
export const selectPlay = function ({commit,state}, {list,index}) {
  // 顺序列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 播放列表
  commit(types.SET_PLAYLIST, list)
  // 播放的索引
  commit(types.SET_CURRENT_INDEX, index)
  // 是否展开大播放页面
  commit(types.SET_FULL_SCREEN, true)
}
