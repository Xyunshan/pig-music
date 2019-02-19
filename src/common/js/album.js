// 处理专辑数据
class Album {
    constructor({ album_id, album_mid, album_name, album_singer, public_time, album_img }) {
        // 请求时需要的参数
        this.album_id = album_id
        // 
        this.album_mid = album_mid
        // 标题名
        this.album_name = album_name
        // 专辑歌手
        this.album_singer = album_singer
        // 发售时间
        this.public_time = public_time
        // 背景图
        this.album_img = album_img
    }
}
// 遍历所有的歌手并加入到singer
function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return
    }
    singer.forEach(item => {
        ret.push(item.singer_name)
    });
    ret = ret.join(" " + "/" + " ")
    return ret;
}
export function createAlbum(album) {
    return new Album({
        album_id: album.album_id,
        album_mid: album.album_mid,
        album_name: album.album_name,
        album_singer: filterSinger(album.singers),
        public_time: album.public_time,
        album_img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${album.album_mid}.jpg?max_age=2592000`,
    })
}
