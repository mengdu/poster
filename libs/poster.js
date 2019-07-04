(function (root) {
  /**
   * 获取视频时长，秒
   * @param {string} src - 视频连接
   * @param {function} cb - 回调
   * **/
  function getVideoDuration (src, cb) {
    var v = document.createElement('video')
    v.src = src
    v.style.display = 'none'
  
    v.addEventListener('loadeddata', function () {
      cb && cb(null, v.duration)
      v.remove()
      v = null
    })
  
    document.body.appendChild(v)
  }

  /**
   * DataUrl 转 Blob
   * @param {string} dataurl - DataUrl
   * @return {Blob} 返回blob
   * **/
  function dataURLtoBlob (dataurl) {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  /**
   * 视频截图，由于浏览器限制，不支持跨域视频截图
   * @param {HTMLVideoElement} video - 视频标签
   * @param {number|[]} time - 指定截图视频播放位置，秒；0 表示截取当前
   * @param {number[]} size - 指定输出尺寸，默认输出原尺寸；可选
   * @param {function} cb - 回调函数，返回 [{orgSize, size, at, blob}]
   * **/
  function videoScreenshot (video, time, size, cb) {
    time = time || 0
    cb = typeof size === 'function' ? size : cb

    if (!(video instanceof HTMLVideoElement)) {
      if (typeof cb === 'function') cb(new Error('`video` 参数必须是 HTMLVideoElement 对象'), null)
      return
    }

    var canvas = document.createElement('canvas')
    var vw = video.videoWidth
    var vh = video.videoHeight
    canvas.width = vw
    canvas.height = vh
    var ctx = canvas.getContext('2d')

    var orgSize = vw + 'x' + vh
    var result = []
    var index = 0
    var isMultiple = Object.prototype.toString.call(time) === '[object Array]'
    var length = isMultiple ? time.length : 1
    var hasSize = Object.prototype.toString.call(size) === '[object Array]' && size.length >= 2
    var targetSize = hasSize ? size[0] + 'x' + size[1] : orgSize

    if (isMultiple) video.pause()

    function exec () {
      ctx.drawImage(video, 0, 0, vw, vh, 0, 0, vw, vh)
      var currentTime = video.currentTime
      var cvas = null

      // 输出指定尺寸
      if (hasSize) {
        cvas = toSize(canvas, [vw, vh], size)
      } else {
        cvas = canvas
      }

      try {
        if (cvas.toBlob) {
          cvas.toBlob(function (blob) {
            result.push({ orgSize: orgSize, size: targetSize, at: currentTime, blob: blob, })
            run(++index)
          })
        } else {
          result.push({ orgSize: orgSize, size: targetSize, at: currentTime, blob: dataURLtoBlob(cvas.toDataURL()) })
          run(++index)
        }
      } catch (err) {
        if (typeof cb === 'function') cb(err, null)
      }
      video.removeEventListener('canplay', exec, false)
    }

    function run (i) {
      index = i
      if (i >= length) {
        if (typeof cb === 'function') cb(null, result)
      } else {
        if (isMultiple) {
          try {
            video.addEventListener('canplay', exec, false)
            // 未加载完成设置时间会存在报错
            video.currentTime = time[i]
          } catch (err) {
            video.removeEventListener('canplay', exec, false)
            if (typeof cb === 'function') cb(err, null)
          }
        } else {
          exec()
        }
      }
    }

    run(0)

    return canvas
  }

  function toSize (img, orgSize, size) {
    var canvas = document.createElement('canvas')
    canvas.width = size[0]
    canvas.height = size[1]
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, orgSize[0], orgSize[1], 0, 0, size[0], size[1])

    return canvas
  }

  root.$poster = {
    getVideoDuration: getVideoDuration,
    videoScreenshot: videoScreenshot
  }

})(window)
