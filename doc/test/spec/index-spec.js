KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('pagesidebar', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/pagesidebar/2.0.0/']});