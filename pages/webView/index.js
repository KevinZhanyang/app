// pages/webView/index.js
import {
  Banner
} from "../../model/banner";
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
    console.log(options)
    let that = this;
    Banner.getBannerItem(options.id).then(res => {
      if (res.data.code == 200) {
         that.setData({
           banner: res.data.body
         })
      }
    })
    if (options.img){
      this.setData({
        webUrl: wx.getStorageSync("webUrl"),
        img: options.img
      })
      console.log(options.img)
     
      wx.downloadFile({
        url: options.img, //注意公众平台是否配置相应的域名
        success: function (res) {
          console.log("111111111")
          console.log(res);
          that.setData({
            img: res.tempFilePath,
            title: options.title
          })
        }, error: function (err) {
          console.log("2222")
          console.log(err);
        }
      })

    }else{
      this.setData({
        webUrl: wx.getStorageSync("webUrl"),
      })
    }
   
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

  //
  /* share */
  onShareAppMessage(res) {
    //
    let that = this;
    if (that.data.img){
      return {
        title: that.data.title ? that.data.title:'北美二手社',
        imageUrl: that.data.img,
        path: '/?id=123',
        // complete start
        complete: function (res) {
          if (res.errMsg == "shareAppMessage:ok") {
            console.log("share success");
            /*
                      //分享为按钮转发
                      if (that.data.shareBtn) {
                          //判断是否分享到群
                          if (res.hasOwnProperty('shareTickets')) {
                              console.log(res.shareTickets[0]);
                              //分享到群
                              that.data.isshare = 1;
                          } else {
                              // 分享到个人
                              that.data.isshare = 0;
                          }
                      }
                      */
          } else {
            console.log("share fail");
            wx.showToast({
              title: "分享失败"
            });
          }
          //
        }
        // complate end
      };
    }



    
    //
  },
})