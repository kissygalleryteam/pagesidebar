## PageNavigator

* 版本：1.0
* 教程：[http://gallery.kissyui.com/pagesidebar/1.0/guide/main.html](http://gallery.kissyui.com/pagesidebar/1.0/guide/main.html)
* demo：[http://gallery.kissyui.com/pagesidebar/1.0/demo/index.html](http://gallery.kissyui.com/pagesidebar/1.0/demo/index.html)

## 功能
* 支持正向和逆向流程，可视区域内模块自动高亮
* 支持自定义点击锚点后的滑动动画
* 兼容浏览器默认行为

截图:

![alt text](http://img01.taobaocdn.com/tps/i1/T1DGpdFhBbXXcOg4z5-382-416.png "Logo Title Text 1")



## 快速上手



第一步配置html代码（）:

```html
<div class="nav" id="J_Nav">
    <p><a href="#J_Box1" class="J_PageNavigator">去box1的位置</a></p>
    <p><a href="#J_Box2" class="J_PageNavigator" data-navigator='{"threshold":20}'>去#J_Box2的位置偏移20个像素</a></p>
    <p><a href="#" class="J_PageNavigator" data-navigator='{"to":100}'>去Top:100px的位置</a></p>
</div>
```

javascript:

```javascript
 var nav = new PageNavigator({
     node : '#J_Nav',
     navItemSelector : '.J_PageNavigator'
 });
```

## 配置参数


| Attribute        | default           | Description  |
| :------------- |:-------------| :-----|
| node      | null | {Selector|NodeList}导航条根节点 *Required* |
|navItemSelector | .J_Navigator | {String}导航子节点选择器,必须指定为a标签，推荐href设定为#id的形式，兼容浏览器默认行为|
|enableAutoSelect|true|启用逆向流程：用户滚动页面时，自动高亮选中当前页面的第一个模块对应的导航链接|
|navSelectedClass|.selected|{String}高亮导航节点样式|
|interval|400|页面滚动时的监测的时间间隔，时间越短，性能越差|
|threshold|0|设定一个阀值，DOM.scrollTop()大于这个值时显示导航条|



## 事件


| Event        | When           | Payload  |
| :------------- |:-------------| :-----|
| scrolling      | 点击导航页面开始滚动和结束滚动时触发 | e.scrolling:{Boolean} 为true时开始滚动 false时结束滚动 e.data能拿到当前的navigator对象|
|afterVisibleChange|设定阀值后，显示隐藏导航节点时触发|e.newVal为true时表示显示|
|afterAcitveNavigatorChange|新的导航节点激活（高亮）时触发|e.newVal为navigator对象|


## 方法


| Method        | Description    | 
| :------------- |:------------- |
|setNavigatorsTop|如果导航的容器高度发生变化时，调用此方法重新计算容器高度|
|region|获取节点的region对象|
|viewportRegion|获取文档可视区域的region对象|


## changelog

### V1.0


