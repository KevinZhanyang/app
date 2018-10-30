//
import { Article } from '../../model/article';
import { User } from '../../model/user';

//
Page({
    data: {
        // articles
        articles: [],
        user: {},
    },
    //
    onShow() {
    	this.loadCollectArticle();
        this.loadUser();
    },
    //
    loadUser() {
        let that = this;
        User.get()
        .then(result => {
            let user = result.data;
            that.setData({
                user: user,
            });
        });
    },
    //
    loadCollectArticle() {
    	let that = this;
    	Article.getCollected()
    	.then(result => {
    		let articles = result.data;
    		that.setData({
    			articles: articles,
    		});
    	});
    },
    //
});