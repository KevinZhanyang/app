//
import { Article } from '../../model/article';
import { Message } from '../../model/message';
import { Like } from '../../model/like';
import { Packet } from '../../model/packet';
import { Share } from '../../model/share';
import { User } from '../../model/user';

//
const appInstance = getApp();

//
Page({
    data: {
      currentIndex:0,
        // article
        article: {},
        articleImgs: [],
        user: {},
        // collect: 0 no collection|1 collected
        collect: -1,
        //
        messages:[],
        // like 
        like: [
            '赞',
            '已赞',
        ],
      tradeWay: [{ id: 1, name: "自取" }, { id: 2, name: "送货上门" }, { id: 3, name: "邮寄", state: 1 }],
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
        currentPacket:{},
        // scroll
        showCopyWechatInterface: false,
        // 
        showShadow: true,
        // 显示警告内容
        showWarnging: false,
    },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    //预览图片
    wx.previewImage({
      current: current,
      urls: [current],
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

        let that = this;

      User.getCurrentUser().then(res => {
        that.setData({
          currentUser:res.data.body
        })


      })
      // 下载分享给用户|群的照片
      this.loadCircleImg(articleId); 
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
                that.loadArticleImg(articleId);
        
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
            title:'00000',
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
              likeValue: value == 1 ? "/static/img/wanted.png" :"/static/img/want.png",
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
              article.tardeWay = article.tarde_way == "1" ? "自取" : (article.tarde_way == "2" ? "送货上门" : (article.tarde_way == "3" ? "邮寄":"可商量"))
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
                //
            });
            //
        });
    },
    // download img of the article
    loadArticleImg(articleId) {
        let that = this;
        Article.getImg(articleId)
        .then(res => {
            let articleImgs = res.data;
            that.setData({
                articleImgs: articleImgs,
            });
        });
    },
  inform(){
    wx.showModal({
      title: '提示',
      content: '举报成功，我们将尽快处理，感谢您的支持！',
      showCancel:false
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
    showPacketRulePopupWindow () {
        this.setData({
            ruleStatus: true,
        });
    },
    closePacketRulePopupWindow () {
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
    openGetRedPacketPopupWindow(event) 
    {
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
        .catch (result => {
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
    releaseMessageRelationship_ () {
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
    longpressParentMessage(event) 
    {
        // 如果是自已
        console.log(event);
        let that =this;

      if (event.currentTarget.dataset.userId==this.data.currentUser.recId){

              wx.showModal({
                title: '温馨提示',
                content: '确认删除留言？',
                success:function(res){
                   if(res.confirm){

                     Message.delete(event.currentTarget.dataset.replyId).then(res=>{
                       if(res.data.code==200){
                         wx.showLoading({
                           title: '删除成功',
                           duration: 1000
                         })

                         that.loadMessage(that.data.article.id) ;
                         
                       }else{
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
    longpressChildMessage(event) 
    {
      let that = this;

      if (event.currentTarget.dataset.userId == this.data.currentUser.recId) {

        wx.showModal({
          title: '温馨提示',
          content: '确认删除留言？',
          success: function (res) {
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
    updateContent(event)
    {
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
            article_id: articleId,
            reply_id: replyId,
            content: content,
            form_id: formId,
            parent_id: parentId,
        };
        // 
        let that = this;
        let messageKey = this.data.messageKey;
        Message.post(item)
        .then(res => {
            // that.displayInformation('发布成功');
            wx.hideLoading({});
            
            //
            let result = res.data;
            let combination = result.message;
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
        setTimeout(function(){
            //
            wx.makePhoneCall({
                phoneNumber: phone,
            });
            setTimeout(function(){
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
        for(let x in articleImgs) {
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
        setTimeout(function(){
            //
            that.setData({
                showCopyWechatInterface: true,
            });
            setTimeout(function(){
                that.setData({
                    showWarnging: false,
                });
            }, 5000);
            //
        }, 500);
    },
    // 阻目下层页面划动
    preventTouchMove() {
        //
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
          circleImg: img,
        });
      });
    //
  },
  // 下载朋友圈照片
  loadShare(articleId) {
    //
    let that = this;
    Share.getShareImg(articleId)
      .then(res => {
        let result = res.data;
        that.setData({
          shareImg: result.thumbnail,
        });
      });
  },
  showCircleImg() {
    // this.setData({
    //   showShareMoment:true
    // })

    //
    let url = this.data.circleImg;
    if (url.length == 0) {
      setTimeout(function () {
        //
        if (ulr.length == 0) {
          //
          setTimeout(function () {
            //
            wx.previewImage({
              urls: [
                url,
              ],
            });
            //
          }, 500);
          //
        } else {
          //
          wx.previewImage({
            urls: [
              url,
            ],
          });
          //
        }
        //
      }, 500);
    } else {
      wx.previewImage({
        urls: [
          url,
        ],
      });
    }
    
  },
    /* COPY WECHAT END */
});