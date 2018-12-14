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
          banner: res.data.body,
          webUrl: res.data.body.clickUrl
        })
        if (res.data.body.createTime){
          wx.downloadFile({
            url: res.data.body.createTime, //注意公众平台是否配置相应的域名
            success: function (res) {
              console.log("111111111")
              console.log(res);
              that.setData({
                img: res.tempFilePath,
              })
            }, error: function (err) {
              console.log("2222")
              console.log(err);
            }
          })
        }
     
      }
    })
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
    if (this.data.banner.createTime) {
      return {
        title: this.data.banner.updateTime ? this.data.banner.updateTime : '北美二手社',
        imageUrl: this.data.img,
        path: 'pages/webView/index?id='+this.data.banner.recId,
        // complete start
        complete: function (res) {
          if (res.errMsg == "shareAppMessage:ok") {
            console.log("share success");
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
    } else {
      return {
        title: this.data.banner.updateTime ? this.data.banner.updateTime : '北美二手社',
        path: 'pages/webView/index?id=' + this.data.banner.recId,
        // complete start
        complete: function (res) {
          if (res.errMsg == "shareAppMessage:ok") {
            console.log("share success");
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