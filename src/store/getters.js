// // 抛出歌单数据
// export const songSheet = state => state.songSheet
// // 抛出歌手数据
// export const singer = state => state.singer


// 抛出详情
export const dedail = state => state.dedail
// 抛出播放状态
export const playing = state => state.playing
// 抛出全屏还是播放的状态
export const fullScreen = state => state.fullScreen
// 抛出播放列表
export const playList = state => state.playList
// 抛出顺序列表
export const sequenceList = state => state.sequenceList
// 抛出播放模式（随机，顺序，单曲循环）
export const mode = state => state.mode
// 播放歌曲的索引
export const currentIndex = state => state.currentIndex
// 播放的歌曲
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}
export const playerShow = (state) => {
    if (state.playList.length > 0) {
        return true;
    } else {
        false;
    }
}

