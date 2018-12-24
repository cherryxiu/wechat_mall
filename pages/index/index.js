//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    categories: [],
    activeCategoryId: 0,
    goods:[],
    scrollTop:0,
    loadingMoreHidden:true,

    hasNoCoupons:true,
    coupons: [],
    searchInput: '',

    curPage:1,
    pageSize:20
  },
  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    wx.cloud.init()
    //轮播图
    wx.cloud.callFunction({
      name:"getBannerList",
      data: {      
      },
      success: function(res) {    
           that.setData({
             banners: res.result.data
         });
      }

    }),
    //商品种类
      wx.cloud.callFunction({
       name:"getCategoryList",
       data:{
       } ,
       success:function(res){
         var categories = [{ id: 0, name: "全部" }];
           for (var i = 0; i < res.result.data.length; i++) {
             categories.push(res.result.data[i]);
           }
         that.setData({
           categories: categories,
           activeCategoryId: 0,
           curPage: 1
         });
         //展示第一列"全部"商品
         that.getGoodsList(0);
       }
     })//,
    // that.getCoupons ();
    // that.getNotice ();
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
   },
  getGoodsList: function (categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    console.log("event.categoryId为" + categoryId)
    var that = this;
    wx.showLoading({
      "mask":true
    })
    wx.cloud.init()
    wx.cloud.callFunction({
      name: "getAllGoodsList",
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput,
        page: this.data.curPage,
        pageSize: this.data.pageSize
      },
      success: function (res) {
        wx.hideLoading()
        //if (res.data.code == 404 || res.data.code == 700) {
          // let newData = { loadingMoreHidden: false }
          // if (!append) {
          //   newData.goods = []
          // }
          // that.setData(newData);
          // return
        //}
        let goods = [];
        if (append) {
          goods = that.data.goods
        }
        for (var i = 0; i < res.result.data.length; i++) {
          goods.push(res.result.data[i]);
        }
        that.setData({
          loadingMoreHidden: false,
          goods: goods,
        });
      }
    })
  },


/**
 * 优惠劵暂时不用
 * 
 */
  // getCoupons: function () {
  //   var that = this;
  //   wx.request({
  //     //url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
  //     data: {
  //       type: ''
  //     },
  //     success: function (res) {
  //       if (res.data.code == 0) {
  //         that.setData({
  //           hasNoCoupons: false,
  //           coupons: res.data.data
  //         });
  //       }
  //     }
  //   })
  // },
  // gitCoupon : function (e) {
  //   var that = this;
  //   wx.request({
  //    // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
  //     data: {
  //       id: e.currentTarget.dataset.id,
  //       token: wx.getStorageSync('token')
  //     },
  //     success: function (res) {
  //       if (res.data.code == 20001 || res.data.code == 20002) {
  //         wx.showModal({
  //           title: '错误',
  //           content: '来晚了',
  //           showCancel: false
  //         })
  //         return;
  //       }
  //       if (res.data.code == 20003) {
  //         wx.showModal({
  //           title: '错误',
  //           content: '你领过了，别贪心哦~',
  //           showCancel: false
  //         })
  //         return;
  //       }
  //       if (res.data.code == 30001) {
  //         wx.showModal({
  //           title: '错误',
  //           content: '您的积分不足',
  //           showCancel: false
  //         })
  //         return;
  //       }
  //       if (res.data.code == 20004) {
  //         wx.showModal({
  //           title: '错误',
  //           content: '已过期~',
  //           showCancel: false
  //         })
  //         return;
  //       }
  //       if (res.data.code == 0) {
  //         wx.showToast({
  //           title: '领取成功，赶紧去下单吧~',
  //           icon: 'success',
  //           duration: 2000
  //         })
  //       } else {
  //         wx.showModal({
  //           title: '错误',
  //           content: res.data.msg,
  //           showCancel: false
  //         })
  //       }
  //     }
  //   })
  // },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 公告
   * 
   */
  // getNotice: function () {
  //   var that = this;
  //   wx.request({
  //    // url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
  //     data: { pageSize :5},
  //     success: function (res) {
  //       if (res.data.code == 0) {
  //         that.setData({
  //           noticeList: res.data.data
  //         });
  //       }
  //     }
  //   })
  // },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch : function (){
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage+1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function(){
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
  }
})
