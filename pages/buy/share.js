//
import { Article } from '../../model/article';
import { Share } from '../../model/share';

//
Page({
    data: {
        // 新闻
        article: {
            id: 0,
        },
        // articleImgs: [],
        // 分享
        shareImg:'', // 微信朋友|群的照片
        circleImg: '', // 朋友圈照片
        // 向导
        guideStatus: 0, // 0显示|1不显示
        //
        showDeclaration: false,
    },
    //
    onLoad(options) {
        //
        let articleId = options.id;
        
        // 下载新闻信息
        // this.loadArticle(articleId);

        // 下载朋友图照片
        this.loadCircleImg(articleId);

        // 下载分享给用户|群的照片
        this.loadShare(articleId); 
        // this.loadArticleImg(articleId); // 下载图片后下载

        // 初始化来判断是否分享到群
        this.prepareShare();
        
        // 初始化向导图
        this.initGuide();
    },
    //
    prepareShare() {
        wx.showShareMenu({
            // shareTicket 是获取转发目标群信息的票据，只有拥有 shareTicket 才能拿到群信息，用户每次转发都会生成对应唯一的shareTicket 。
            withShareTicket: true
        });
    },
    // 下载朋友圈照片
    loadShare(articleId) 
    {
        //
        let that = this;
        Share.getShareImg(articleId)
        .then(res => {
            let result = res.data;
            that.setData({
                article: result.article,
                shareImg: result.thumbnail,
            });
        });
    },
    /*
    loadArticle(articleId) {
        let that = this;
        Article.item(articleId)
        .then(result => {
            let article = result.data;
            that.setData({
                article: article,
            });
        });
    },
    */
    //
    /*
    loadArticleImg(articleId) {
        let that = this;
        Article.getImg(articleId)
        .then(res => {
            let images = res.data;
            let imageUrl = images[0].img;
            // let shareImgUrl = images[0].share_img;
            for (let x in images) {
                if (images[x].is_cover == 1) {
                    imageUrl = images[x].img;
                    // shareImgUrl = images[x].share_img;
                }
            }
            //
            that.setData({
                imageUrl: imageUrl,
                // shareImgUrl: shareImgUrl,
            });

            //
            that.getShareImg(articleId);
        });
    },
    */
    //
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
        //console.log('log share res: -----------------------');
        // console.log(res);
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
    showCircleImg() {
        //
        let url = this.data.circleImg;
        if (url.length == 0) {
            setTimeout(function(){
                //
                if (ulr.length == 0) {
                    //
                    setTimeout(function(){
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
            },500);
        } else {
            wx.previewImage({
                urls: [
                    url,
                ],
            });
        }
        //
    },
    /* circle end */
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