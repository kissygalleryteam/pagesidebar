/*
combined files : 

gallery/pagesidebar/1.1/index

*/
/**
 * @fileoverview 页面导航组件
 * @author PageSidebar<shuke.cl@taobao.com>
 * @module PageSidebar
 **/
KISSY.add('gallery/pagesidebar/1.1/index',function (S , Node) {
    var EMPTY = '';
    var $ = Node.all;
    var win = window;
    var DOM = S.DOM;
    var isIE6 = S.UA.ie === 6;
    /**
     * 页面导航组件
     * @class PageSidebar
     * @constructor
     * @extends Base
     */
    function PageSidebar(comConfig) {
        var self = this;
        //调用父类构造函数
        PageSidebar.superclass.constructor.call(self, comConfig);
        this.initializer();
    }

    S.extend(PageSidebar, S.Base, /** @lends PageSidebar.prototype*/{
        initializer : function () {
            this.node = this.get('node');
            if (!this.node) {
                S.log('初始化失败：没有指定导航条所在节点');
                return;
            }
            this._parseHtmlToNavigators(this.node , this.get('navItemSelector'));
            this.setNavigatorsTop(this.get('navigators'));
            this.renderUI();
            this.bindUI();
        },
        renderUI    : function () {

        },
        bindUI      : function () {
            this.node.delegate('click' , this.get('navItemSelector') , this._clickNavigatorHandler , this);
            S.one(win).on('scroll' ,  S.buffer(this._scrollHandler , this.get('interval') , this));
            this.on('afterActiveNavigatorChange' , function (e){
                e.prevVal && e.prevVal.srcNode.removeClass('selected');
                e.newVal.srcNode && e.newVal.srcNode.addClass('selected');
            },this);

            //同步显示状态
            this.on('afterVisibleChange' , function (e){
                e.newVal ?  this.node.show() : this.node.hide();
            },this);
        },
        _clickNavigatorHandler : function (e){
            var that = this;
            e.preventDefault();
            var srcNode = S.one(e.currentTarget);
            this.clickedNavigator = srcNode.data('navigator');
            setTimeout(function (){
                that.clickedNavigator = null;
            },this.get('duration') + 200);
            this.scrollTo(srcNode.data('navigator'));
        },
        _scrollHandler : function (){
            var threshold = this.get('threshold');
            if (threshold > 0 ) {
                this.set('visible' , DOM.scrollTop() > threshold);
            }else{
                this.set('visible' , true);
            }
            this.get('enableAutoSelect') && this._checkRegion();

            isIE6 && (this.node[0].className = this.node[0].className);
        },
        /**
         * 通过判断Element在视窗可视区域内所占的大小判断哪一个导航点处于高亮.用户点击的导航点权重最高
         * 通过afterAcitveNavigatorChange可以监听到变化
         * @private
         */
        _checkRegion : function (){
            var navigators = this.get('navigators');

            var viewportRegion = PageSidebar.viewportRegion();

            //this.set('acitveNavigator' , null);
            var inRegionNavigators = [];
            var activeNavigator = null;
            for(var i = 0 ,len  = navigators.length ; i < len; i ++){
                var toNode = navigators[i].scrollTo.to;
                if ((toNode instanceof S.NodeList)) {
                    toNode.data('region' , PageSidebar.region(toNode));
                    if (PageSidebar.inRegion( toNode.data('region') , viewportRegion)) {
                        navigators[i].intersectRegion = PageSidebar.intersect(toNode.data('region') , viewportRegion);
                        inRegionNavigators.push(navigators[i]);
                    }
                }
            }
            if (inRegionNavigators.length > 0) {
                inRegionNavigators.sort(function (a, b){
                    return b.intersectRegion.height - a.intersectRegion.height;
                });
                activeNavigator = inRegionNavigators[0];
                if (this.clickedNavigator !== null) {
                    for(i = 0 , len = inRegionNavigators.length ; i < len ; i++){
                        if (inRegionNavigators[i] === this.clickedNavigator) {
                            activeNavigator = this.clickedNavigator;
                        }
                    }
                }
                this.set('activeNavigator' , activeNavigator);
            }
        },
        /**
         * 重新获取每一个navigator的值，在window.scroll时需要根据这个值来监测当前处于最顶端的navigator
         * 当页面的模块高度发生变化时，建议重新调用此方法
         * @method setNavigatorsTop
         * @param navigators
         */
        setNavigatorsTop : function (navigators){
            S.each(navigators , function (navigator){
                navigator.top = this._getTop(navigator.scrollTo.to) + (navigator.scrollTo.threshold);
            } , this);
        },
        /**
         * 滚动到指定navigator的位置
         * @param item
         */
        scrollTo    : function (item) {
            var that = this;
            $(win).stop();
            /**
             * 滚动开始贺结束时改变其状态
             * @event scrolling
             * @param {Boolean} scrolling 滚动中
             * @param {Object} data
             **/
            this.fire('scrolling' , {
                scrolling : true,
                data : item
            });
            var toTop =  this._getTop(item.scrollTo.to) + (item.scrollTo.threshold);
            item.top = toTop ;
            $(win).animate({
                scrollTop: toTop
            }, this.get('duration') / 1000, this.get('easing'),function (){
                that.fire('scrolling' , {
                    scrolling : false,
                    data : item
                });
            });
        },
        /**
         * 分析html结构和配置转换为json
         * 注意：优先取a标签的href属性配置的id来通过S.one去取节点,如果没有找到id对应的节点，则data-navigator属性的scrollTo配置
         * @param node
         * @param selector
         * @private
         */
        _parseHtmlToNavigators : function (node, selector){
            var navigators = [];
            node.all(selector).each(function (_item){
                var customCfg ;
                var _navigator = {};
                var _href = /#[\d\D]*/gi.exec(_item.attr('href'));
                var _toNode = (_href.length > 0 && S.one(_href[0])) || null;
                if (_item.hasAttr('data-navigator')) {
                    try{
                        customCfg =S.JSON.parse(_item.attr('data-navigator'));
                    }catch(e){ customCfg ={};}
                }else{
                    customCfg ={};
                }
                S.log(customCfg);
                customCfg = S.mix({threshold:0 , to : 0} , customCfg , undefined, undefined , true);
                _toNode && (customCfg.to = _toNode);
                _navigator =  {
                    srcNode : _item,
                    scrollTo: customCfg
                };
                navigators.push(_navigator);
                _item.data('navigator' , _navigator);
            });
            this.set('navigators', this.get('navigators').concat(navigators));
        },
        /**
         * 获取指定节点的top值，如果传入数字，以此为准
         * @param val
         * @returns {*}
         * @private
         */
        _getTop     : function (val) {
            switch (true) {
                case S.isNumber(val) :
                    return val;
                    break;
                case S.isString(val) :
                    var _node = S.one(val);
                    if (_node) {
                        return _node.offset().top
                    } else {
                        S.log('没有找到对应节点');
                    }
                    break;
                case val instanceof S.NodeList :
                    return val.offset().top;
                    break;
                default :
                    break;

            }
        },
        _setThreshold : function (val){
            if (S.isString(val) && S.one(val)) {
                return S.one('val');
            }else if(S.isNumber(val)){
                return val;
            }
            return 0;
        }
    }, {
        /**
         * 获取指定DOM的region
         * @method region
         * @param node
         * @return Object
         */
        region : function (node){
            var offset = node.offset();
            var _w = node.outerWidth();
            var _h = node.outerHeight();
            return {
                left: offset.left,
                top : offset.top,
                right : offset.left + _w,
                bottom : offset.top + _h,
                width : _w,
                height : _h
            };
        },
        /**
         * 获取可视区域的region
         * @method viewportRegion
         * @return Object
         */
        viewportRegion : function (){
            var _left = DOM.scrollLeft();
            var _top = DOM.scrollTop();
            var _w = DOM.viewportWidth();
            var _h = DOM.viewportHeight();
            return {
                left  : _left,
                top   : _top,
                right : _left + _w,
                bottom: _top + _h,
                width : _w,
                height: _h
            };
        },
        /**
         * 检测region1是否包含在region2里
         * @param region1
         * @param region2
         * @param allInRegion {Boolean} 是否要完全包含
         * @return Boolean
         */
        inRegion : function (region1,region2,allInRegion){
            allInRegion = allInRegion || false;
            var _h = true;
            var _v = true;
            if (allInRegion) {//整个被包含要求region1的最右侧和最下侧均不超过region2的最右侧和最下侧
                _h = (region1.right <= region2.right && region1.left >= region2.left);
                _v = (region1.bottom <= region2.bottom && region1.top >= region2.top);
            }
            var h = ((region1.top >= region2.top && region1.top <= region2.bottom) || (region1.top <= region2.top && region1.bottom >= region2.top ))  && _h;
            var v = ((region1.left >= region2.left && region2.left <= region2.right) || (region1.left <= region2.left && region1.right >= region2.left))  && _v;
            return h && v;
        },
        /**
         * 获取两个region的相交region
         * @param region1
         * @param region2
         * @returns {{left: number, top: number, right: number, bottom: number, width: number, height: number}}
         */
        intersect : function (region1,region2){
            var _l = Math.max(region1.left,region2.left);
            var _r = Math.min(region1.right , region2.right);
            var _t = Math.max(region1.top , region2.top);
            var _b = Math.min(region1.bottom , region2.bottom);
            return {
                left  : _l,
                top   : _t,
                right : _r,
                bottom: _b,
                width : _r - _l,
                height: _b - _t
            }
        },
        ATTRS: /** @lends PageSidebar*/{
            /**
             * 导航容器的根节点
             * @attribute node
             * @type String|NodeList
             * @default null
             **/
            node      : {
                value: null,
                setter : function (val){
                    return S.one(val);
                }
            },
            /**
             * 导航子节点选择器,必须指定为a标签，推荐href设定为#id的形式，兼容浏览器默认行为
             * @attribute navItemSelector
             * @type String
             * @default .J_Navigator
             **/
            navItemSelector : {
                value : '.J_PageSidebar'
            },
            /**
             * 启用逆向流程：用户滚动页面时，自动高亮选中当前页面的第一个模块对应的导航链接
             * @attribute enableAutoSelect
             * @type Boolean
             * @default true
             **/
            enableAutoSelect : {
                value : true
            },
            /**
             * 高亮导航节点样式
             * @attribute navSelectedClass
             * @type String
             * @default 'selected'
             **/
            navSelectedClass :{
                value : 'selected'
            },
            /**
             * {
                 srcNode : null,
                 scrollTo : {
                     to : null,
                     threshold : 0
                 },
                 top: 200
             }
             */
            navigators: {
                value : []
            },
            /**
             * 模块处于可视区域时出发的模块,通过e.newVal.scrollTo.to可以获取到进入显示区域的模块，e.newVal.srcNode表示当前的导航触发节点
             * @event afterAcitveNavigatorChange
             * @param {Object} navigator
             **/
            activeNavigator : {
                value : null
            },
            /**
             * 设定一个阀值，DOM.scrollTop()大于这个值时显示导航条
             * @attribute threshold
             * @type Number
             * @default 0
             **/
            threshold : {
                value : 0,
                setter : '_setThreshold'
            },
            /**
             * 导航条显示隐藏时触发
             * @event afterVisibleChange
             * @param {Boolean} e.newVal e.prevVal
             **/
            visible : {
                value : true
            },
            /**
             * 页面滚动时的监测的时间间隔，时间越短，性能越差
             * @attribute interval
             * @type Number
             * @default 400
             **/
            interval : {
                value : 400
            },
            /**
             * 滑动的duration,单位：ms 毫秒
             * @attribute duration
             * @type Number 毫秒
             * @default 800
             **/
            duration : {
                value : 800
            },
            /**
             * 滑动的缓冲效果
             * @attribute easing
             * @type String
             * @default easeOut
             **/
            easing : {
                value : 'easeOut'
            }

        }
    });
    return PageSidebar;
}, {requires: ['node' , 'dom', 'base' , 'anim' , 'ua']});




