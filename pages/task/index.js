// pages/task/index.js
import {
  Task
} from '../../model/task';
import {
  User
} from '../../model/user';
import {
  FormId
} from '../../model/formId';

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
    ],
    signed:false

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
        if (result.data.body.count==0&&index==0){
          item.sign_circle = "sign_circle_signed";
          item.sign_circle_score = "sign_circle_score_signed";
          if (result.data.body.mark == "1") {
            item.hook = "hook";
          }
        }else
        if ((result.data.body.count) == index) {
          item.sign_circle = "sign_circle_signed";
          item.sign_circle_score = "sign_circle_score_signed";
          if (result.data.body.mark == "1") {
            item.hook = "hook";
          }
        } else if ((result.data.body.count)>index){
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
      }else{
        that.setData({
          signed: false
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

  putFormId(event){
    console.log(event);
    FormId.createUserFormId(event.detail.formId);

  },
  sign(event){
    console.log(event);
    FormId.createUserFormId(event.detail.formId);
    let that = this;
    Task.create(this.data.task).then(function (result) {

      if (result.data.code == 200 && result.data.body==1) {
        wx.showLoading({
          title: '签到成功!',
          duration:1500
        })
        if (result.data.mark == "1") {
          that.setData({
            signed: true
          })
        }
        that.getDetail();
        that.getCurrentUser();
      }else{
        wx.showLoading({
          title: '服务错误!',
          duration: 1500
        })
      }
    
    });
  },
  goExchange(){
    wx.navigateTo({
      url: '/pages/exchange/index',
    })

  },
  go(event){
    FormId.createUserFormId(event.detail.formId);
    console.log(event.currentTarget);
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })
  }
,
  // goShare(event){
  //   console.log(event);
  //   this.onShareAppMessage();
  // },

  //
  /* share */
  onShareAppMessage(res) {
    //
    let that = this;
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
      "http://static.124115.com/static/program/img/index/share.png";
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

  postShare() {
    //
    Share.post()
      .then(result => {
        let shareLog = result.data;
        console.log(shareLog);
      })
      .then(returl => {
        //
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
  onShareAppMessage: function (res) {
    console.log("po[o[po")
    console.log(res)

    if (res.from ==='button'){

      //
      let title = "百万留学生的闲置好物分享平台";
      let path = "/pages/index/index";
      let imageUrl =
        "http://static.124115.com/static/program/img/index/share.png";
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
      
    }

  }
})