/**
* 扩展video标签方法，获取视频截图
* extendvideo.js
* @author lanyue
* @time 2016-04-24
**/

;(function(window){
  function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
  }
  function on(target,eventstr,callback){
		//console.log(typeof target);
		if(typeof target !== "object"){
			return;
		}
		if(document.all){
			target.attachEvent("on"+eventstr,callback);
		}else{
			target.addEventListener(eventstr,callback,false);
		}
	}
  /**
  * 截取视频画面 fun
  * @param w int 可选
  * @param h int 可选
  * @return blob
  **/
  var poster=function(w,h){
    var canvas=document.createElement('canvas');
    canvas.width=w||this.offsetWidth;//this.width会出问题
    canvas.height=h||this.offsetHeight;
    var cxt=canvas.getContext("2d");
    cxt.drawImage(this,0,0,this.offsetWidth,this.offsetHeight,0,0,canvas.width,canvas.height);
    var data=dataURLtoBlob(canvas.toDataURL());
    return data;

  }
  on(window,'load',function(){
    if(!!document.createElement('video').canPlayType){
      //如果支持video
      var videos=document.getElementsByTagName('video');

      for(var i=0;i<videos.length;i++){
        //遍历绑定到video
        videos[i]['getPoster']=poster;
      }
    }

  });

})(window);
