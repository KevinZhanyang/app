//
import { User } from '../../model/user';
import { Article } from '../../model/article';

//
Page({
    data: {
        // articles
        articles: [],
        //
        user: {},
    },
    //
    onLoad(options) {
        let userId = options.user_id;
    	this.loadArticle(userId);
        this.loadUser(userId);
    },
    //
    loadUser(userId) {
        let that = this;
        User.getByUserId(userId)
        .then(res => {
            let user = res.data;
            that.setData({
                user: user,
            });
        });
    },
    //
    loadArticle(userId) {
    	let that = this;
    	Article.getPublishedByUserId(userId)
    	.then(result => {
    		let articles = result.data;
    		that.setData({
    			articles: articles,
    		});
    	});
    },
    //
});