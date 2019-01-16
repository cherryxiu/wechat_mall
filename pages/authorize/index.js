// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo){
      return;
    }
    // 用户按了允许授权按钮
    if (app.globalData.isConnected) {
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.login(e.detail.userInfo);
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
   
  },
  login: function (e) {
    let that = this;
    let token = wx.getStorageSync('token');
    // if (token) {
    //   wx.request({
    //     //url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/check-token',
    //     data: {
    //       token: token
    //     },
    //     success: function (res) {
    //       if (res.data.code != 0) {
    //         wx.removeStorageSync('token')
    //         that.login();
    //       } else {
    //         // 回到原来的地方放
    //         wx.navigateBack();
    //       }
    //     }
    //   })
    //   return;
    // }
    wx.login({
      success: function (res) {
        console.log('登录的用户详细信息====' + JSON.stringify(e))
        wx.cloud.init()
        wx.cloud.callFunction({
          name:"userLogin",
          data:{
            'nickName': e.nickName
          },
          success: function (res) {
            if (res.result.data[0]==null){
              console.log("没有这个用户,需要插入")
              wx.cloud.callFunction({
                name: "saveUserInfo",
                data: {
                  'nickName': e.nickName,
                  'gender': e.gender,
                  'language': e.language,
                  'city': e.city,
                  'province': e.province,
                  'country': e.country,
                  'avatarUrl': e.avatarUrl
                },
                success: function (res) {

                }
              })

            }else{
              console.log("已经有用户，直接进入主页")
            }
            // if (res.data.code == 10000) {
            //   // 去注册
            //   that.registerUser();
            //   return;
            // }
            // if (res.data.code != 0) {
            //   // 登录错误
            //   wx.hideLoading();
            //   wx.showModal({
            //     title: '提示',
            //     content: '无法登录，请重试',
            //     showCancel: false
            //   })
            //   return;
            // }
            // wx.setStorageSync('token', res.data.data.token)
            // wx.setStorageSync('uid', res.data.data.uid)
            // 回到原来的地方放
            //wx.navigateBack();
			wx.setStorageSync('nickName',e.nickName);
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        })
      }
    })
  },
  registerUser: function () {
    let that = this;
    wx.login({
      success: function (res) {
        let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            let iv = res.iv;
            let encryptedData = res.encryptedData;
            let referrer = '' // 推荐人
            let referrer_storge = wx.getStorageSync('referrer');
            if (referrer_storge) {
              referrer = referrer_storge;
            }
            // 下面开始调用注册接口
            wx.request({
              //url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/register/complex',
              data: { code: code, encryptedData: encryptedData, iv: iv, referrer: referrer }, // 设置请求的 参数
              success: (res) => {
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  }
})