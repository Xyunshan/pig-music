
import { playMode } from '@/common/js/confing'
// import { playMode } from '../common/js/confing';

const state = {
    // // 歌单
    // songSheet: {},
    // // 歌手
    // singer: {},

    // 详情数据页面
    dedail: {},
    // 播放暂停
    playing: false,
    // 全屏缩放
    fullScreen: false,
    // 播放列表
    playList: [],
    // 顺序列表
    sequenceList: [],
    // 播放模式
    mode: playMode.sequence,
    // 播放索引
    currentIndex: -1
}
export default state