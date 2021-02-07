// pages/search/search.js
//0 引入异步请求
import { request } from "../../request/request.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
import { showToast } from "../../utils/asyncWx.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods:[],
        isFocus:false,
        //输入框的值
        inputValue:""
    },
    TimeId:-1,//定时器
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    handleInput(e)
    {
        //1 拿到输入框的值
        const {value} = e.detail;
        //2 判断合法的校验
        if(!value.trim())
        {
            this.setData({
                isFocus:false,
                goods:[]
            });
            // showToast({title:'请输入合法的关键字！'});
            return;
        }
        this.setData({
            isFocus:true
        });
        //清理定时器
        clearTimeout(this.TimeId);
        //防止页面抖动；输入稳定1s 后才开始发送请求
        this.TimeId = setTimeout(() => {
            this.reqSearch(value);
        }, 1000);
       

        
    },
    /**
     *重置
     *
     * @param {*} e
     */
    HandlerCancle(e)
    {
        this.setData({
            goods:[],
            isFocus:false,
            //输入框的值
            inputValue:""
        });
    },
    /**
     *根据关键字发送请求
     *
     * @param {*} query
     */
   async reqSearch(query)
    {
      const result =  await request({url:"/goods/search",data:{query}});
      this.setData({
        goods:result.goods
      });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})