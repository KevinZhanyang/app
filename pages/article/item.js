//
import {
  Article
} from '../../model/article';
import {
  Message
} from '../../model/message';
import {
  Like
} from '../../model/like';
import {
  Packet
} from '../../model/packet';
import {
  Share
} from '../../model/share';
import {
  User
} from '../../model/user';
var uploadImage = require('../../utils/uploadFile.js');
//
const appInstance = getApp();
//
var util = require("../../utils/util.js");
//
Page({
  data: {
    currentIndex: 0,
    // article
    article: {},
    articleImgs: [],
    user: {},
    // collect: 0 no collection|1 collected
    collect: -1,
    //
    messages: [],
    // like 
    like: [
      '赞',
      '已赞',
    ],
    tradeWay: [{
      id: 1,
      name: "自取"
    }, {
      id: 2,
      name: "送货上门"
    }, {
      id: 3,
      name: "邮寄",
      state: 1
    }],
    likeValue: "/static/img/wanted.png",
    // relay
    parentId: 0,
    replyId: 0,
    content: '', // 留言内容
    //
    messageKey: 0, // 附加子留言时有用
    placeholder: '问问更多细节',
    focus: false, // 输入框是否获取焦点
    sendDisabled: false,
    // packet
    packetCount: 0,
    // rule
    ruleStatus: false,
    // closeCongratulate
    receiveRedPacketInterface: false,
    currentPacket: {},
    // scroll
    showCopyWechatInterface: false,
    // 
    showShadow: true,
    // 显示警告内容
    showWarnging: false,
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    //预览图片
    wx.previewImage({
      current: current,
      urls: [current],
    });
  },


  getSystemInfo: function () {
    var t = this;
    wx.getSystemInfo({
      success: function (a) {
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

  sys: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight,
          canvasWidth: res.screenWidth / 750 * 750,
          canvasHeight: res.screenWidth / 750 * 1089
        })
      },
    })
  },
  bginfo: function () {
    var that = this;

  },

  bgCover: function (bgCover) {
    var that = this;
    wx.downloadFile({
      url: bgCover.replace("http://img.beimei2.com", "https://used-america.oss-us-west-1.aliyuncs.com"), //注意公众平台是否配置相应的域名
      success: function (res) {
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
          success: function (res) {
            that.setData({
              canvasimgbg: res.tempFilePath
            })
            that.bgQrcode(that.data.qrcodeUpdate);
          }
        })
      }
    })
  },
  bgQrcode: function (qrcodeUpdate) {
    var that = this;
    wx.downloadFile({
      url: qrcodeUpdate, //注意公众平台是否配置相应的域名
      success: function (res) {
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
  /**
  * 
  * @param {CanvasContext} ctx canvas上下文
  * @param {number} x 圆角矩形选区的左上角 x坐标
  * @param {number} y 圆角矩形选区的左上角 y坐标
  * @param {number} w 圆角矩形选区的宽度
  * @param {number} h 圆角矩形选区的高度
  * @param {number} r 圆角的半径
  */
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    // ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    // ctx.fill()
    ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  canvasdraw: function (canvas) {
    var that = this;
    var windowW = that.data.canvasWidth;
    var windowH = that.data.canvasHeight;
    var canvasimgbg = that.data.canvasimgbg;
    var canvasimg1 = that.data.bgCover;
    var qrcode = that.data.qrcode;

    canvas.drawImage(canvasimgbg, 0, 0, that.data.canvasWidth, that.data.canvasHeight);

    canvas.save()
    //设置图片阴影
    canvas.shadowOffsetX = -5;

    canvas.shadowOffsetY = 5;

    canvas.shadowBlur = 5;

    canvas.shadowColor = "rgba(0,0,0,1)";


    var w = that.data.coverwidth
    var h = that.data.coverheight
    var dw = 300 / w          //canvas与图片的宽高比
    var dh = 200 / h
    that.setData({
      dw: dw,
      dh: dh
    })
    var ratio
    // 裁剪图片中间部分
    if (w > 300 && h > 200 || w < 300 && h < 200) {
      if (dw > dh) {
        console.log(1)
        this.roundRect(canvas, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.82, 10);
        canvas.drawImage(canvasimg1, 0, (h - 200 / dw) / 2, w, 200 / dw, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.9)
      } else {
        console.log(2)
        this.roundRect(canvas, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.82, 10);
        canvas.drawImage(canvasimg1, (w - 300 / dh) / 2, 0, 300 / dh, h, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.9)
      }
    }
    // 拉伸图片
    else {
      if (w < 300) {
        console.log(3)
        this.roundRect(canvas, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.81, 10);
        canvas.drawImage(canvasimg1, 0, (h - 200 / dw) / 2, w, 200 / dw, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.81)
      } else {
        console.log(4)
        this.roundRect(canvas, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.81, 10);
        canvas.drawImage(canvasimg1, (w - 300 / dh) / 2, 0, 300 / dh, h, 38, 80, that.data.canvasWidth * 0.81, that.data.canvasWidth * 0.81)
      }
    }
    canvas.restore()
    // canvas.drawImage(canvasimg1, 0, that.data.coverheight / 4, that.data.coverwidth, that.data.coverheight / 2, 25, 80, that.data.coverwidth * 0.87, that.data.coverheight * 0.5);
    canvas.drawImage(qrcode, that.data.canvasWidth * 0.62, that.data.canvasHeight * 0.75, that.data.canvasWidth * 0.315, that.data.canvasHeight * 0.215);
    if (this.data.article.content.length > 10) {
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(0, 7), 30, that.data.canvasHeight * 0.8)
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(7, 14), 30, that.data.canvasHeight * 0.8 + 30)
    } else {
      canvas.setFontSize(24)
      canvas.fillText(this.data.article.content.slice(0, 7), 30, that.data.canvasHeight * 0.8)
    }
    canvas.draw(false, setTimeout(function () {

      that.daochu();
    }, 500));
  },
  daochu: function () {
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
      success: function (res) {
        console.log(res)
        that.upload(res);
      },
      error: function (err) {
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
      function (result) {
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
        Article.update(updateData).then(res => { })
        wx.hideLoading();
      },
      function (result) {
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
      wx.showLoading({ title: "图片加载中"})
      that.data.setInter = setInterval(          function  () {
        if (that.data.qrcode) {
          wx.hideLoading();
          clearInterval(that.data.setInter)
          var canvas = wx.createCanvasContext('shareCanvas');
          that.canvasdraw(canvas);
        }
      }    , 2000);
    }else{
      if (!that.data.qrcodeUrl){
        wx.showLoading({
          title: "图片加载中"
        })
        that.data.setInter = setInterval(          function () {
          if (that.data.qrcodeUrl) {
            wx.hideLoading();
            clearInterval(that.data.setInter)
          }
        }    , 1000);
      }
   

    }
  },
  saveImg() {
    let that = this;
    wx.showLoading({})
    if (!that.data.qrcodeUrl) {
      that.data.setInter = setInterval(          function  () {
        if (that.data.qrcodeUrl) {
          clearInterval(that.data.setInter)
          wx.getImageInfo({
            src: that.data.qrcodeUrl,
            success: function (result) {
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
            error: function (err) {
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
        success: function (result) {
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
        error: function (err) {
          console.log("--------->>>>>>>");
          console.log(err);
          wx.hideLoading()
        }
      })
    }
  },
  loadShare(articleId) {
    let that = this;
    Share.getShareImg(articleId)
      .then(res => {
        let result = res.data;
        that.setData({
          shareImg: result.thumbnail,
        });
        that.bgCover(result.thumbnail);
      });
  },
  //
  onLoad(options) {
    let articleId = 0;
    if (options.q != undefined) {
      let url = 'https://used.124115.com/regular?id=125';
      articleId = 125;
    } else {
      articleId = options.id;
    }
    if(options.scene){
      articleId = encodeURIComponent(options.scene),
        options.id = articleId
    }
    let that = this;
    User.getCurrentUser().then(res => {
      that.setData({
        currentUser: res.data.body
      })
    })
   
    /*
    wx.showLoading({
        title: 'loading',
        mask: true,
    });
   
    */
    // 如果没有授权地理位置，转到授权
    User.testAuthorizeUserLocation()
      .then(res => {
        //
        User.testAuthorizeUserInfo()
          .then(res => {
            //
            //wx.hideLoading({});
            that.setData({
              showShadow: false,
            });
            //
            that.loadArticle(articleId);


            // collect 
            that.loadCollect(articleId);

            // message
            that.loadMessage(articleId);

            // like
            that.loadLike(articleId);

            // packet 
            that.loadPacket(articleId);

            // 初始化来判断是否分享到群
            that.prepareShare();
            //
          })
          .catch(res => {
            console.log('========== 进入个人中心页面，用户信息末授权，转向/pages/authorization/info');
            let from = encodeURIComponent('/pages/article/item?id=' + articleId);
            let url = '/pages/authorization/info?from=' + from;
            wx.redirectTo({
              url: url,
            });
          });
        //
      })
      .catch(res => {
        console.log('========== 进入地址授权页，转向/pages/authorization/location');
        let from = encodeURIComponent('/pages/article/item?id=' + articleId);
        let url = '/pages/authorization/location?from=' + from;
        wx.redirectTo({
          url: url,
        });
        return;
      });
  },
  longpressMessage(event) {
    //
    wx.showToast({
      title: '00000',
    });
    console.log(event);
  },
  //
  prepareShare() {
    wx.showShareMenu({
      // shareTicket 是获取转发目标群信息的票据，只有拥有 shareTicket 才能拿到群信息，用户每次转发都会生成对应唯一的shareTicket 。
      withShareTicket: true
    });
  },
  // LIKE START 
  loadLike(articleId) {
    //
    let that = this;
    Like.get(articleId)
      .then(result => {
        let like = result.data;
        var likeKeys = Object.keys(like);
        let value = likeKeys.length == 0 ? 0 : 1;
        that.setData({
          likeValue: value == 1 ? "/static/img/wanted.png" : "/static/img/want.png",
        });
        //
      });
  },

  // 
  like() {
    //
    let that = this;
    let articleId = this.data.article.id;
    // 取消点赞
    if (this.data.likeValue == 1) {
      /*
      let article = that.data.article;
      article.likes -= 1;
      Like.del(articleId)
      .then(result => {
          that.setData({
              likeValue: 0,
              article: article,
          });
      });
      */
      // 点赞
    } else {
      //
      Like.post(articleId)
        .then(res => {
          //
          let result = res.data;

          // 原来没有赞过，成功赞
          if (result.code == 0) {
            //
            let article = that.data.article;
            article.likes += 1;
            that.setData({
              likeValue: "/static/img/wanted.png",
              article: article,
            });
            // 提示获取了多少积分
            if (result.score > 0) {
              let title = '获取了' + result.score + '获分';
              wx.showToast({
                title: title,
                icon: 'success',
                duration: 2000
              });
              //
            }
          }
          //
        });
      //
    }
    that.collect();
  },
  /* LIKE END */
  /* ARTICLE START */
  loadArticle(articleId = 0) {
    //
    if (articleId == 0) {
      articleId = this.data.article.id;
    }

    //
    let that = this;
    User.getLocation()
      .then(res => {
        let coordinate = res;
        //
        Article.item(articleId, coordinate)
          .then(result => {
            let article = result.data;
            let user = article.user;
            var tradeList = [];
            if (article.tarde_way) {

              var trade = article.tarde_way.split(",");
              trade.map((item) => {
                tradeList.push(item == "1" ? "自取" : (item == "2" ? "送货上门" : (item == "3" ? "邮寄" : "可商量")))
              })

              that.setData({
                tradeList: tradeList
              });

            }

            if (article.circle_img.indexOf("circle") >= 0 || !article.circle_img){
              //开始画图
              console.log("---------------------<<<<<<<<<<<<<<1111");
              if (article.share_img){
                that.setData({
                  canvasIndex: 0,
                  qrcodeUpdate: article.share_img
                })
                console.log();
                that.sys();
                that.bginfo();
                that.getSystemInfo();
                that.loadShare(articleId)
              }else{
                //更新二维码；并返回二维码连接；
                var updateData = {
                  id: article.id
                }
                Article.update(updateData).then(res => {
                  let qrcodeUrl = res.data.body;
                  that.setData({
                    canvasIndex: 0,
                    qrcodeUpdate: qrcodeUrl
                  })
                  console.log(qrcodeUrl);
                  console.log(that.data);
                  that.sys();
                  that.bginfo();
                  that.getSystemInfo();
                  that.loadShare(articleId)
                })
              }
              
             }else{
              // 下载分享给用户|群的照片
              that.loadCircleImg(articleId);

             }
            //
            that.setData({
              article: article,
              user: user,
            });
            //
            if (article.add_score > 0) {
              let scores = '获得了' + article.add_score + '积分';
              wx.showToast({
                title: scores,
                icon: 'success',
                duration: 2000
              });
            }
            that.loadArticleImg(articleId);
            //
          });
        //
      });


  },
  // download img of the article
  loadArticleImg(articleId) {
    if (this.data.article.no_page != 1) {
      let that = this;
      Article.getImg(articleId)
        .then(res => {
          let articleImgs = res.data;
          that.setData({
            articleImgs: articleImgs,
          });
        });
    }

  },
  inform() {

    wx.showActionSheet({
      itemList: ['出售禁售品',
        '假冒品牌',
        '疑似欺诈',
        '人身攻击',
        '泄露隐私',
        '垃圾广告'
      ],
      success: function(res) {
        console.log(JSON.stringify(res))
        console.log(res.tapIndex) // 用户点击的按钮，从上到下的顺序，从0开始
        if (res.tapIndex == 0) {

        } else if (res.tapIndex == 1) {

        } else if (res.tapIndex == 2) {

        } else if (res.tapIndex == 3) {

        } else if (res.tapIndex == 4) {

        } else if (res.tapIndex == 5) {

        }
        wx.showModal({
          title: '提示',
          content: '举报成功，我们将尽快处理，感谢您的支持！',
          showCancel: false
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '您取消了举报',
          showCancel: false
        })
      }
    })

  },
  // preview image
  previewImage(event) {
    //
    let key = event.currentTarget.dataset.key;
    let images = this.data.articleImgs;
    let imageUrls = [];
    for (let x in images) {
      imageUrls.push(images[x].img);
    }
    let imageUrl = images[key].img;
    //
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    });
  },
  /* ARTICLE END */
  /* RED PACKET START */
  showPacketRulePopupWindow() {
    this.setData({
      ruleStatus: true,
    });
  },
  closePacketRulePopupWindow() {
    this.setData({
      ruleStatus: false,
    });
  },
  // 操作完后同步远程数据到本地
  /*
  synchronizationPacket() {
      let articleId = this.data.article.id;
      this.loadPacket(articleId);
  },
  */
  loadPacket(articleId) {
    //
    let that = this;
    Packet.count(articleId)
      .then(result => {
        let count = result.data;
        that.setData({
          packetCount: count,
        });
      });
    //
  },
  // 
  openGetRedPacketPopupWindow(event) {
    // 当前是否拆过红包
    let that = this;
    let articleId = this.data.article.id;
    Packet.can(articleId)
      .then(res => {
        let result = res.data;
        if (result.code == 0) {
          that.setData({
            receiveRedPacketInterface: true,
          });
        } else {
          //
          let title = result.msg;
          wx.showToast({
            title: title,
            duration: 2000
          });
          //
        }
      });
  },
  closeGetRedpacketPopupWindow() {
    this.setData({
      receiveRedPacketInterface: false,
    });
  },
  // 领红包
  postPacket() {
    //
    let that = this;
    let articleId = this.data.article.id;
    //
    Packet.post(articleId)
      .then(res => {
        // 同步
        let result = res.data;
        if (result.code == 0) {
          //
          /*
          let packet = result.data;
          let title = '已领取' + packet.number + '积分';
          wx.showToast({
              title: title,
              icon: 'success',
              duration: 2000,
              success: function() {
                  //
              }
          });
          */

          //
          let packetCount = this.data.packetCount;
          that.setData({
            receiveRedPacketInterface: false,
            packetCount: packetCount + 1,
          });

          // 同步当前页面数据，以保证返回页面时数据是更新过的
          /* that.synchronizationPacket(); */

          //
          let url = '/pages/packet/index?article_id=' + articleId;
          wx.navigateTo({
            url: url,
          });
          //
        }
        // 如何失败先不做处理
        //
      })
      .catch(result => {
        console.log(result);
      });
  },
  /* RED PACKET END */
  /* COLLECT START */
  loadCollect(articleId = 0) {
    //
    if (articleId == 0) {
      articleId = this.data.article.id;
    }

    let that = this;
    Article.getCollect(articleId)
      .then(result => {
        let collect = result.data;
        /* 
    		let collect = {
				count: 0
    		}
    		*/
        let count = collect.count;
        that.setData({
          collect: count,
        });
      });
  },
  //
  collect() {
    let collect = this.data.collect;
    let articleId = this.data.article.id;
    let that = this;
    if (collect == 0) {
      Article.collect(articleId)
        .then(() => {
          that.loadCollect();
        });
      that.showCollectNotify();
      //
    } else {
      Article.uncollect(articleId)
        .then(() => {
          that.loadCollect();
        });
      that.showCollectNotify();
    }
  },
  //
  showCollectNotify(str = '成功') {
    wx.showToast({
      title: str,
      icon: 'success',
      duration: 2000
    });
  },
  /* COLLECT END */
  /* MESSAGE START */
  loadMessage(articleId) {
    let that = this;
    Message.get(articleId)
      .then(result => {
        let messages = result.data;
        this.setData({
          messages: messages,
        });
      });
  },
  // 解除留言给别人， 并且焦点
  releaseMessageRelationship_() {
    this.releaseMessageRelationship();
    this.setData({
      focus: true,
    });
  },
  releaseMessageRelationship() {
    this.setData({
      parentId: 0,
      replyId: 0,
      content: '', // 留言内容
      working: false, // true|显示输入框,false|显示功能
      placeholder: '问问更多细节',
      focus: false, // 输入框是否获取焦点
      sendDisabled: false,
    });
  },
  // 
  reply(event) {
    console.log('>>>>>>>>>>>>>>>>>>> reply');
    console.log(event);

    // 读取数据
    let messageKey = event.currentTarget.dataset.key;
    let parentId = event.currentTarget.dataset.parentId;
    let replyId = event.currentTarget.dataset.replyId;
    let childrenKey = event.currentTarget.dataset.childrenKey;

    // 如果是回复主留言
    let messages = this.data.messages;
    let placeholder = '回复@';
    if (childrenKey == -1) {
      let nickname = messages[messageKey].parent.user.nickname;
      placeholder += nickname;
    } else {
      let nickname = messages[messageKey]['childrens'][childrenKey].user.nickname;
      placeholder += nickname;
    }


    // 获取焦点
    this.setData({
      messageKey: messageKey,
      parentId: parentId,
      replyId: replyId,
      // content: '', // 留言内容
      placeholder: placeholder,
      focus: true, // 输入框是否获取焦点
      // sendDisabled: false, 
    });
  },
  // 
  longpressParentMessage(event) {
    // 如果是自已
    console.log(event);
    let that = this;

    if (event.currentTarget.dataset.userId == this.data.currentUser.recId) {

      wx.showModal({
        title: '温馨提示',
        content: '确认删除留言？',
        success: function(res) {
          if (res.confirm) {

            Message.delete(event.currentTarget.dataset.replyId).then(res => {
              if (res.data.code == 200) {
                wx.showLoading({
                  title: '删除成功',
                  duration: 1000
                })

                that.loadMessage(that.data.article.id);

              } else {
                wx.showLoading({
                  title: '删除失败',
                  duration: 1000
                })
              }



            })





          }
        }

      })


    }

  },
  //
  longpressChildMessage(event) {
    let that = this;

    if (event.currentTarget.dataset.userId == this.data.currentUser.recId) {

      wx.showModal({
        title: '温馨提示',
        content: '确认删除留言？',
        success: function(res) {
          if (res.confirm) {

            Message.delete(event.currentTarget.dataset.replyId).then(res => {
              if (res.data.code == 200) {
                wx.showLoading({
                  title: '删除成功',
                  duration: 1000
                })

                that.loadMessage(that.data.article.id);

              } else {
                wx.showLoading({
                  title: '删除失败',
                  duration: 1000
                })
              }



            })





          }
        }

      })


    }
  },
  // 
  updateContent(event) {
    //
    let detail = event.detail;
    let value = detail.value;
    this.setData({
      content: value,
    });
  },
  send(event) {
    // messageKey
    // 留言内容
    let content = this.data.content;
    if (content.length == 0) {
      this.displayInformation('留言内容不能为空');
      return;
    }

    // 取消重复留言
    if (this.data.sendDisabled == true) {
      // this.displayInformation('正在提交留言');
      return;
    }

    // 开始留言
    wx.showLoading({
      title: '留言发送中',
      mask: true,
    });
    this.setData({
      sendDisabled: true,
    });

    // parent_id
    let parentId = this.data.parentId;
    let replyId = this.data.replyId;
    let formId = event.detail.formId; // for template 
    // let content = this.data.content; // 
    let articleId = this.data.article.id;

    //
    let item = {
      articleId: articleId,
      replyId: replyId,
      content: content,
      formId: formId,
      parentId: parentId,
    };
    // 
    let that = this;
    let messageKey = this.data.messageKey;
    Message.create(item)
      .then(res => {
        // that.displayInformation('发布成功');
        wx.hideLoading({});

        //
        let result = res.data.body;

        let message = {
          article_id: result.message.articleId,
          reply_id: result.message.replyId,
          content: result.message.content,
          form_id: result.message.formId,
          parent_id: result.message.parentId,
          id: result.message.id,
          updated_t: result.message.updatedAt,
          userId: result.message.userId,
          created_t: result.message.createdAt
        }

        let user = {

          avatar: result.user.avatar,
          created_at: result.user.createdAt,
          gender: result.user.gender,
          id: result.user.id,
          is_partner: result.user.isPartner,
          is_tester: result.user.isTester,
          nickname: result.user.nickname,
          openid: result.user.openid,
          phone: result.user.phone,
          province: result.user.province,
          scores: result.user.scores,
          status: result.user.status,
          updated_at: result.user.updatedAt,
          wechat: result.user.wechat
        }

        let combination = {
          message: message,
          user: user
        }

        let messages = that.data.messages;
        console.log(messages);
        // 添加主留言
        if (combination.message.parent_id == 0) {
          messages.unshift({
            parent: combination
          });
          // 添加子留言
        } else {
          if (messages[messageKey].hasOwnProperty('childrens')) {
            messages[messageKey]['childrens'].unshift(combination);
          } else {
            messages[messageKey]['childrens'] = [
              combination,
            ];
          }
        }
        that.setData({
          messages: messages,
        });
        //
        that.releaseMessageRelationship();

        // score start
        let score = result.score;
        if (score > 0) {
          let title = '获取了' + score + '积分';
          wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
          });
        }
        // score end 
      });
  },
  //
  /* MESSAGE END */
  /* FUNCTION START */
  displayInformation(str = '成功') {
    wx.showToast({
      title: str,
      icon: 'none',
      duration: 2000
    });
  },
  //
  call() {
    //
    this.setData({
      showWarnging: true,
    });

    let phone = this.data.article.phone;
    if (phone.length == 0) {
      phone = '卖家没有设置手机号';
    }

    //
    let that = this;
    setTimeout(function() {
      //
      wx.makePhoneCall({
        phoneNumber: phone,
      });
      setTimeout(function() {
        that.setData({
          showWarnging: false,
        });
      }, 5000);
      //
    }, 500);
  },
  // FUNCTION END
  closeCongratulate() {
    this.setData({
      congratulate: false,
    });
  },
  /* FUNCTION END */
  /* share start */
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
    let title = this.data.article.content;
    let path = '/pages/article/item?id=' + this.data.article.id;
    let articleImgs = this.data.articleImgs;
    let imageUrl = '';
    for (let x in articleImgs) {
      if (articleImgs[x].is_cover == 1) {
        imageUrl = articleImgs[x].img;
        break;
      }
    }
    //
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      // complete start 
      complete: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log('share success');
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
  /* share end */
  /* 返回首页 */
  redirectToIndex() {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
  /* COPY WECHAT START */
  showCopyWechatInterface() {
    //
    this.setData({
      showWarnging: true,
    });

    //
    let that = this;
    setTimeout(function() {
      //
      that.setData({
        showCopyWechatInterface: true,
      });
      setTimeout(function() {
        that.setData({
          showWarnging: false,
        });
      }, 5000);
      //
    }, 500);
  },
  // 阻目下层页面划动
  preventTouchMove() {
    this.setData({
      showShareMoment: false,
      canvasIndex:1
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
  copyWchatCancel() {
    this.setData({
      showCopyWechatInterface: false,
    });
  },
  copyWchat() {
    //
    let that = this;
    let wechat = this.data.article.wechat;

    wx.setClipboardData({
      data: wechat,
      success: function(res) {
        /*
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
        */
        　　　　　　　
        wx.showToast({　　　　　　　　　
          title: '微信号复制成功',
          duration: 2000,
          　　　　　　　
        });
        that.setData({
          showCopyWechatInterface: false,
        });
        //
      }
    });
    //
  },
  /* circle start */
  loadCircleImg(articleId) {
    //
    let that = this;
    Share.getCircleImg(articleId)
      .then(res => {
        let img = res.data;
        that.setData({
          circleImg: img.replace("http://img.beimei2.com", "https://used-america.oss-us-west-1.aliyuncs.com"),
        });
        wx.getImageInfo({
          src: img.replace("http://img.beimei2.com", "https://used-america.oss-us-west-1.aliyuncs.com"),
          success: function(result) {
            console.log("--------->>>>>>>");
            console.log(result);
            that.setData({
              qrcodeUrl: result.path
            })
          },
          error: function(err) {
            console.log("--------->>>>>>>");
            console.log(err);
          }
        })
      });
    //
  }
  /* COPY WECHAT END */
});