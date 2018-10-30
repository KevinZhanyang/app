Component({
    properties: {
        // 
        /*
        innerText: {
          type: String,
          value: 'default value',
        }
        */
        status: Number,
    },
    data: {
        // 这里是一些组件内部数据
        status: 0, // 0|加载更多, 1|正在加载, 2|已全部加载
    },
    methods: {
        // 这里是一个自定义方法
        // customMethod: function () { }
    }
})