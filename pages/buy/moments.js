//
import { Article } from '../../model/article';
//
Page({
    data: {
        // 
        article: {},
        // 向导
        guideStatus: 0, // 0显示|1不显示
    },
    //
    onLoad(options) {
        let articleId = options.id;
        this.loadArticle(articleId);
        // 初始化向导图
        this.initGuide();
    },
    loadArticle(articleId) {
        let that = this;
        Article.circle(articleId)
        .then(res => {
            let article = res.data;
            that.setData({
                article: article,
            });
        });
    },
    //
    storageToPhotoAlbum() {
        //
        wx.showLoading({
            title: '图片开始加载',
        });
        //
        let articleUrl = this.data.article.circle_img;
        wx.downloadFile({
            url: articleUrl,
            success (res) {
                wx.hideLoading();
                console.log('down load img success');
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    console.log(res);
                    let tmp = res.tempFilePath;
                    //               
                    wx.saveImageToPhotosAlbum({
                        filePath : tmp,
                        success(res) {
                            console.log("save image to photo album success" + tmp);
                            wx.showToast({
                                'title': '保存相册成功',
                            });
                        },
                        fail : function(res) {
                            console.log("save image to photo album fail");
                            wx.showToast({
                                'title': '保存相册失败',
                            });
                        },
                    });
                    //
                }
            }
        });
        //
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
        console.log('vvvvvvv');
        wx.setStorage({
            key: 'publish_guide',
            data: Date.now(),
        });
    },
    /* guide end */
    //
});