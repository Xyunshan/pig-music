import axios from 'axios'
// 获取歌单详情
export function getSongsheetDetail(id) {
    const url = '/api/getSheetList'
    const data = Object.assign({}, {
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: id,
        g_tk: 1115842090,
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
