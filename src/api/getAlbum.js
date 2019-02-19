import axios from 'axios'
// 获取歌单详情 参数：地区 类型 类别 公司 年代
export function getAlbum({ area, company, genre, type, year }, page) {
    page = page || 1;
    const url = '/api/getAlbum'
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
        data: `{"albumlib":{"method":"get_album_by_tags","param":{"area":${area},"company":${company},"genre":${genre},"type":${type},"year":${year},"sort":2,"get_tags":1,"sin":${(page - 1) * 20},"num":19,"click_albumid":0},"module":"music.web_album_library"},"comm":{"ct":24,"cv":0}}`
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
// 获取专辑详情
export function getAlbumDetail(mid) {
    const url = '/api/getAlbumDetail'
    const data = Object.assign({}, {
        ct: 24,
        albummid: mid,
        g_tk: 414499070,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}