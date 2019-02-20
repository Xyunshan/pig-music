<template >
  <div class="player" v-if="playerShow">
    <transition name="player">
      <div class="normal-player" v-show="fullScreen">
        <!-- 播放背景（高斯模糊部分） -->
        <div class="background-img">
          <img :src="currentSong.image" class="image">
          <div class="bg-mask"></div>
        </div>
        <!-- 头部标题 -->
        <div class="top">
          <!-- 返回按钮 -->
          <div class="return-btn">
            <span class="iconfont icon-icon-arrow-down" @click.stop="retract"></span>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <!-- 旋转的cd -->
        <div
          class="middle"
          @touchstart.prevent="middleTouchstart($event)"
          @touchmove.prevent="middleTouchmove($event)"
          @touchend.prevent="middleTouchend()"
        >
          <!-- cd -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="playCd">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                <p>{{playingLyric}}</p>
              </div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="lyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current':currentLineNum===index}"
                  v-for="(line,index) in lyric.lines"
                  :key="index"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 展开播放器底部 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="bar">
            <div class="time">{{progressTime}}</div>
            <div class="progress-bar" ref="pbar">
              <div class="progress" ref="progress"></div>
              <div
                class="progerss-btn-wrapper"
                ref="pbw"
                @touchstart.prevent="progerssTouchstart($event)"
                @touchmove.prevent="progerssTouchmove($event)"
                @touchend.prevent="progerssTouchend()"
              >
                <div class="progress-btn" ref="probtn"></div>
              </div>
            </div>
            <div class="time">{{totalTime}}</div>
          </div>
          <!-- 控制按钮 -->
          <div class="operators">
            <div class="play-btn" :class="disableCls">
              <!-- 切换模式 -->
              <div class="ico-left">
                <span class="mode iconfont" :class="playMode" @click="changMode"></span>
              </div>
              <!-- 上一首 -->
              <div class="icon-prev" :class="disableCls">
                <span @click="prev" class="iconfont icon-icon-5"></span>
              </div>
              <!-- 播放暂停 -->
              <div>
                <span @click.stop="togglePlaying()" class="iconfont newPlay" :class="palyIcon"></span>
              </div>
              <!-- 下一首 -->
              <div class="icon-next" :class="disableCls">
                <span @click="next" class="iconfont icon-icon-4"></span>
              </div>
              <!--  -->
              <div class="icon playlist">
                <span class="iconfont icon-icon-1" @click.stop="showPlaylist=true"></span>
              </div>
            </div>
            <div class="download">
              <div class="icon dsong">
                <span class="iconfont icon-xiazai"></span>
              </div>
              <div class="loading-w">
                <img
                  class="load"
                  v-show="!songReady"
                  src="@/common/images/loading/loading.gif"
                  width="100%"
                >
              </div>
              <div class="icon like">
                <span class="iconfont icon-xihuan"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前得播放列表 -->
        <transition name="player">
          <div class="play-list" v-show="showPlaylist">
            <h2 class="listname">播放列表</h2>
            <div class="song-list">
              <scroll :data="playList" class="playSc">
                <ul class="songs">
                  <li
                    class="song"
                    v-for="(song,index) in playList"
                    :key="song.mid"
                    :class="{actv:index===currentIndex}"
                  >
                    <div class="song-text" @click.stop="setcurrentIndex(index)">
                      <h3>{{song.name}}</h3>
                      <p>{{song.singer}}</p>
                    </div>
                    <div class="song-like">
                      <span class="iconfont icon-xihuan"></span>
                    </div>
                  </li>
                </ul>
              </scroll>
              <div class="close-list" @click.stop="showPlaylist=false">关闭</div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
    <div class="mini-player" v-show="!fullScreen" @click.stop="retract">
      <div class="min-cd" :class="playCd">
        <img class="min-img" :src="currentSong.image" width="100%">
      </div>
      <div class="min-text">
        <h3 class="min-title">{{currentSong.name}}</h3>
        <p class="play-lrc">{{playingLyric}}</p>
      </div>
      <div class="play-btn">
        <span @click.stop="togglePlaying()" class="iconfont newPlay" :class="palyIcon"></span>
      </div>
    </div>
    <!-- @canplay 能播放时 @error 歌曲发生错误时  @canplay="ready" @error="playerror"-->
    <!-- 播放器 -->
    <audio
      ref="audio"
      autoplay="autoplay"
      :src="playUrl"
      @canplay="ready()"
      @error="playerror()"
      @ended="playover()"
      @timeupdate="setProgressTime()"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getSongUrl, getLyric } from "@/api/getSongUrl.js";
import transTime from "@/common/js/duration.js";
import Scroll from "@/bese/scroll.vue";
import { playMode } from "@/common/js/confing.js";
import { prefixStyle } from "@/common/js/dom.js";
// 处理编码
import { Base64 } from "js-base64";
// 歌词解析
import Lyric from "lyric-parser";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  // 计算属性
  computed: {
    // 播放图标模式切换
    playMode() {
      return this.mode === playMode.sequence
        ? "icon-icon-8"
        : this.mode === playMode.loop
        ? "icon-icon-7"
        : "icon-icon-10";
    },
    // 控制播放按钮
    palyIcon() {
      return this.playing ? "icon-icon-6" : "icon-icon-3";
    },
    // 控制cd转动
    playCd() {
      return this.playing && this.songReady ? "play" : "play pause";
    },
    // 当没有加载完成时
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    // 进度的时间
    progressTime() {
      return transTime(this.currentTime);
    },
    // 歌曲总时间
    totalTime() {
      return transTime(this.currentSong.duration);
    },
    // 进度条比例
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    // 获取
    ...mapGetters([
      "fullScreen", //是否全屏
      "playList", //播放列表
      "currentSong", //播放的歌曲
      "playing", //播放暂停
      "currentIndex", //播放列表索引
      "mode",
      "playerShow"
    ])
  },
  data() {
    return {
      playUrl: null,
      lyric: null,
      currentTime: 0,
      songReady: false,
      // 歌词所在的行
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: "",
      showPlaylist: false
    };
  },
  // 周期函数
  created() {
    this.touch = {};
    this.touchM = {};
    console.log(this.playList);
  },
  methods: {
    // 进度条移动端事件方法
    progerssTouchstart(e) {
      this.touch.initiated = true;
      this.touch.pwdWidth = this.$refs.pbw.clientWidth;
      // 第一个手指相对于整个屏幕的位置
      this.touch.startX = e.touches[0].pageX;
      const offsetWidth = this.touch.startX - this.$refs.pbar.offsetLeft;
      this._offset(offsetWidth);
      this.touch.left = this.$refs.progress.clientWidth;
      this.currentTime = parseInt(
        (offsetWidth / this.touch.pwdWidth) * this.currentSong.duration
      );
    },
    progerssTouchmove(e) {
      if (!this.touch.initiated) {
        return;
      }
      // 计算移动的距离
      const deltaX = e.touches[0].pageX - this.touch.startX;
      // 返回较大的数
      const offsetWidth = Math.min(
        this.touch.pwdWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this.currentTime =
        (offsetWidth / this.touch.pwdWidth) * this.currentSong.duration;
      this._offset(offsetWidth);
      if (this.lyric) {
        this.lyric.seek(this.currentTime * 1000);
      }
    },
    progerssTouchend() {
      this.touch.initiated = false;
      this.$refs.audio.currentTime = this.currentTime;
      // if (this.lyric) {
      //   this.lyric.seek(this.currentTime * 1000);
      // }
    },
    // 设置进度条
    _offset(offsetWidth) {
      this.$refs.probtn.style.left = `${offsetWidth - 5}px`;
      this.$refs.progress.style.width = `${offsetWidth}px`;
    },
    setProgressTime() {
      const audio = this.$refs.audio;
      const offsetWidth = `${this.$refs.pbw.clientWidth * this.percent}`;
      // 如果初始化了initiated就不设置进度条
      if (!this.touch.initiated && this.songReady) {
        // 防止事件再次改变进度条造成闪动
        this.currentTime = audio.currentTime;
      }
      this._offset(offsetWidth);
      if (this.lyric) {
        this.lyric.seek(this.currentTime * 1000);
      }
    },
    // 切换cd和歌词页面
    middleTouchstart(e) {
      this.touchM.initiated = true;
      // 记录第一根手指
      const touch0 = e.touches[0];
      this.touchM.startX = touch0.pageX;
      this.touchM.startY = touch0.pageY;
    },
    middleTouchmove(e) {
      if (!this.touchM.initiated) {
        return;
      }
      const touch0 = e.touches[0];
      const deltaX = touch0.pageX - this.touchM.startX;
      const deltaY = touch0.pageY - this.touchM.startY;
      if (Math.abs(deltaY) > Math.abs(deltaY)) {
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touchM.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = "0ms";
      this.$refs.middleL.style.opacity = 1 - this.touchM.percent;
      this.$refs.middleL.style[transitionDuration] = "0ms";
    },
    middleTouchend() {
      this.touchM.initiated = false;
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touchM.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touchM.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `300ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `300ms`;
    },
    // 切换全屏
    retract() {
      this.setfull(!this.fullScreen);
    },
    // 歌曲可以播放时
    ready() {
      this.setplaying(true);
      this.songReady = true;
    },
    // 播放完成时
    playover() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 播放错误
    playerror() {
      this.songReady = true;
      this.next();
    },
    // 切换播放模式
    changMode() {
      const mode = (this.mode + 1) % 3;
      this.setplayMode(mode);
    },
    prev() {
      // 歌曲可以播放时
      if (!this.songReady) {
        return;
      }
      if (this.mode === playMode.random) {
        // 随机播放
        this.setcurrentIndex(Math.floor(Math.random() * this.playList.length));
      } else {
        if (this.currentIndex === 0) {
          this.setcurrentIndex(this.playList.length - 1);
        } else {
          this.setcurrentIndex(this.currentIndex - 1);
        }
      }
    },
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.mode === playMode.random) {
        // 随机播放
        this.setcurrentIndex(Math.floor(Math.random() * this.playList.length));
      } else {
        // 列表循环
        if (this.currentIndex === this.playList.length - 1) {
          this.setcurrentIndex(0);
        } else {
          this.setcurrentIndex(this.currentIndex + 1);
        }
      }

      console.log("下一首");
    },
    // 循环播放
    loop() {
      if (this.lyric) {
        this.lyric.seek(0);
      }
      const audio = this.$refs.audio;
      audio.currentTime = 0;
      audio.play();
    },
    togglePlaying() {
      this.songReady ? this.setplaying(!this.playing) : this.setplaying(false);
      if (this.lyric) {
        this.lyric.togglePlay();
      }
    },
    // 获取播放地址
    getSongUrl() {
      getSongUrl(this.currentSong.mid).then(res => {
        this.playUrl = `${res.req_0.data.sip[1]}${
          res.req_0.data.midurlinfo[0].purl
        }`;
      });
    },
    // 获取歌词
    getLyric() {
      getLyric(this.currentSong.mid).then(res => {
        this.lyric = new Lyric(Base64.decode(res.lyric), this.handleLyric);
      });
    },
    // 监听播放歌词的回调函数
    handleLyric({ lineNum, txt }) {
      // 当前播放到第几行  和内容
      const lyricList = this.$refs.lyricList;
      this.currentLineNum = lineNum;
      if (lineNum > 6) {
        let lineEl = this.$refs.lyricLine[lineNum - 6];
        lyricList.scrollToElement(lineEl, 600);
      } else {
        lyricList.scrollTo(0, 0, 600);
      }
      this.playingLyric = txt;
    },
    // 设置
    ...mapMutations({
      // 是否全屏
      setfull: "SET_FULL_SCREEN",
      // 是否播放
      setplaying: "SET_PLAYING_STATE",
      // 播放第几首歌
      setcurrentIndex: "SET_CURRENT_INDEX",
      setplayMode: "SET_PLAY_MODE"
    })
  },
  components: {
    Scroll
  },
  watch: {
    currentSong() {
      if (this.lyric) {
        this.lyric.stop();
      }
      this.currentTime = 0;
      setTimeout(() => {
        this.getSongUrl();
      }, 100);
      this.getLyric();
      this.setplaying(false);
      this.songReady = false;
    },
    // 监听播放暂停
    playing(newPlaying) {
      const audio = this.$refs.audio;
      newPlaying ? audio.play() : audio.pause();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/scss/initstyle.scss";
.player {
  height: 100%;
  width: 100%;
  .normal-player {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: $bgcolor;
    .top {
      position: relative;
      width: 100%;
      height: 56px;

      .return-btn {
        position: absolute;
        color: $selection;
        .icon-icon-arrow-down {
          line-height: 36px;
          font-size: 24px;
        }
      }
      .title {
        width: 80%;
        height: 36px;
        margin: 0 auto;
        font-weight: normal;
        font-size: 14px;
        line-height: 36px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .subtitle {
        width: 100%;
        height: 20px;
        font-weight: normal;
        font-size: 13px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .play-list {
      position: absolute;
      top: 56px;
      width: 100%;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      .close-list,
      .listname {
        font-size: 14px;
        height: 30px;
        width: 100%;
        text-align: center;
        line-height: 30px;
        background-color: $namebgcolor;
      }
      .close-list {
        height: 30px;
        width: 100%;
      }
      .song-list {
        position: absolute;
        top: 30px;
        width: 100%;
        bottom: 30px;
        .playSc {
          // background-color: seagreen;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        .songs {
          .song {
            display: flex;
            justify-content: space-between;
            margin: 10px;
            height: 50px;
            line-height: 25px;
            background-color: $hbgcolor;
            border-radius: 10px;
            .song-text {
              width: 100%;
              h3,
              p {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              h3 {
                font-weight: normal;
                font-size: 14px;
              }
            }
            .song-like {
              color: white;
              .icon-xihuan {
                font-size: 24px;
                line-height: 50px;
              }
            }
          }
          .actv {
            color: $tlftcolor;
          }
        }
      }
    }
  }
  // 中间部分
  .middle {
    position: fixed;
    top: 56px;
    width: 100%;
    bottom: 120px;
    white-space: nowrap;
    font-size: 0;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      max-height: 540px;
      .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 5%;
        width: 80%;
        height: 100%;

        .cd {
          width: 100%;
          height: 100%;

          box-sizing: border-box;
          border: 8px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          .image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 60px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          // color: $tc;
        }
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 32px;
          font-size: 14px;
        }
        .current {
          color: $tlftcolor;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    height: 120px;
    width: 100%;
    bottom: 0;
    .dot-wrapper {
      width: 100%;
      height: 20px;
      display: flex;
      justify-content: center;
      .dot {
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: $ftcolor;
        margin: 6px 4px;
      }
      .active {
        width: 20px;
        background-color: $selection;
      }
    }
    .bar {
      display: flex;
      justify-content: space-around;
      height: 30px;
      width: 100%;
      .time {
        height: 18px;
        width: 10%;
        text-align: center;
        line-height: 18px;
        font-size: 0.2rem;
      }
      .progress-bar {
        position: relative;
        width: 78%;
        height: 18px;
        background-color: springgreens;
        margin: 0 auto;
        .progress {
          width: 0;
          height: 4px;
          background-color: seagreen;
          margin-top: 7px;
        }
        .progerss-btn-wrapper {
          position: absolute;
          top: 7px;
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.2);
          .progress-btn {
            width: 10px;
            height: 10px;
            top: -3px;
            left: -5px;
            border-radius: 50%;
            background-color: #fff;
            position: absolute;
          }
        }
      }
    }
    .operators {
      position: relative;
      height: 70px;
      width: 100%;
      // 控制播放放按钮的颜色
      .play-btn {
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 40px;
        line-height: 40px;
        .icon-icon-5,
        .icon-icon-4 {
          font-size: 30px;
        }
        .disable {
          color: rgb(189, 189, 189);
        }
        .newPlay {
          font-size: 40px;
        }
        .mode,
        .icon-icon-1 {
          font-size: 24px;
        }
      }
      .download {
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-around;
        .icon-xihuan,
        .icon-xiazai {
          font-size: 18px;
        }
        .loading-w {
          margin-top: 3px;
          width: 24px;
        }
      }
    }
  }
  // 高斯模糊背景
  .background-img {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: -100;
    -webkit-filter: blur(20px); /* Chrome, Opera */
    -moz-filter: blur(20px);
    -ms-filter: blur(20px);
    filter: blur(20px);
    // 高斯模糊背景层遮罩
    .bg-mask {
      position: absolute;
      top: 0;
      width: 100%;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
    .image {
      width: 100%;
      height: 100%;
      filter: blur(20px);
    }
  }
  .mini-player {
    position: fixed;
    display: flex;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: $hbgcolor;
    .play-btn {
      position: absolute;
      right: 0;
      width: 58px;
      height: 60px;
      line-height: 60px;
      .newPlay {
        font-size: 40px;
      }
    }
    .min-text {
      position: absolute;
      top: 0;
      left: 68px;
      right: 68px;
      line-height: 26px;
      .play-lrc,
      .min-title {
        width: 100%;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .min-title {
        font-size: 13px;
      }
      .play-lrc {
        font-size: 12px;
        color: $ftcolor;
      }
    }
    .min-cd {
      margin-top: 6px;
      margin-left: 10px;
      width: 48px;
      height: 48px;
      .min-img {
        border-radius: 50%;
      }
    }
  }
  // cd旋转动画
  .play {
    animation: rotate 20s linear infinite;
  }
  .pause {
    animation-play-state: paused;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  // 大小播放器切换
  .player-enter-active,
  .player-leave-active {
    transition: all 0.3s;
  }
  .player-enter,
  .player-leave-to {
    transform: translate3d(0, 100%, 0);
  }
}
</style>


