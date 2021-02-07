// pages/auth/auth.js
//0 引入异步请求
import { request } from "../../request/request.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
import { login } from "../../utils/asyncWx.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 点击支付获取token
   *
   * @param {*} e
   */
  async handleGetUserinfo(e) {
    try {
      //1 拿到获取token 需要的请求参数  执行小程序 获取用户信息后 得到以下4个参数
      const { encryptedData, iv, rawData, signature } = e.detail;
      // 2 或许小程序登录后的code 值
      const { code } = await login();
      //请求参数的构建
      const loginParmas = { encryptedData, iv, rawData, signature, code };
      // 3 发送请求获取用户token
      const { token } = await request({
        url: "/users/wxlogin",
        data: loginParmas,
        method: "POST"
      });
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1,
      });
    } catch (error) {
      console.log(error);
    }
  },

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
