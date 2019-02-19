import jsonp from '@/common/js/jsonp'
import {
    options
} from './config'
import axios from 'axios'
// 歌手
export function getSinger(page) {
    page = page || 1
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, {
        g_tk: 1928093487,
        hostUin: 0,
        format: 'jsonp',
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: page,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        needNewCode: 0,
        platform: 'yqq'
    })
    return jsonp(url, data, options)
}
// 歌手详情页
export function getSingerDetail(singermid, pagenum) {
    pagenum = pagenum || 0
    const url = '/api/getSingerDetail'
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
        ct: 24,
        singermid: singermid,
        order: 'listen',
        begin: pagenum * 30,
        num: 30,
        songstatus: 1,
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}