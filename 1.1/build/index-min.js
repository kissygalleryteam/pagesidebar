/*! pagesidebar - v1.1 - 2013-08-12 6:56:02 PM
* Copyright (c) 2013 舒克; Licensed  */
KISSY.add("gallery/pagesidebar/1.1/index",function(a,b){function c(a){var b=this;c.superclass.constructor.call(b,a),this.initializer()}var d=b.all,e=window,f=a.DOM,g=6===a.UA.ie;return a.extend(c,a.Base,{initializer:function(){return this.node=this.get("node"),this.node?(this._parseHtmlToNavigators(this.node,this.get("navItemSelector")),this.setNavigatorsTop(this.get("navigators")),this.renderUI(),this.bindUI(),void 0):(a.log("\u521d\u59cb\u5316\u5931\u8d25\uff1a\u6ca1\u6709\u6307\u5b9a\u5bfc\u822a\u6761\u6240\u5728\u8282\u70b9"),void 0)},renderUI:function(){},bindUI:function(){this.node.delegate("click",this.get("navItemSelector"),this._clickNavigatorHandler,this),a.one(e).on("scroll",a.buffer(this._scrollHandler,this.get("interval"),this)),this.on("afterActiveNavigatorChange",function(a){a.prevVal&&a.prevVal.srcNode.removeClass("selected"),a.newVal.srcNode&&a.newVal.srcNode.addClass("selected")},this),this.on("afterVisibleChange",function(a){a.newVal?this.node.show():this.node.hide()},this)},_clickNavigatorHandler:function(b){var c=this;b.preventDefault();var d=a.one(b.currentTarget);this.clickedNavigator=d.data("navigator"),setTimeout(function(){c.clickedNavigator=null},this.get("duration")+200),this.scrollTo(d.data("navigator"))},_scrollHandler:function(){var a=this.get("threshold");a>0?this.set("visible",f.scrollTop()>a):this.set("visible",!0),this.get("enableAutoSelect")&&this._checkRegion(),g&&(this.node[0].className=this.node[0].className)},_checkRegion:function(){for(var b=this.get("navigators"),d=c.viewportRegion(),e=[],f=null,g=0,h=b.length;h>g;g++){var i=b[g].scrollTo.to;i instanceof a.NodeList&&(i.data("region",c.region(i)),c.inRegion(i.data("region"),d)&&(b[g].intersectRegion=c.intersect(i.data("region"),d),e.push(b[g])))}if(e.length>0){if(e.sort(function(a,b){return b.intersectRegion.height-a.intersectRegion.height}),f=e[0],null!==this.clickedNavigator)for(g=0,h=e.length;h>g;g++)e[g]===this.clickedNavigator&&(f=this.clickedNavigator);this.set("activeNavigator",f)}},setNavigatorsTop:function(b){a.each(b,function(a){a.top=this._getTop(a.scrollTo.to)+a.scrollTo.threshold},this)},scrollTo:function(a){var b=this;d(e).stop(),this.fire("scrolling",{scrolling:!0,data:a});var c=this._getTop(a.scrollTo.to)+a.scrollTo.threshold;a.top=c,d(e).animate({scrollTop:c},this.get("duration")/1e3,this.get("easing"),function(){b.fire("scrolling",{scrolling:!1,data:a})})},_parseHtmlToNavigators:function(b,c){var d=[];b.all(c).each(function(b){var c,e={},f=/#[\d\D]*/gi.exec(b.attr("href")),g=f.length>0&&a.one(f[0])||null;if(b.hasAttr("data-navigator"))try{c=a.JSON.parse(b.attr("data-navigator"))}catch(h){c={}}else c={};a.log(c),c=a.mix({threshold:0,to:0},c,void 0,void 0,!0),g&&(c.to=g),e={srcNode:b,scrollTo:c},d.push(e),b.data("navigator",e)}),this.set("navigators",this.get("navigators").concat(d))},_getTop:function(b){switch(!0){case a.isNumber(b):return b;case a.isString(b):var c=a.one(b);if(c)return c.offset().top;a.log("\u6ca1\u6709\u627e\u5230\u5bf9\u5e94\u8282\u70b9");break;case b instanceof a.NodeList:return b.offset().top}},_setThreshold:function(b){return a.isString(b)&&a.one(b)?a.one("val"):a.isNumber(b)?b:0}},{region:function(a){var b=a.offset(),c=a.outerWidth(),d=a.outerHeight();return{left:b.left,top:b.top,right:b.left+c,bottom:b.top+d,width:c,height:d}},viewportRegion:function(){var a=f.scrollLeft(),b=f.scrollTop(),c=f.viewportWidth(),d=f.viewportHeight();return{left:a,top:b,right:a+c,bottom:b+d,width:c,height:d}},inRegion:function(a,b,c){c=c||!1;var d=!0,e=!0;c&&(d=a.right<=b.right&&a.left>=b.left,e=a.bottom<=b.bottom&&a.top>=b.top);var f=(a.top>=b.top&&a.top<=b.bottom||a.top<=b.top&&a.bottom>=b.top)&&d,g=(a.left>=b.left&&b.left<=b.right||a.left<=b.left&&a.right>=b.left)&&e;return f&&g},intersect:function(a,b){var c=Math.max(a.left,b.left),d=Math.min(a.right,b.right),e=Math.max(a.top,b.top),f=Math.min(a.bottom,b.bottom);return{left:c,top:e,right:d,bottom:f,width:d-c,height:f-e}},ATTRS:{node:{value:null,setter:function(b){return a.one(b)}},navItemSelector:{value:".J_PageSidebar"},enableAutoSelect:{value:!0},navSelectedClass:{value:"selected"},navigators:{value:[]},activeNavigator:{value:null},threshold:{value:0,setter:"_setThreshold"},visible:{value:!0},interval:{value:400},duration:{value:800},easing:{value:"easeOut"}}}),c},{requires:["node","dom","base","anim","ua"]});