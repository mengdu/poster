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
   * @param {number} time - 指定截图视频播放位置，秒；默认 0，截图当前播放位置
   * @param {function} cb - 回调函数，返回 Blob
   * **/
  function videoScreenshot (video, time, cb) {
    time = time || 0
    var canvas = document.createElement('canvas')
    var width = video.videoWidth
    var height = video.videoHeight
    canvas.width = width
    canvas.height = height
    var ctx = canvas.getContext('2d')

    function run () {
      ctx.drawImage(video, 0, 0, width, height, 0, 0, width, height)

      try {
        if (canvas.toBlob) {
          canvas.toBlob(function (blob) {
            if (typeof cb === 'function') cb(null, blob)
          })
        } else {
          if (typeof cb === 'function') cb(null, dataURLtoBlob(canvas.toDataURL()))
        }
      } catch (err) {
        cb(err, null)
      }
      video.removeEventListener('canplay', run, false)
    }

    if (time > 0) {
      video.addEventListener('canplay', run, false)
      video.currentTime = time
    } else {
      run()
    }

    return canvas
  }

  root.$poster = {
    getVideoDuration: getVideoDuration,
    videoScreenshot: videoScreenshot
  }

})(window)
