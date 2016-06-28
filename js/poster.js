/**
* 获取视频截图
* poster.js
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
  /**
  * 截取视频画面 fun
  * @param w int 可选
  * @param h int 可选
  * @return blob
  **/
  var _poster=function(w,h){
    var canvas=document.createElement('canvas');
    canvas.width=w||this.offsetWidth;//this.width会出问题
    canvas.height=h||this.offsetHeight;

    var cxt=canvas.getContext("2d");
    cxt.drawImage(this,0,0,this.offsetWidth,this.offsetHeight,0,0,canvas.width,canvas.height);
    var data=dataURLtoBlob(canvas.toDataURL());
    return data;

  }
  /**
  * 截取视频画面 fun
  * @param vobj video
  * @param call fun
  * @param w int
  * @param h int
  * @return void
  **/
  var poster=function(vobj,call,w,h){
    var info={
      info:'',
      bool:false,
      data:null
    }

    if(typeof vobj !='object'){
      info.info='传入对象不是video对象。';
      call(info);
      return;
    }
    if(vobj.nodeName.toLocaleLowerCase()!='video'){
      info.info='传入对象不是video对象。';
      call(info);
      return;
    }
    if(!vobj.getPoster)
      vobj.getPoster=_poster;
    info.data=vobj.getPoster(w,h);
    if(!info.data){
      info.info="截取出错了";
    }else{
      info.bool=true;
    }
    call(info);

  }
  window.poster=poster;

})(window);
