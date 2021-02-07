// Promise 形式的getSetting
export const getSetting=()=>
{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });
    })
   
}
// Promise 形式的openSetting
export const openSetting=()=>
{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}
// Promise 形式的chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}
// Promise 形式的showModal
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '温馨提示',
            content: content,
            success: (result) => {
                resolve(result);
            },
            fail: (error) => {reject(error)},
            complete: () => {}
        });
          
    })
}
// Promise 形式的showModal
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            mask: true,
            success: (result) => {
                resolve(result);
            },
            fail: (error) => {reject(error)},
            complete: () => {}
        });
          
          
    })
}
// Promise 形式的login
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result);
                // const {code} =result;
            },
            fail: (err) => {reject(err);},
            complete: () => {}
        });
          
          
    })
}

// Promise 形式的requestPayment
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        //调起微信支付api
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => { reject(err) },
            complete: () => { }
        });


    })
}