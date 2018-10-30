//
import { User } from '../../model/user';
import { Article } from '../../model/article';
import { Promotion } from '../../model/promotion';

//
Page({
    data: {
        // articles
        articles: [],
        // 
        option: 0,
        // 上加的商品数量
        onNumber: 0,
        // 下架的商品数量
        offNumebr: 0,
    },
    //
    onShow() {
    	this.loadArticle();
    },
    onUnload() {
        //
    },
    //
    loadArticle() {
    	let that = this;
    	Article.getPublished()
    	.then(result => {
    		let articles = result.data;
            let onNumber = 0;
            let offNumebr = 0;
            for (let x in articles) {
                if (articles[x].on_offer == 0) {
                    onNumber++;
                } else {
                    offNumebr++;
                }
            }
    		that.setData({
    			articles: articles,
                onNumber: onNumber,
                offNumebr: offNumebr,
    		});
    	});
    },
    /* options start */
    updateOption(event) {
        let key = event.currentTarget.dataset.key;
        this.setData({
            option: key,
        });
    },
    /* options end */
    /* sp */
    redirectToEdit(event) {
        let target = event.target;
        let dataset = target.dataset;
        let id = dataset.id;
        let url = '/pages/home/article?id=' + id;
        wx.navigateTo({
            url: url, 
        });
    },
    /* sp */
    refresh(event) {
        //
        let that = this;
        //
        let currentTarget = event.currentTarget;
        let dataset = currentTarget.dataset;
        let key = dataset.key;
        let articles = this.data.articles;
        let article = articles[key];

        if (article.hasOwnProperty('polished')) {
            return;
        }

        // 刷新成功|失败提示今天的刷新次数已用
        Article.refresh(article['id'])
        .then(res => {
            let result = res.data;
            if (result.code != 0) {
                //
                wx.showToast({
                    title:'已超出今日刷新次数',
                });
                return;
            }
            //
            articles[key].polished = true;
            that.setData({
                articles: articles,   
            });
            //    
        });


    },
    /* polish end */
    /* on_offer start */
    offer(event) {
        //
        let currentTarget = event.currentTarget;
        let dataset = currentTarget.dataset;
        let offer = dataset.offer;
        let content = offer == 0 ? '要下架吗?' : '要上架吗?';

        //
        wx.showModal({
            title:'提示',
            content: content,
            success: res => {
                if (res.confirm) {
                    //
                    let that = this;
                    let key = dataset.key;
                    let articles = that.data.articles;
                    let article = articles[key];
            
                    let status = article.on_offer == 0 ? 1 : 0;
                    articles[key].on_offer = status;

                    // 
                    let onNumber = this.data.onNumber;
                    let offNumebr = this.data.offNumebr;
                    // 下载
                    if (status == 0) {
                        onNumber--;
                    } else {
                        offNumebr++;
                    }
            
                    //
                    Article.polish(article.id, status)
                    .then(res => {
                        that.setData({
                            articles: articles,   
                            onNumber: onNumber,
                            offNumebr: offNumebr,
                        });
                    });
                    //
                } 
            }
        });
    },
    /* on_offer end */
    /* promotion start */
    promotion(event) {
        //
        let currentTarget = event.currentTarget;
        let dataset = currentTarget.dataset;
        let key = dataset.key;
        let articles = this.data.articles;
        let article = articles[key];

        //
        if (article.promotion == 1) {
            return;
        }

        //
        let that = this;
        //
        Promotion.isPartner()
        .then(res => {
            let result = res.data;
            // 不是合伙人
            if (result.code == 1) {
                //
                wx.showToast({
                    title:'只有合伙人有置顶功能',
                    icon: 'none',
                });
                wx.showModal({
                    title:'提示',
                    content: '您不是合伙人，没有置顶功能，现在就去查看如何成为合伙人?',
                    showCancel: true,
                    cancelText: '不去',
                    confirmText:'去查看',
                    success: res => {
                        console.log(res);
                        if (res.confirm == true) {
                            wx.redirectTo({
                                url: '/pages/partner/poster',
                            });
                        }
                    },
                });
                //
            // 是合伙人
            } else {
                // 看用户是否有置顶次数 promotion/count
                Promotion.count()
                .then(res => {
                    let result = res.data;
                    if (result.errcode == 0) {
                        // 有置顶次数，提示用户是否要置顶
                        if (result.count > 0) {
                            //
                            let content = '您共有' + result.count + '次置顶,置顶当前信息?';
                            wx.showModal({
                                title: '置顶',
                                content: content,
                                success: res => {
                                    // 用户要置顶
                                    if (res.confirm == true) {
                                        //
                                        let articleId = article.id;
                                        Promotion.post(articleId)
                                        .then(res => {
                                            // 置顶成功,更新本地
                                            wx.showToast({
                                                title: '此条信息已置顶7天',
                                            });
                                            //
                                            articles[key].promotion = 1;
                                            that.setData({
                                                articles: articles,
                                            });
                                        });
                                        //
                                    } else {
                                        console.log('用户取消置顶');
                                    }
                                },
                                fail: res => {
                                    console.log('ppp');
                                }
                            });
                        // 提示用户没有置顶次数
                        } else {
                            wx.showToast({
                                title: '您没有置顶次数',
                            });
                        }
                    }
                });
                // END 
            }
            //
        });
    }
    /* promotion end */
});