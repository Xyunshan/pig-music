import jsonp from '@/common/js/jsonp'
import {
    options
} from './config'
// 手机版轮播图数据
export function getSlider() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, {
        g_tk: 5381,
        uin: 0,
        format: 'jsonp',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url, data, options)
}
// 推荐歌单
export function getSongSheet() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    const data = Object.assign({}, {
        g_tk: 2058509057,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: '{"comm":{"ct":24},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"}}'
    })
    return jsonp(url, data)
}
// 新歌推荐 songType :1 新歌 2港台 3欧美 4日本 5韩国
export function getNewsong(songType) {
    songType = songType || 1;
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
    const data = Object.assign({}, {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: '{"comm":{"ct":24},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":' + songType + '}}}'
    })
    return jsonp(url, data)
}

