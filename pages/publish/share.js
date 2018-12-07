//
var util = require("../../utils/util.js");
import {
  Article
} from '../../model/article';
import {
  Share
} from '../../model/share';
import {
  Activity
} from "../../model/activity";
var uploadImage = require('../../utils/uploadFile.js');
//
Page({
  data: {
    // 新闻
    article: {
      id: 0,
    },

    // articleImgs: [],
    // 分享
    shareImg: '', // 微信朋友|群的照片
    circleImg: '', // 朋友圈照片
    // 向导
    guideStatus: 0, // 0显示|1不显示
    //
    showDeclaration: false,
    canvasIndex: 0
  },
  postPacket() {
    this.setData({
      receiveRedPacketInterface: false,
    });
    wx.navigateTo({
      url: "/pages/activity/index",
    })

  },
  closeGetRedpacketPopupWindow() {
    this.setData({
      receiveRedPacketInterface: false,
    });
  },
  // 阻目下层页面划动
  preventTouchMove() {
    this.setData({
      showShareMoment: false,
      canvasIndex: 1
    })

    wx.hideLoading();
  },
  closeshowShareMoment() {
    this.setData({
      showShareMoment: false,
      canvasIndex: 1
    })
    wx.hideLoading();
  },

  getSystemInfo: function() {
    var t = this;
    wx.getSystemInfo({
      success: function(a) {
        //screenWidth,screenHeight屏幕宽高
        var i = a.screenWidth / 750;
        t.setData({
          screenWidth: i,
          canvasWidth: a.screenWidth / 750 * 750,
          canvasHeight: a.screenWidth / 750 * 1089
        })
      }
    })
  },

  sys: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          canvasWidth: res.screenWidth / 750 * 750,
          canvasHeight: res.screenWidth / 750 * 1089
        })
      },
    })
  },
  bginfo: function() {
    var that = this;

  },

  bgCover: function(bgCover) {
    var that = this;
    wx.downloadFile({
      url: bgCover.replace("http://img.beimei2.com", "https://used-america.oss-us-west-1.aliyuncs.com"), //注意公众平台是否配置相应的域名
      success: function(res) {
        that.setData({
          bgCover: res.tempFilePath
        })
        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (resImg) {
            that.setData({
              coverwidth: resImg.width,
              coverheight: resImg.height,
            })
          }
        })
        wx.downloadFile({
          url: 'https://used-america.oss-us-west-1.aliyuncs.com/cbb/2018-12-02 18:39:45/1543747185095110.png', //注意公众平台是否配置相应的域名
          success: function(res) {
            that.setData({
              canvasimgbg: res.tempFilePath
            })
            that.bgQrcode();
          }
        })
      }
    })
  },
  bgQrcode: function() {
    var that = this;
    wx.downloadFile({
      url: this.data.article.share_img, //注意公众平台是否配置相应的域名
      success: function(res) {
        that.setData({
          qrcode: res.tempFilePath
        })

        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (resImg) {
            that.setData({
              qrcodewidth: resImg.width,
              qrcodeheight: resImg.height,
            })
          }
        })



      }
    })
  },
  canvasdraw: function(canvas) {
    var that = this;
    var windowW = that.data.canvasWidth;
    var windowH = that.data.canvasHeight;
    var canvasimgbg = that.data.canvasimgbg;
    var canvasimg1 = that.data.bgCover;
    var qrcode = that.data.qrcode;
   
    canvas.drawImage(canvasimgbg, 0, 0, that.data.canvasWidth, that.data.canvasHeight);

    canvas.save()
    canvas.shadowOffsetX = 5;

    canvas.shadowOffsetY = 5;

    canvas.shadowBlur = 5;

    canvas.shadowColor = "rgba(0,0,0,0.5)";
    var w = that.data.coverwidth
    var h = that.data.coverheight
    var dw = 300 / w          //canvas与图片的宽高比
    var dh = 200 / h
    that.setData({
      dw:dw,
      dh:dh
    })
    var ratio
    // 裁剪图片中间部分
    if (w > 300 && h > 200 || w < 300 && h < 200) {
      if (dw > dh) {
        console.log(1)
        canvas.drawImage(canvasimg1, 0, (h - 200 / dw) / 2, w, 200 / dw, 30, 100, 313, 250)
      } else {
        console.log(2)
        canvas.drawImage(canvasimg1, (w - 300 / dh) / 2, 0, 300 / dh, h, 30, 100, 313, 250)
      }
    }
    // 拉伸图片
    else {
      if (w < 300) {
        console.log(3)
        canvas.drawImage(canvasimg1, 0, (h - 200 / dw) / 2, w, 200 / dw, 30, 100, 313, 250)
      } else {
        console.log(4)
        canvas.drawImage(canvasimg1, (w - 300 / dh) / 2, 0, 300 / dh, h, 30, 100, 313, 250)
      }
    }

    canvas.restore()
    // canvas.drawImage(canvasimg1, 0, that.data.coverheight / 4, that.data.coverwidth, that.data.coverheight / 2, 25, 80, that.data.coverwidth * 0.87, that.data.coverheight * 0.5);




    canvas.drawImage(qrcode, that.data.canvasWidth * 0.60, that.data.canvasHeight * 0.71, that.data.canvasWidth * 0.35, that.data.canvasHeight * 0.24);
    if (this.data.article.content.length>10){
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(0, 7), 30, that.data.canvasHeight * 0.75)
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(7,14), 30, that.data.canvasHeight * 0.75 + 30)
    }else{
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(0, 7), 30, that.data.canvasHeight * 0.77)
    }
  
    canvas.draw(false, setTimeout(function() {
    
      that.daochu();
    }, 500));
  

  },
  daochu: function() {
    console.log('a');
    var that = this;
    var windowW = that.data.windowW;
    var windowH = that.data.windowH;
    wx.canvasToTempFilePath({
      // x: 0,
      // y: 0,
      // width: windowW,
      // height: windowH,
      // destWidth: windowW,
      // destHeight: 1089/2,
      // fileType:'jpg',
      // quality:1,
      canvasId: 'shareCanvas',
      success: function(res) {
        console.log(res)
        // that.setData(
        //   {
        //     canvasIndex: 1,
        //     qrcodeUrl: res.tempFilePath
        //   }
        // )
        that.upload(res);
      },
      error: function(err) {
        console.log(err)
      }
    })
  },
  upload(res) {
    console.log('b');
    let that = this;
    var nowTime = util.formatTime(new Date());
    console.log(res.tempFilePath);
    //上传图片
    //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
    //图片路径可自行修改
    uploadImage(res.tempFilePath, 'cbb/' + nowTime + '/',
      function(result) {
        console.log("======上传成功图片地址为：", result);
       
        that.setData({
          // canvasIndex:1,
          qrcodeUrl: result,
        })
        var updateData = {
          circleImg: result.replace("https://used-america.oss-us-west-1.aliyuncs.com/", ""),
          id: that.data.article.id
        }
        // console.log(articleId)
        Article.update(updateData).then(res => {})
        wx.hideLoading();
      },
      function(result) {
        console.log("======上传失败======", result);
        wx.hideLoading()
      }
    )
  },

  showCircleImg() {
    let that = this;
    this.setData({
      showShareMoment: true,
    })
    if (that.data.canvasIndex == 0) {
      wx.showLoading({})
      that.data.setInter = setInterval(          function () {
        if (that.data.qrcode) {
          wx.hideLoading();
          clearInterval(that.data.setInter)
          var canvas = wx.createCanvasContext('shareCanvas');
          that.canvasdraw(canvas);
        }
      }    , 2000);
    }
  },
  saveImg() {
    let that = this;
    wx.showLoading({})
    if (!that.data.qrcodeUrl) { 
      that.data.setInter = setInterval(          function () {
        if (that.data.qrcodeUrl) {
          clearInterval(that.data.setInter)
          wx.getImageInfo({
            src: that.data.qrcodeUrl,
            success: function(result) {
              console.log("--------->>>>>>>");
              console.log(result);
              wx.hideLoading()
              wx.saveImageToPhotosAlbum({
                filePath: result.path,
                success: (res) => {
                  that.setData({
                    showShareMoment: false,
                    canvasIndex: 1
                  })
                  wx.showLoading({
                    title: '保存成功',
                    duration: 1500,
                  })
                },
                fail: (err) => {
                  console.log(err)
                  that.setData({
                    showShareMoment: false,
                    canvasIndex: 1
                  })
                  wx.showLoading({
                    title: '保存失败',
                    duration: 1500,

                  })

                }
              })
            },
            error: function(err) {
              console.log("--------->>>>>>>");
              console.log(err);
              wx.hideLoading()
            }
          })



        }          
      }    , 2000);

    } else {
      wx.getImageInfo({
        src: that.data.qrcodeUrl,
        success: function(result) {
          console.log("--------->>>>>>>");
          console.log(result);
          wx.hideLoading()
          wx.saveImageToPhotosAlbum({
            filePath: result.path,
            success: (res) => {
              that.setData({
                showShareMoment: false,
                canvasIndex: 1
              })
              wx.showLoading({
                title: '保存成功',
                duration: 1500,
              })
            },
            fail: (err) => {
              console.log(err)
              that.setData({
                showShareMoment: false,
                canvasIndex: 1
              })
              wx.showLoading({
                title: '保存失败',
                duration: 1500,
              })
            }
          })
        },
        error: function(err) {
          console.log("--------->>>>>>>");
          console.log(err);
          wx.hideLoading()
        }
      })
    }
  },
  //
  onLoad(options) {
    let that = this;
    that.sys();
    that.bginfo();
    that.getSystemInfo();
    Activity.getActivity().then(res => {
      console.log(res)
      var array = [];
      if (wx.getStorageSync(res.data.body.code) == res.data.body.code) {

        wx.setStorageSync("limit", 1);
      } else {
        wx.setStorageSync(res.data.body.code, res.data.body.code);
        wx.setStorageSync("limit", 0);
      }
    });

    //2243
    let articleId = 2243;
    // // 下载新闻信息
    // this.loadArticle(articleId);
    this.loadShare(articleId);
    // 初始化来判断是否分享到群
    this.prepareShare();

    if (wx.getStorageSync("limit") != '1') {
      this.setData({
        receiveRedPacketInterface: true
      })
    }

  },
  //
  prepareShare() {
    wx.showShareMenu({
      // shareTicket 是获取转发目标群信息的票据，只有拥有 shareTicket 才能拿到群信息，用户每次转发都会生成对应唯一的shareTicket 。
      withShareTicket: true
    });
  },


  onShow() {
    // 初始化向导图
    this.initGuide();
  },

  loadArticle(articleId) {
    // let that = this;
    // Article.item(articleId)
    // .then(result => {
    //     let article = result.data;
    //     that.setData({
    //         article: article
    //     });

    // });
  },

  loadShare(articleId) {
    //
    let that = this;
    Share.getShareImg(articleId)
      .then(res => {
        let result = res.data;
        that.setData({
          article: result.article,
          shareImg: result.thumbnail,
        });
        that.bgCover(result.thumbnail);

      });
  },










  onShareAppMessage(res) {
    //
    let that = this;
    let title = this.data.article.content;
    let path = '/pages/article/item?id=' + this.data.article.id;
    let imageUrl = this.data.shareImg == 'http://img.beimei2.com/static/program/img/default/share.jpg?x-oss-process=style/small_thumbnail' ? 'http://static.124115.com/static/program/img/index/share.png' : this.data.shareImg;
    //
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      // complete start 
      complete: function(res) {
        //
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('share success');
          that.postShare();
        } else {
          console.log('share fail');
          wx.showToast({
            title: '分享失败',
          });
        }
        //
      },
      // complate end 
    }
    //
  },
  //
  postShare() {
    //
    Share.post()
      .then(result => {
        let shareLog = result.data;
        if (shareLog.number > 0) {
          let title = '获取了' + shareLog.number + '积分';
          wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
          });
        }
      })
      .then(returl => {
        //
      });
  },

  /* guide start */
  initGuide() {
    let that = this;
    wx.getStorage({
      key: 'publish_guide',
      success: res => {
        that.setData({
          guideStatus: 1,
        });
      },
      fail: res => {
        that.setData({
          guideStatus: 0,
        });
      }
    });
  },
  closeGuide() {
    this.setData({
      guideStatus: 1,
    });
    wx.setStorage({
      key: 'publish_guide',
      data: Date.now(),
    });
  },
  /* guide end */
  /* Declaration start */
  showDeclaration() {
    this.setData({
      showDeclaration: true,
    });
  },
  closeDeclaration() {
    this.setData({
      showDeclaration: false,
    });
  },
  /* Declaration end */
  //
});