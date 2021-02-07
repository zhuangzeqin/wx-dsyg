// pages/order/order.js
//0 引入异步请求
import { request } from "../../request/request.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [{},{},{}],//订单查询列表数据
    tabs: [
      {
        id: 0,
        name: "全部",
        isActive: true,
      },
      {
        id: 1,
        name: "代付款",
        isActive: false,
      },
      {
        id: 2,
        name: "待发货",
        isActive: false,
      },
      {
        id: 3,
        name: "退货/退款",
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * tab 点击事件
   * @param {*} e 事件源
   */
  handleItemChange(e) {
    // 1 拿到点击的索引
    const { index } = e.detail;
    //2 修改源数组
    this.changeTitleByIndex(index);

      //4 发送请求获取订单列表数据
      this.getOrderListData(index+1);
    // let { tabs } = this.data;
    // tabs.forEach((v, i) => {
    //   i === index ? (v.isActive = true) : (v.isActive = false);
    // });
    // this.setData({
    //   tabs,
    // });
  },
  /**
   *根据标题索引激活选中tab 标签页
   *
   * @param {*} index
   */
  changeTitleByIndex(index)
  {
    //2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    this.setData({
      tabs,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   * onShow 无法接受到option
   */
  onShow: function () {
    //1 获取当前页面栈-数组； 最大长度为10
    //获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
    // 注意：
    // 不要尝试修改页面栈，会导致路由以及页面状态错误。
    // 不要在 App.onLaunch 的时候调用 getCurrentPages()，此时 page 还没有生成。
    var pages = getCurrentPages();
    //2 数组索引最大的值就是当前页面
    let currentPages = pages[pages.length - 1];
    //3 拿到页面参数 eg:type=1
    const { type } = currentPages.options;

    this.changeTitleByIndex(type-1);
    //判断缓存中是否有token
    const token = wx.getStorageSync("token");
    if (!token) {
      // wx.navigateTo({
      //   url: "/pages/auth/auth",
      //   success: (result) => {},
      //   fail: () => {},
      //   complete: () => {},
      // });
      return;
    }
    //4 发送请求获取订单列表数据
    this.getOrderListData(type);
  },
  /**
   *获取订单列表数据
   *
   * @param {*} type
   */
  async getOrderListData(type) {
    const result = await request({ url: "/my/orders/all", data: { type } });
    this.setData({
      //后台返回的时间根式是秒；这里循环遍历处理并且赋值一个新的属性值create_time_cn
      orders: result.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000)).toLocaleString()})),
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
