//
import {
  Product
} from '../../model/product';
import {
  User
} from '../../model/user';

//
Page({
  data: {
    // user
    user: {},
    // 
    products: [],
  },
  goExe(data){
    console.log(data)
    wx.navigateTo({
      url: '/pages/exchange/express?id=' + data.currentTarget.dataset.id,
    })
  },
  //
  onLoad: function() {
    this.loadUser();
    this.loadProduct();
    this.loadProduct1();
    this.loadProduct2();
    this.loadProduct3();
  },
  onShow: function() {
    this.loadUser();
  },
  gotask() {
    wx.navigateTo({
      url: '/pages/task/index',
    })
  },
  gorule() {
    wx.navigateTo({
      url: '/pages/exchange/rule',
    })
  },
  //
  loadUser() {
    User.get()
      .then(result => {
        let user = result.data;
        this.setData({
          user: user,
        });
      });
  },
  //
  loadProduct: function() {
    let that = this;
    Product.get({
      type: 1
    }).then(function(result) {
      var products = result.data;
      that.setData({
        products1: products.body.productsNewList,
      });
    });
  },
  loadProduct1: function() {
    let that = this;
    Product.get({
      type: 2
    }).then(function(result) {
      var products = result.data;
      that.setData({
        products2: products.body.productsNewList,
      });
    });
  },
  loadProduct2: function() {
    let that = this;
    Product.get({
      type: 3
    }).then(function(result) {
      var products = result.data;
      that.setData({
        products3: products.body.productsNewList,
      });
    });
  },
  loadProduct3: function() {
    let that = this;
    Product.get({
      type: 4
    }).then(function(result) {
      var products = result.data;
      that.setData({
        products4: products.body.productsNewList,
      });
    });
  },
  //
});