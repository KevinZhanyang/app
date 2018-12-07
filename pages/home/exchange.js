//
import { Product } from '../../model/product';
import { User } from '../../model/user';

//
Page({
    data: {
        // tenant 
        exchanges: [],
        user: {},
    },
    //
    onLoad() {
        this.loadUser();
    	this.loadExchange();
    },
    // 
    loadUser() {
        let that = this;
        User.get()
        .then(res => {
            let user = res.data;
            that.setData({
                user: user,
            });
        });
    },
    //
    loadExchange() {
    	let that = this;
    	Product.getExchanges()
    	.then(res => {
        let exchanges = res.data.body.exchangesList;
    		that.setData({
    			exchanges: exchanges,
    		});
    	});
    }
    //
});