/**
 * Created by junyi on 2018/3/19.
 */
/**
 * 此方法设置了移动端页面的meta,rem的字体大小等
 */
!function(win, lib){
      var timer, doc = win.document, docElem = doc.documentElement, vpMeta = doc.querySelector( 'meta[name="viewport"]' ), flexMeta = doc.querySelector( 'meta[name="flexible"]' ), dpr = 0, scale = 0, flexible = lib.flexible || (lib.flexible = {});
      // 若html页面上已经设置了meta标签,则会取当前已设置的meta的内容,来动态的得到scale和dpr两个参数
      if( vpMeta ){
            console.warn( "将根据已有的meta标签来设置缩放比例" );
            var initial = vpMeta.getAttribute( "content" ).match( /initial\-scale=([\d\.]+)/ );
            if( initial ){
                  scale = parseFloat( initial[1] ); // 已设置的 initialScale
                  dpr = parseInt( 1 / scale );      // 设备像素比 devicePixelRatio
            }
      }
      // 如果设置了 flexible Meta标签,则获取已经设置的scale和dpr
      else if( flexMeta ){
            var flexMetaContent = flexMeta.getAttribute( "content" );
            if( flexMetaContent ){
                  var initial = flexMetaContent.match( /initial\-dpr=([\d\.]+)/ ), maximum = flexMetaContent.match( /maximum\-dpr=([\d\.]+)/ );
                  if( initial ){
                        dpr = parseFloat( initial[1] );
                        scale = parseFloat( (1 / dpr).toFixed( 2 ) );
                  }
                  if( maximum ){
                        dpr = parseFloat( maximum[1] );
                        scale = parseFloat( (1 / dpr).toFixed( 2 ) );
                  }
            }
      }
      // ----------------------------------------我是分割线----------------------------------------------------
      //  如果html页面上并未设置meta标签也没设置flexMeta,则或动态的创建meta标签并插入到页面上
      if( !dpr && !scale ){
            // 匹配系统
            var u = (win.navigator.appVersion.match( /android/gi ), win.navigator.appVersion.match( /iphone/gi )), _dpr = win.devicePixelRatio;
            // 所以这里似乎是将所有 Android 设备都设置为 1 了
            dpr = u ? ( (_dpr >= 3 && (!dpr || dpr >= 3)) ? 3 : (_dpr >= 2 && (!dpr || dpr >= 2)) ? 2 : 1
            ) : 1;
            scale = 1 / dpr;
            // 注:依天猫为例,貌似所有设备的dpr都设置为1了,所有这个获取dpr的方式可默认设置为1
      }
      docElem.setAttribute( "data-dpr", dpr );
      // 动态插入已经生成好的meta
      if( !vpMeta ){
            vpMeta = doc.createElement( "meta" );
            vpMeta.setAttribute( "name", "viewport" );
            vpMeta.setAttribute( "content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no" );
            if( docElem.firstElementChild ){
                  docElem.firstElementChild.appendChild( vpMeta )
            }else{
                  var div = doc.createElement( "div" );
                  div.appendChild( vpMeta );
                  doc.write( div.innerHTML );
            }
      }
      // 设置rem根字体大小
      function setFontSize(){
            var winWidth = docElem.getBoundingClientRect().width;
            if( winWidth / dpr > 540 ){
                  (winWidth = 540 * dpr);
            }
            // 根节点 fontSize 根据宽度决定
            var baseSize = winWidth / 10;
            docElem.style.fontSize = baseSize + "px";
            flexible.rem = win.rem = baseSize;
      }
      
      // 调整窗口时重置rem根字体大小
      win.addEventListener( "resize", function(){
            clearTimeout( timer );
            timer = setTimeout( setFontSize, 300 );
      }, false );
      // orientationchange 时也需要重新计算 也就是视图方向变化的时候
      win.addEventListener( "orientationchange", function(){
            clearTimeout( timer );
            timer = setTimeout( setFontSize, 300 );
      }, false );
      //监听"pageShow"事件,判断是否是来自于缓存,如果是从缓存加载的,则重新计算fontSize
      win.addEventListener( "pageshow", function(e){
            // pageShow事件每次都会加载,不论是否来着缓存
            // e.persisted为true,即是从缓存加载
            if( e.persisted ){
                  clearTimeout( timer );
                  timer = setTimeout( setFontSize, 300 );
            }
      }, false );
      // 判断当页面DOM加载完成时设置基准字体
      // IE 判断方式,因为IE不支持DOMContentLoaded
      if( "complete" === doc.readyState ){
            doc.body.style.fontSize = 12 * dpr + "px";
      }else{
            //除IE外大部分浏览器都支持该事件,当dom解析完成时就可以调用。
            doc.addEventListener( "DOMContentLoaded", function(){
                  doc.body.style.fontSize = 12 * dpr + "px";
            }, false );
      }
      setFontSize();
      flexible.dpr = win.dpr = dpr;
      flexible.refreshRem = setFontSize;
      flexible.rem2px = function(d){
            var c = parseFloat( d ) * this.rem;
            if( "string" == typeof d && d.match( /rem$/ ) ){
                  c += "px";
            }
            return c;
      };
      flexible.px2rem = function(d){
            var c = parseFloat( d ) / this.rem;
            if( "string" == typeof d && d.match( /px$/ ) ){
                  c += "rem";
            }
            return c;
      };
}( window, window.lib || (window.lib = {}) );
