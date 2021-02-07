// pages/category/category.js
//0 引入异步请求
import { request } from "../../request/request.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左边菜单列表
    leftMenuList: [],
    //右边菜单列表
    rightContent: [],
    //被点击左侧菜单的索引
    currentIndex: 0,
    //右边菜单距离top 为0
    scrolltop: 0,
  },
  //接口返回的数据
  Cates: [],
  /**
   * 获取分类的数据
   */
  async getCategoryList() {
    // request({
    //   url: "/categories",
    // }).then((result) => {
    //
    // });
    //使用es7 async await 来发送请求
    const result = await request({ url: "/categories" });
    console.log(result);
    // this.Cates = result.data.message; //拿到接口的数据
    this.Cates = result; //拿到接口的数据
    //把接口中的数据存储在本地中
    wx.setStorageSync("casts", { time: Date.now(), data: this.Cates });
    //构造左边的大菜单的数据
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    //构造右边的商品数据
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent,
    });
  },
  /**
   * 左侧菜单的点击事件
   * @param {*} e
   */
  handleItemTap(e) {
    //1拿到点击的索引index
    const { index } = e.currentTarget.dataset;
    //2根据不同的索引构造右边的商品数据
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrolltop: 0,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 先判断是否有旧的数据；
     * {time:Date,now(),data:[...]}
     * 1 如果没有；则发送请求获取新数据
     * 2 如果存在；并且不过期则使用缓存中的数据
     *
     */
    const Casts = wx.getStorageSync("casts");
    //判断如果不存在则发送请求数据
    if (!Casts) {
      console.log("第一次发送请求");
      this.getCategoryList();
    } else {
      //拿到旧的数据判断时间是否有过期 比如10s
      if (Date.now() - Casts.time > 1000 * 10) {
        //
        console.log("10s 过期 重新发送请求");
        this.getCategoryList();
      } else {
        //可以使用旧的数据
        console.log("可以使用旧的数据");
        this.Cates = Casts.data;
        //构造左边的大菜单的数据
        let leftMenuList = this.Cates.map((v) => v.cat_name);
        //构造右边的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },

  //

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
