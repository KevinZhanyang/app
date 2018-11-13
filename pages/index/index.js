//
import {
  Category
} from "../../model/category";
import {
  Article
} from "../../model/article";
import {
  Share
} from "../../model/share";
import {
  User
} from "../../model/user";
import {
  Notify
} from "../../model/notify";

//
const appInstance = getApp();

var QQMapWX = require('../../lib/map/qqmap-wx-jssdk.min.js');
var qqmapsdk;

//
Page({
  data: {
    topTabClass: "",
    /* category */
    categories: [],
    /* article */
    // recent
    recentArticles: [],
    recentPage: 1,
    // hot
    hotArticles: [],
    hotPage: 1,
    // status
    hotArticleLoadStatus: 1,
    recentArticleLoadStatus: 1,
    /* switch */
    articleShowBy: "recent",
    switch: "recent",
    timer: null,
    back: false,
    modal: false,
    // swiper
    swipers: [{
        img: "http://static.124115.com/static/program/img/index/school.png",
        url: "/pages/school/index"
      },
      {
        img: "http://static.124115.com/static/program/img/index/exchange.jpg",
        url: "/pages/exchange/index"
      }
    ],
    // 向导
    guideStatus: 0, // 0显示|1不显示
    // 是否有系统通知
    systemNotify: 0
  },
  onPageScroll(data) {
    const that = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      let {
        scrollTop
      } = data;
      if (scrollTop > 800) {
        that.setData({
          back: true
        });
      } else {
        that.setData({
          back: false
        });
      }
    }, 50);
  },
  onCloseModal() {},
  showModal() {
    this.setData({
      modal: !this.data.modal
    });
  },
  //
  onLoad: function(options) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'KKMBZ-I23R2-JUCUK-CECQF-26SEK-G4FAH'
    });
    //
    wx.showShareMenu({
      //
    });

    //
    this.loadCategory();
    // this.loadRecentArticle();
    // this.loadHotArticle();
    // 向导图
    this.initGuide();
    // 红点
    this.loadNotify();

    User.getLocation()
      .then(res => {
        qqmapsdk.reverseGeocoder({
          location: {

            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            // console.log("hh");
            // console.log(address);
            that.setData({
              address: address
            })
          },
          fail: function (res) {
            // console.log("pp");
            // console.log(res);
          },
          complete: function (res) {
            // console.log("op");
            // console.log(res);
          }
        });


      })
  },
  //
  onShow() {
    this.sendCode();
    // if (appInstance.globalData.published == true) {
    if (true) {
      this.clearRecentArticle();
      this.clearHotArticle();
      this.loadRecentArticle();
      this.loadHotArticle();
    }
  },
  loadNotify() {
    let that = this;
    Notify.count().then(res => {
      let notify = res.data;
      that.setData({
        systemNotify: notify
      });
    });
  },
  //
  loadCategory: function() {
    let that = this;
    Category.get().then(function(result) {
      let categories = result.data;
      that.setData({
        categories: categories
      });
    });
    //
  },
  //
  clearRecentArticle() {
    this.data.recentPage = 1;
    this.data.recentArticles = [];
  },
  loadRecentArticle: function() {
    this.setData({
      recentArticleLoadStatus: 0
    });

    let that = this;
    User.getLocation().then(res => {
      let options = res;
      options.page = that.data.recentPage;
      //
      Article.recent(options).then(function(result) {
        //
        let recentArticles = that.data.recentArticles;
        var paginate = result.data;
        let articles = paginate.data;
        for (let x in articles) {
          recentArticles.push(articles[x]);
        }

        // if current_page equal to last_page, mean need finish
        let articleLoadStatus =
          paginate.current_page == paginate.last_page ? 2 : 1;
        that.data.recentPage = paginate.current_page + 1;

        //
        that.setData({
          recentArticles: recentArticles,
          recentArticleLoadStatus: articleLoadStatus
        });
      });
      //
    });
  },
  clearHotArticle() {
    this.data.hotPage = 1;
    this.data.hotArticles = [];
  },
  loadHotArticle: function() {
    //
    this.setData({
      hotArticleLoadStatus: 0
    });

    //
    let that = this;
    User.getLocation().then(res => {
      //
      let options = res;
      options.page = that.data.hotPage;

      Article.hot(options).then(function(result) {
        let hotArticles = that.data.hotArticles;
        let paginate = result.data;
        let articles = paginate.data;
        for (let x in articles) {
          hotArticles.push(articles[x]);
        }

        // if current_page equal to last_page, mean need finish
        let articleLoadStatus =
          paginate.current_page == paginate.last_page ? 2 : 1;
        that.data.hotPage = paginate.current_page + 1;
        that.setData({
          hotArticles: hotArticles,
          hotArticleLoadStatus: articleLoadStatus
        });
        //
      });
    });
  },

  //
  onReachBottom: function() {
    let flag = this.data.switch;
    let that = this;
    this.setData({
      articleLoadStatus: 1
    });
    switch (flag) {
      case "hot":
        if (this.data.hotArticleLoadStatus == 2) {
          console.log("All loaded");
          return;
        }
        that.loadHotArticle();
        break;
      case "recent":
        if (this.data.recentArticleLoadStatus == 2) {
          console.log("All loaded");
          return;
        }
        that.loadRecentArticle();
        break;
    }
    //
  },
  // switch hot from recent
  switch: function(event) {
    let currentTarget = event.currentTarget;
    let dataset = currentTarget.dataset;
    let dataSwitch = dataset.switch;

    this.setData({
      switch: dataSwitch
    });
    //
    let flag = this.data.switch;
    console.log(flag);
  },
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
    let title = "为留学生打造的专业二手交易平台";
    let path = "/pages/index/index";
    let imageUrl =
      "http://static.124115.com/static/program/img/index/share.png";
    //
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      // complete start
      complete: function(res) {
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
  //
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
  /* share */
  /* guide start */
  initGuide() {
    let that = this;
    wx.getStorage({
      key: "index_guide",
      success: res => {
        that.setData({
          guideStatus: 1
        });
      },
      fail: res => {
        that.setData({
          guideStatus: 0
        });
      }
    });
  },
  closeGuide() {
    this.setData({
      guideStatus: 1
    });
    wx.setStorage({
      key: "index_guide",
      data: Date.now()
    });
  },
  preventTouchMove: function(e) {
    this.setData({
      modal: !this.data.modal
    });
  },
  /* guide end */
  sendCode: function(e) {
    var that = this;
    var times = 0
    var i = setInterval(function() {
      times++;
      that.queryMultipleNodes();
      var top = that.data.top;
      console.log(top)
      if (top <= 0) {
        that.setData({
          topTabClass: "scroll-header"
        })
      } else {

      }
    }, 100)
  },

  queryMultipleNodes: function() {
    let that = this;
    var query = wx.createSelectorQuery()
    query.select('#the-id').boundingClientRect()
    query.selectViewport().scrollOffset()

    query.exec(function(res) {
      var top = res[0].top
      // #the-id节点的上边界坐标
      that.setData({
        top: res[0].top
      })
    })

  },
  goPublish(){
    wx.navigateTo({
      url: '/pages/publish/index',
    })
  }
});