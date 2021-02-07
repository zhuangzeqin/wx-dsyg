// pages/cart/cart.js
import { chooseAddress, getSetting, openSetting,showModal,showToast } from "../../utils/asyncWx.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //收货地址
    cart: [],
    allChecked: false, //全选的状态
    totalPrice: 0, //总价格
    totalNum: 0, //商品总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
     *点击收货地址
     1 wx.chooseAddress(选择收货地址)
     2 wx.chooseInvoice(选择已有的发票)
     3 wx.chooseInvoiceTitle(选择用户的发票抬头)
     由于此3个接口均为拉起微信原生页面由用户进行选择，为了方便开发者更好地使用微信开放能力，同时开发者无需进行额外适配，针对以上接口授权进行如下修改：
1 开发者可以直接调用以上3个接口，无需获取用户授权
2 若开发者调用wx.authorize接口请求以上3个授权，用户侧不会触发授权弹框，直接返回授权成功
3 若开发者调用wx.getSetting接口请求用户的授权状态，会直接读取到以上3个授权为true
以上修改从2020年9月25日起生效。
     *
     * @param {*} e
     */
  async handleChooseAddress(e) {
    try {
      let address = await chooseAddress();
      //拼接好收获地址(省，市，区)
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo;
      //收货地址缓存到本地
      wx.setStorageSync("address", address);
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
  onShow: function () {
    //获取缓存中的地址
    const address = wx.getStorageSync("address");
    //获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    //计算全选
    //every 很好用也很简单也很重要 是一个数组方法； 他会遍历，它会接受一个回调函数，那么每一个回调返回true;every方法才会返回true
    //只要有一个回调函数返回false,那么它就不会继续执行循环；直接返回false
    //如果是一个空数组；则返回一个true
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false;
    this.setCart(cart);
    //这里需要当独设置一下地址
    this.setData({
      address,
    });
  },
  /**
   * 商品勾选复选框处理逻辑
   * @param {s} e
   */
  handleItemChange(e) {
    //1 勾选的商品id
    const goods_id = e.currentTarget.dataset.id;
    //2 获取data中的购物车的数据
    let { cart } = this.data;
    //3 根据idnex 找到商品对象
    let index = cart.findIndex((v) => v.goods_id === goods_id);
    //4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  /**
   * 商品全选的操作逻辑
   *
   */
  handleItemAllChecked(e)
  {
    let {cart,allChecked} = this.data;
    allChecked = !allChecked;//取反
    //遍历修改商品选中状态
    cart.forEach(v=>v.checked=allChecked)
    //重新设置会data中或者缓存中
    this.setCart(cart);
  },
  /**
   * 点击编辑+号 或者-号的操作逻辑
   * @param {*} e 
   */
 async handleItemEdit(e)
  {
      //1 获取传递过来的参数
      const {id,operation} = e.currentTarget.dataset;
      //2 获取购物车数组
      let{cart} = this.data;
      //3 找到该商品信息
      const index  = cart.findIndex(v=>v.goods_id===id);
      //4 当数量为1的时候；并且用户点击了-号；则提示用户是否删除该商品
      if(cart[index].num===1 && operation===-1)
      {
         const result =  await showModal({content:"您是否删除该商品?"})
          if (result.confirm) {
              //确定删除,根据索引删除；删除1个
              cart.splice(index, 1);
              this.setCart(cart);
              return
          } 
      }
      //5 进行购物车里商品数量numb+-
      cart[index].num+=operation;
      this.setCart(cart);
  },

  //设置购车的状态和重新计算底部总价格总数量
  setCart(cart) {
    //5,6 重新把购物车的数据重新设置会data中和缓存中
    let allChecked = true;
    //总价格
    let totalPrice = 0;
    //总数量
    let totalNum = 0;
    cart.forEach((v, i) => {
      if (v.checked) {
        //累计总价格
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false; //只要有一个没有选中； 就置为false
      }
    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
  /**
   * 点击结算按钮操作逻辑
   * 1 判断是否有购物地址
   * 2 判断是否购物商品；
   * 如果都有； 则跳转到支付页面
   * 
   */
  async handlePay(e)
  {
      console.log(e);
    let {address,cart} = this.data;
    if(!address.userName)
    {
       await showToast({title:"您还没有填写收货地址"});
       return;
    }
    if(cart.length===0)
    {
        await showToast({title:"您还没有选购商品"});
        return;
    }
    wx.navigateTo({
        url: '/pages/pay/pay'
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
