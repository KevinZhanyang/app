//
import { Product } from '../../model/product';
import { User } from '../../model/user';

//
Page({
    data: {
        // user
        user: {},
        // 
        products: [],
    },
    //
    onLoad: function(){
        this.loadUser();
    	this.loadProduct();
    },
    onShow: function(){
        this.loadUser();
    },
    //
    loadUser(){
        User.get()
        .then(result => {
            let user = result.data;
            this.setData({
                user: user,
            });
        });
    },
    //
    loadProduct: function(){
    	let that = this;
    	Product.get().then(function(result){
    		var products = result.data;
    		that.setData({
    			products: products,
    		});
    	});
    },
    //
});