// pages/goods_list/goods_list.js
//0 引入异步请求
import { request } from "../../request/request.js";
//导入就行； 不需要引用；使用es7 async await 来发送请求 异步请求同步代码块简化代码
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "综合",
        isActive: true,
      },
      {
        id: 1,
        name: "销量",
        isActive: false,
      },
      {
        id: 2,
        name: "价格",
        isActive: false,
      },
    ],
    goodsList:[]
  },
  // 定义接口要的参数
  QueryParams: {
    query: "", //搜索的关键字
    cid: "", //分类cid
    pagenum: 1, //页码数1
    pagesize: 10, //页面数量10
  },
  //总页数； 默认是1
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsInfoList();
  },
  /**
   *获取商品列表数据
   *
   */
  async getGoodsInfoList() {
    const res  = await request({url:"/goods/search",data:this.QueryParams});
    const total = res.total;
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize);//计算出总的页码数 比如23条 折算就就是3页
    this.setData({
      //数组进行拼接
      goodsList:[...this.data.goodsList,...res.goods]
    });
    //关闭下拉窗口
    wx.stopPullDownRefresh();
  },
  /**
   * tab 点击事件
   * @param {*} e 事件源
   */
  handleItemChange(e) {
    // 1 拿到点击的索引
    const { index } = e.detail;
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
  onPullDownRefresh: function () {
    //重置数组
    this.setData({
      goodsList:[]
    })
    //页码数重新置1
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsInfoList();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1判断是否有下一页的数据
    if(this.QueryParams.pagenum>=this.totalPages)
    {
      //没有下页数据
      wx.showToast({title: '没有下页数据', icon: 'none'});
        
    }
    else
    {
      //继续请求下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsInfoList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
