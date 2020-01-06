var app = new Vue({
    el: '#main',
    data: {
        tasks:[
            {   id: 'task1',
                content: '沿着荷塘，是一条曲折的小煤屑路。这是一条幽僻的路；白天也少人走，夜晚更加寂寞。荷塘四面，长着许多树，蓊蓊郁郁的。路的一旁，是些杨柳，和一些不知道名字的树。没有月光的晚上，这路上阴森森的，有些怕人。今晚却很好，虽然月光也还是淡淡的。\n',
                active: true,
            },
            {   id: 'task2',
                content: '桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。花里带着甜味，闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿！花下成千成百的蜜蜂嗡嗡地闹着，大小的蝴蝶飞来飞去。野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，像眼睛，像星星，还眨呀眨的。\n',
                active: false,
            },
        ]
    },
    created: function () {
        this.navhref();
    },
    methods:{
        // 为nav生成链接
        navhref :function () {
            for (var key in this.tasks){
                if (this.tasks.hasOwnProperty(key)) {
                    this.tasks[key].href = '#' + this.tasks[key].id;
                }
            }
        }
    }

});