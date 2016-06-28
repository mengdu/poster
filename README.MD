
## 视频截图工具

poster是一个专门为视频截图的小工具。
可以在预览视频的时候选择一个适合的界面把它截取下来，并存成图片。

## 使用

### 简单使用
主要文件：
```
<script src="poster.js"></script>
```
在视频预览界面调用：

```
poster($('video')[0],function(e){
  //console.log(e);
  if(e.bool){
    //输出文件对象
    var blob=e.data;//返回的是blob对象
    console.log(blob);
    p.src=window.URL.createObjectURL(e.data);//创建一个临时预览路径
  }

});
```

### 使用extendvideo.js
`extendvideo.js`与`poster.js`不同的是前者会在引入它的页面里每个`video`标签里增加一个`getPoster()`方法
。

用法：
```
var blob=$('video')[0].getPoster();//返回图片blob对象
```


## 原理
此视频截图工具，采用了canvas绘图函数实现video图片截取，产生base64编码图片信息，再通过转blob。

## 兼容性

你的浏览器需要支持`HTML5`
