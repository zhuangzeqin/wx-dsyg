// index.js
//0 引入异步请求
import{request} from "../../request/request.js"
// 获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList:[],
    catitems:[],
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 异步发送请求获取轮播图的数据
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
    this.getSwiperListData();
    this.getCatitemsData();
    this.getFloorListData();
  },
  /**
   * 获取轮播图的数据
   */
  getSwiperListData()
  {
    request({url:'/home/swiperdata'}).
    then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },
  /**
   * 导航栏数据
   */
  getCatitemsData()
  {
    request({url:'/home/catitems'}).
    then(result=>{
      this.setData({
        catitems:result
      })
    })
  },
  /**
   * 楼层数据获取
   */
  getFloorListData()
  {
    request({url:'/home/floordata'}).
    then(result=>{
      this.setData({
        floorList:result
      })
    })
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