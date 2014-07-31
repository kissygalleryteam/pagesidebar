/**
 * @fileoverview
 * @author
 * @module pagesidebar
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     *
     * @class Pagesidebar
     * @constructor
     * @extends Base
     */
    function Pagesidebar(comConfig) {
        var self = this;
        //调用父类构造函数
        Pagesidebar.superclass.constructor.call(self, comConfig);
    }
    S.extend(Pagesidebar, Base, /** @lends Pagesidebar.prototype*/{

    }, {ATTRS : /** @lends Pagesidebar*/{

    }});
    return Pagesidebar;
}, {requires:['node', 'base']});



