// pages/task/index.js
import {
  Task
} from '../../model/task';
import {
  User
} from '../../model/user';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signArray:[
       {id:1,score:25,mark:0},
      { id: 2, score: 35, mark: 0 },
      { id:3, score: 45, mark: 0 },
      { id: 4, score: 55, mark: 0 }, 
      { id: 5, score: 65, mark: 0 },
      { id: 6, score: 75, mark: 0 },
      { id: 7, score: 100, mark: 0 },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail();
    this.getCurrentUser();
  },

getDetail(){
  let that = this;
  Task.getDetail().then(function (result) {
    if (result.data.code == 200) {
      that.setData({
        task: result.data.body
      })

      var signArray = that.data.signArray.map((item, index) => {
        console.log(index)
        if (result.data.body.count == index) {
          item.sign_circle = "sign_circle_signed";
          item.sign_circle_score = "sign_circle_score_signed";
          if (result.data.body.mark == "1") {
            item.hook = "hook";
          }
        } else if (result.data.body.count>index){
          item.sign_circle = "sign_circle_signed";
          item.sign_circle_score = "sign_circle_score_signed";
          item.hook = "hook";
        }
        return item;
      });

      that.setData({
        signArray: signArray
      })

      if (result.data.body.mark == "1") {
        that.setData({
          signed: true
        })
      }
    }
    console.log(result);
  });

}
,
getCurrentUser(){
  let that =this;
  User.get().then(function (result) {
    that.setData({
      user: result.data
    })            
  });
  

}  ,

  putFormId(){
    


  },
  sign(event){
    let that = this;
    Task.create(this.data.task).then(function (result) {

      if (result.data.code == 200) {
        if (result.data.mark == "1") {
          that.setData({
            signed: true
          })
        }
        that.getDetail();
      }
      console.log(result);
    });
  },
  goExchange(){
    wx.navigateTo({
      url: '/pages/exchange/index',
    })

  },
  go(event){
    console.log(event.currentTarget);
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })
  }
,
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

  }
})