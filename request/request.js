import { showToast } from "../utils/asyncWx.js";
//定义公共的接口路径
const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
let count = 0; //统计同时发送多少次请求；等待所有请求结束才能关闭loading
export const request = (params) => {
  count++; //统计同时发送多少次请求
  //显示加载框
  wx.showLoading({
    title: "加载中...",
    mask: true,
  });

  //判断是否url 是否有/my/ 私有路径；如果有；这添加请求头header token
  let header = { ...params.header }; //先结构外面的header 再判断是否要添加token
  if (params.url.includes("/my/")) {
    //拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token") || "";
  }
  console.log("接口:" + params.url + "=> 发送参数:" + JSON.stringify(params.data));
  return new Promise((resolve, reject) => {
    var reqTask = wx.request({
      ...params, //结构化参数
      header: header, //请求头
      url: baseUrl + params.url,
      success: (result) => {
        // 状态码200 代表成功
        const { status } = result.data.meta;
        //错误信息
        const { msg } = result.data.meta;
        console.log("接口:" + params.url + " => 状态码:" + status);
        console.log(
            "接口:" + params.url + " => response:" + JSON.stringify(result)
          );
        //200 代表成功
        if (status === 200) {
          resolve(result.data.message); //成功回调.data.message
        } else {
          console.log("接口:" + params.url + " => 错误信息:" + msg);
          showToast({ title: msg });
          reject(msg); //失败的回调
        }
      },
      fail: (err) => {
        console.log("接口:" + params.url + " => fail:" + JSON.stringify(err));
        showToast({ title: err.errMsg });
        reject(err); //失败的回调
      }, //无论成功与否都会回调的一个函数
      complete: () => {
        count--; //等待所有请求结束才能关闭loading
        if (count === 0) {
          //关闭显示加载框
          wx.hideLoading();
        }
      },
    });
  });
};
