// 对歌单和歌手数据进行处理统一
class Dedail {
    constructor({ id, name, image }) {
        // 请求时需要的参数
        this.id = id
        // 标题名
        this.name = name
        // 背景图
        this.image = image
    }
}
// 歌单详情数据
export function createSheet(dedail) {
    return new Dedail({
        id: dedail.content_id,
        name: dedail.title,
        image: dedail.cover
    })
}
// 专辑
export function createAlbumlist(dedail) {
    return new Dedail({
        id: dedail.album_mid,
        name: dedail.album_name,
        image: dedail.album_img
    })
}
// 歌手。。。。
export function createSinger(dedail) {
    return new Dedail({
        id: dedail.id,
        name: dedail.name,
        image: dedail.image
    })
}
// 排行榜。。。。。
export function createRank(dedail) {
    return new Dedail({
        id: dedail.id,
        name: dedail.topTitle,
        image: dedail.picUrl
    })
}