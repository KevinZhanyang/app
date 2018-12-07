//
import { Product } from '../../model/product';
import { User } from '../../model/user';

//
Page({
    data: {
        //
        address: '',
        name: '',
        phone: '',
        // 
        product: [],
    },
    //
    onLoad: function(options){
        let productId = options.id;
        console.log(productId)
    	this.loadProduct(productId);
    },
    //
    loadProduct: function(productId){
    	let that = this;
    	Product.item(productId).then(function(result){
    		var product = result.data.body;
    		that.setData({
    			product: product,
    		});
    	});
    },
    //
    updateAddress: function(event) {
        let detail = event.detail;
        let value = detail.value;
        this.setData({
            address: value,
        });
    },
    //
    updatePhone: function(event) {
        let detail = event.detail;
        let value = detail.value;
        this.setData({
            phone: value,
        });
    },
    //
    updateName: function(event) {
        let detail = event.detail;
        let value = detail.value;
        this.setData({
            name: value,
        });
    },
    // 产品的积分 
    exchange() {
        //
        let address = this.data.address;
        let productId = this.data.product.id;
        let name = this.data.name;
        let phone = this.data.phone;

        //
        if (name.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '收件人不能为空',
            });
            return;
        }
        if (phone.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '收件人电话不能为空',
            });
            return;
        }
        if (address.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '必须填写收货地址',
            });
            return;
        }

        //
        let express = {
            name: this.data.product.name,
          content: this.data.product.name + '*' + this.data.product.getNum,
          recipient: this.data.product.name,
            phone: phone,
            address: address,
            productId: productId,
            score: this.data.product.price,
            result:'处理中'
        };
        Product.exchange(express)
        .then(res => {
            // 兑换成功,显示，用户点确认后，返回列表页
            wx.showModal({
                title: '兑换成功',
                content: '兑换成功，查看列表',
                showCancel: false,
                success: res => {
                    //
                    wx.redirectTo({
                        url: '/pages/home/exchange',
                    });
                },
            });
            //
        });

    },
    //
});