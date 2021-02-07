// pages/goosdetail/goosdetail.js
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
        goodsObject:{},
        isCollect:false//是否收藏
    },
    //全局变量
    GoodsInfo:{},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // const{goods_id} = options;
        // this.getGoodsDetail(goods_id);
    },

    handCollect(e)
    {
      let isCollect = false;
      //1 获取当前的商品id
      const {goods_id} = e.currentTarget.dataset;

      let collect = wx.getStorageSync("collect")||[];
      //判断集合中是否存在该商品
      let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index!==-1)//存在收藏
      {
        isCollect = false;
        //从数组中删除；并且删除1个
        collect.splice(index,1);
        showToast({title:"取消收藏"});
      }
      else{
        //直接在数组中添加改商品
        isCollect = true;
        collect.push(this.GoodsInfo);
        showToast({title:"收藏成功"});
      }
      wx.setStorageSync("collect", collect);
      this.setData({
        isCollect
      });

    },
   /**
    *获取商品详情数据
    *
    * @param {*} goods_id
    */
   async getGoodsDetail(goods_id){
    //  如果后台返回多余的数据 ；则拿自己需要的数据； 多的可以不取； 提高性能
      const goodsObject =  await request({url:"/goods/detail",data:{goods_id}});
      this.GoodsInfo = goodsObject;//赋值

       //1 加载缓存中收藏的商品
      // 如果是的话就改变一下页面的图标
      //点击收藏判断是是否存在；如果存在；这删除； 否则添加进集合；存放到缓存中

      let collect = wx.getStorageSync("collect")||[];
      //判断集合中是否存在该商品；数组只要有一个就会返回true some函数的用法
      let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

      this.setData({
        isCollect,
        goodsObject:
        {
          goods_id:goodsObject.goods_id,
          goods_name:goodsObject.goods_name,
          goods_price:goodsObject.goods_price,
          //部分iphone 手机不识别webp 图片格式,全端手动替换成jpg格式图片
          goods_introduce:goodsObject.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics: goodsObject.pics
        }
      });
    },
    /**
     *点击轮播图可以进行预览
     *
     */
    handlePrevewImage(e)
    {
      
      const {url} = e.currentTarget.dataset;
      //重新构建一个新的数组
      const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
      //图片预览调用的是原生的api 展示
      wx.previewImage({
        current: url,
        urls: urls
      });
        
    },
    /**
     *添加到购物车里
     *
     * @param {*} e
     */
    handleCartAdd(e)
    {
      //1 获取缓存中的购物车数据
      let cart = wx.getStorageSync("cart")||[];
      //2 判断商品对象是否存在购物车里面 如果不存在index -1,存在则返回具体的索引值
      let index  = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
      if(index===-1)
      {
        //3 不存在；第一次添加进来
        this.GoodsInfo.num =1;//数量为1
        this.GoodsInfo.checked =true;//商品勾选状态默认是选中
        cart.push(this.GoodsInfo);//添加到购物车里
      }
      else{
        //4 存在购物车里； 需要把该购物车的商品数量++
        cart[index].num++;//点击一次添加1次
      }
      //5 最终把购物车数据重新添加到缓存中
        wx.setStorageSync("cart", cart);
        //6 提示用户添加成功
        wx.showToast({
          title: '添加成',
          icon: 'success',
          //true 防止手抖
          mask: true
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
      var pages =  getCurrentPages();
      let currentPages  = pages[pages.length-1];
      const{goods_id} = currentPages.options;
      this.getGoodsDetail(goods_id);


        

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