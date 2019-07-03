
## Poster

这是一个前端 Video 视频播放截图工具。

通过 canvas 实现从video标签截取当前播放画面。

## use

```html
<script src="./libs/video.js"></script>
```

+ **window.$poster.videoScreenshot(video, time, cb(err, blob))** 视频截图，不支持跨域；time 为指定视频进度，默认为0
+ **window.$poster.getVideoDuration(url, cb(err, blob))** 获取视频时长

## 兼容性

你的浏览器需要支持`HTML5`
