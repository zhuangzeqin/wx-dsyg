// pages/feedback/feedback.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        name: "商家投诉/反馈",
        isActive: false,
      },
    ],
    chooseImgs: [],
    textValue:""
  },
  //外网的图片路径上传的数组
  UpLoadImage:[],

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
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    this.setData({
      tabs,
    });
  },
  // 获取文本域的内容
  handleTextInput(e)
  {
    this.setData({
      textValue:e.detail.value
    });
  },
  /**
   *选择+号 图片
   *
   * @param {*} e
   */
  handleChooseImg(e) {
    // 调用小程序内置的api
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (result) => {
        this.setData({
          //图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
        });
      },
      fail: () => {},
      complete: () => {},
    });
  },
  /**
   *删除图片
   *
   * @param {*} e
   */
  handleRemoveimg(e) {
    //1 点击获取索引
    const { index } = e.currentTarget.dataset;
    let{chooseImgs} = this.data;
    //根据索引删除
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    });

  },
  /**
   *提交
   *
   * @param {*} e
   */
  handleSubmit(e)
  {
    const {textValue} = this.data;
    const {chooseImgs} = this.data;
    //判断是否为空
    if(!textValue.trim())
    {
      //不合法
      wx.showToast({
        title: '您的输入不合法',
        mask: true,
      });
      return
    }
    wx.showLoading({
      title: "正在上传中...",
      mask: true,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
    if(chooseImgs.length!=0)
    {
      chooseImgs.forEach((v,i)=>{
        //没发上传多张； 必须要for 循环上传
        var upTask = wx.uploadFile({
         // 图片要上传到哪里  新浪图床
         url: 'https://images.ac.cn/Home/Index/UploadAction/',
         //图片上传路径
         filePath: v,
         //文件名称
         name: "file",
         //顺带的文本信息
         formData: {
     
         },
         success: (result) => {
           console.log(result);
           let url = JSON.parse(result.data).url;
           this.UpLoadImage.push(url);
           //所有的图片上传完；文本域和外网的图片路径一起提交到后台服务器上 
           if(i===chooseImgs.length-1)
           {
             wx.hideLoading();
               
             // 文本域和外网的图片路径一起提交到后台服务器上 
             // 文本域和外网的图片路径一起提交到后台服务器上 
             // 文本域和外网的图片路径一起提交到后台服务器上 
             console.log("文本域和外网的图片路径一起提交到后台服务器上 ");
             //上传成功之后重置页面
             this.setData({
               chooseImgs: [],
               textValue:""
             });
             //返回上一个页面
             wx.navigateBack({
               delta: 1
             });
           }
         },
         fail: () => {},
         complete: () => {}
       });
     
         })
    }
    else{
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
      console.log("只是提交了文本");
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
