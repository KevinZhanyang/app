// pages/activity/index.js
import { Activity } from "../../model/activity";
import { User } from '../../model/user';
import {
  FormId
} from '../../model/formId';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  loadUser() {
    //
    let that = this;
    User.get()
      .then(res => {
        let user = res.data;
        that.setData({
          user: user,
        });

        // 如果用户头像或昵称为空，
        // 如果用户授权了
        // 更新信息
        console.log(user.nickname);
        console.log(user.avatar.length);
        //
        if (user.nickname.length < 2 || user.avatar.length == 0) {
          User.syncUserInfo();
        }
      });
  },
  putFormId(event) {
    console.log(event);
    FormId.createUserFormId(event.detail.formId);
    wx.navigateBack({
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadUser()
    let that = this;
    Activity.getActivity().then(res=>{
      console.log(res)
      that.setData({
        code: res.data.body.code
      })
       var array=[];
      if (wx.getStorageSync(res.data.body.code) == res.data.body.code){
        wx.showLoading({
          title: '每天可领两次哦！',
          duration:1500
        })
        wx.setStorageSync("limit", 1);
      }else{
        wx.setStorageSync(res.data.body.code, res.data.body.code);
        wx.setStorageSync("limit", 0);
      }
    });
   

  },
  copy(event){
    let formId = event.detail.formId;
    FormId.createUserFormId(event.detail.formId);
    let code = this.data.code;
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '红包码复制成功',
          duration: 2000,

        });
        
      }
    });


  },

  copyWchat() {
    //
    let that = this;
   

    //
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
  //
  /* share */
  onShareAppMessage(res) {
    //
    let that = this;

    /*
        let res = {
            'form': 'button',
            target: {
                //
            }  
        };
        */
    console.log("log share res: -----------------------");
    console.log(res);
    /* 
        if (res.from === 'button') {
        // 来自页面内转发按钮
        that.data.shareBtn = true;
        } else {
        //来自右上角转发
        that.data.shareBtn = false;
        }
        */

    //
    let title = "百万留学生的闲置好物分享平台";
    let path = "/pages/index/index";
    let imageUrl =
      "https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-11-28 02:12:32/1543342352396142.png";
    //
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
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
          that.postShare();
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
    //
  },
})