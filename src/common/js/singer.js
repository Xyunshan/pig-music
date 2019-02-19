// 提取有用的歌手数据
class Singer {
    constructor({ id, name, aliasname, image }) {
        // 请求时需要的参数
        this.id = id
        // 标题名
        this.name = name
        // 别名
        this.aliasname = aliasname
        // 背景图
        this.image = image
    }
}
export function createSinger(singer) {
    return new Singer({
        id: singer.Fsinger_mid,
        name: singer.Fsinger_name,
        aliasname: singer.Fother_name,
        image: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${
            singer.Fsinger_mid
            }.jpg?max_age=2592000`
    })
}