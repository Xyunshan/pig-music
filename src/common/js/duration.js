
/**
 * 音频播放时间换算
 * value - 音频当前播放时间，单位秒
 */
export default function transTime(value) {
    let time = "";
    let h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }
    return time;
}
/**
 * 格式化时间显示，补零对齐
 * eg：2:4  -->  02:04
 * value - 形如 h:m:s 的字符串 
 */
function formatTime(value) {
    let i;
    let time = "";
    let s = value.split(':');

    for (i = 0; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];
    return time;
}
