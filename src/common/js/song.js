//用于把不同的歌曲数据相同的部分格式化
class Song {
    // es6构造函数
    constructor({ mid, albumname, singer, name, duration, image, url, lrc, size }) {
        // 歌曲mid
        this.mid = mid
        // 专辑名
        this.albumname = albumname
        // 歌手
        this.singer = singer
        // 歌曲名
        this.name = name
        // 时长
        this.duration = duration
        // 专辑图
        this.image = image
        // 播放地址
        this.url = url
        // 歌词
        this.lrc = lrc
        // 大小
        this.size = size
    }
}
// 遍历所有的歌手并加入到singer
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return
    }
    singer.forEach(item => {
        ret.push(item.name)
    });
    ret = ret.join(" " + "/" + " ")
    return ret;
}
// 便利所有质量的音乐
function songSize(song) {
    let ret = []
    if (song.size128) {
        ret.push({ 标准: '&br=96' })
    }
    if (song.size320) {
        ret.push({ 高品质: '&br=128' })
    }
    if (song.sizeflac) {
        ret.push({ 无损: '&br=flac' })
    }
    if (song.sizeape) {
        ret.push({ 压缩无损: '&br=ape' })
    }

    return ret;
}
export function createSong(song) {
    return new Song({
        // 歌曲mid
        mid: song.songmid,
        // 专辑
        albumname: song.albumname,
        // 歌曲名
        name: song.songname,
        // 演唱歌手
        singer: filterSinger(song.singer),
        // 歌曲时间(毫秒)
        duration: song.interval,
        // 歌曲专辑图片
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`,
        // 播放url地址
        url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${song.songmid}`,
        //  歌词地址
        size: songSize(song),
        lrc: `https://api.bzqll.com/music/tencent/lrc?key=579621905&id=${song.songmid}`,
    })
}

