// pages/school/create.js
import {
  Category
} from '../../model/category';
import {
  User
} from '../../model/user';
import {
  Province
} from '../../model/province';
import { School } from '../../model/school';
import Config from '../../lib/config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: [],
    provinceKey: 0,

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.loadProvince();

  },
  //
  loadCategory: function () {
    let that = this;
    Category.get().then(function (result) {
      var categories = result.data;
      categories.unshift({
        id: 0,
        name: '选择分类',
      });
      that.setData({
        categories: categories,
      });
    });
  },

  loadProvince() {
    let that = this;
    Province.get({
      school: 1,
    })
      .then(res => {
        //

        // provinces
        var provinces = res.data; // 数组可能为空
        provinces.unshift({
          id: 0,
          name: '选择学校所在的州',
          sort:0
        });
        that.setData({
          provinces: provinces,
        });
      });
  },
  bindCategoryChange(event) {
    let key = event.detail.value; // schools 数组的KEY
    let province = this.data.provinces[key];
    let provinceId = province['id'];
    this.data.provinceId = provinceId;
    this.setData({
      provinceKey: key,
    });
  },
  //
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  createSchoole(){


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  updateContent(event){
    console.log(event);
    this.setData({
      name: event.detail.value
    })

  },
  createSchool(){
    if(!this.data.name){
    wx.showLoading({
      title: '请输入学校名称',
      duration:1500
    })
    return false;
    }
    var data ={
       name:this.data.name,
      provinceId: this.data.provinceId,
      status:1
    }
    School.create(data)
      .then(res => {
        wx.showLoading({
          title: '已提交',
          duration: 1500
        })
        wx.navigateBack({
        })
      });
  }
})