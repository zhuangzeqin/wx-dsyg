// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // aaa:{
        //     // type 类型
        //     type:String,
        //     //value 默认值
        //     value:"aaa"
        // }
        tabs:{
            type:Array,
            value:[]
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
       
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleItemTap(e)
        {
            // console.log(e);
            //1 点击获取索引
            const {index} = e.currentTarget.dataset;
            //自定义事件触发事件传递数据到父页面
            this.triggerEvent("itemChange",{index})
            //2 获取data 中的数组
            // let{tabs} = this.data
            // //3 循环数组 [].forEach  遍历数组的时候；修改了v;也会导致数组别修改
            // tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
            // //4 重新赋值给tabs
            // this.setData({
            //     tabs
            // })
        }
    }
})
