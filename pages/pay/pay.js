import {
  chooseAddress,
  getSetting,
  openSetting,
  showModal,
  showToast,
  requestPayment,
} from "../../utils/asyncWx.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
//0 引入异步请求
import { request } from "../../request/request.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //收货地址
    cart: [],
    totalPrice: 0, //总价格
    totalNum: 0, //商品总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取缓存中的地址
    const address = wx.getStorageSync("address");
    //获取缓存中购物车的数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤购物车的数组，选中的才支付的商品信息
    cart = cart.filter((v) => v.checked);
    //总价格
    let totalPrice = 0;
    //总数量
    let totalNum = 0;
    cart.forEach((v, i) => {
      //累计总价格
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum,
    });
  },
  /**
   *支付逻辑
   *
   */
  async handleOrderPay(e) {
    try {
      //1 判断缓存中有没有token 令牌
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/auth",
          success: (result) => {},
          fail: () => {},
          complete: () => {},
        });
        return;
      } else {
        console.log("已经存在token");
        //1 创建订单/my/orders/creat
        const headerParams = { Authorization: token };
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address.all;
        const cart = this.data.cart;
        let goods = [];
        cart.forEach((v) =>
          goods.push({
            goods_id: v.goods_id,
            goods_number: v.num,
            goods_price: v.goods_price,
          })
        );
        const orderParams = { order_price, consignee_addr, goods };
        //获取订单编号
        const { order_number } = await request({
          url: "/my/orders/create",
          method: "POST",
          data: orderParams,
          header: headerParams,
        });
        //发起预支付接口
        const { pay } = await request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          data: { order_number },
          header: headerParams,
        });
        //调用微信支付
        await requestPayment(pay);
        // 查询订单状态 my/orders/chkOrder
        const result = await request({
          url: "/my/orders/chkOrder",
          method: "POST",
          data: { order_number },
          header: headerParams,
        });
        await showToast({ title: "支付成功" });
        //手动删除缓存中已经支付的商品
        let newCart = wx.getStorageSync("cart");
        //过滤出还没有支付成功商品数据；
        newCart = newCart.filter(v=>!v.checked);
        //重新填充回去；此时购车的数据就只剩下还没购买的商品； 比如我有3个商品； 购买了2个； 此是购车的商品就只会存在一个商品
        wx.setStorageSync("cart", newCart);
        // 支付成功后跳转到订单页面
        wx.navigateTo({
            url: '/pages/order/order',
            success: (result) => {
            },
            fail: () => {},
            complete: () => {}
        });
          
      }
    } catch (error) {
      await showToast({ title: "支付失败" });
      console.log(error);
    }
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
