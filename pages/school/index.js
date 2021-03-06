//
import { School } from '../../model/school';
import { Province } from '../../model/province';

//
Page({
    data: {
      // Myschool: [{ id: 1, name: "斯坦福大学斯坦福大学" }, { id: 1, name: "斯坦福大学" }, { id: 1, name: "斯坦福大学"}],
        //
        provines:[],
        // 
        schools: [],
        //
        provinceId: 0,
        // 搜索出来的学校
        items: [],
    },
    onShow:function(){
      var mySchool = wx.getStorageSync("MySchool");
      this.setData({
        MySchool: mySchool
      })
    },
  selectTag(event){

    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })

  },
  goArticle(event){
    console.log(event);
    var mySchool = wx.getStorageSync("MySchool");
     if(!mySchool){
       mySchool = [];
     }
     var is_new = true;
     mySchool.map((item)=>{
       if (item.id == event.currentTarget.dataset.school.id){
         is_new = false;
       }
       return item;
     })
    if (is_new){
      mySchool.push(event.currentTarget.dataset.school);
    }
    wx.setStorageSync("MySchool", mySchool);
    wx.navigateTo({
      url: event.currentTarget.dataset.url,
    })

  },
  createSchool() {
    wx.navigateTo({
      url: '/pages/school/create',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
    //
    onLoad() {
        this.loadProvince();
        this.getMySchool();
       
    },
    //
    loadProvince()
    {
        //
        let that = this;
        Province.get({
            school:1,
        })
        .then(res => {
            let provinces = res.data;
            that.setData({
                provinces: provinces,
            });
            let provineId = provinces[0].id;
            that.loadSchool(provineId);
        });
    },

    getMySchool(){
      School.getMySchool()
        .then(result => {
          let schools = result.data.body;
          if (schools && schools.length>0){
            that.setData({
              Myschool: schools,
            });
          }
        });

    },
    updateSchool(event) {
        let currentTarget = event.currentTarget;
        let provinceId = currentTarget.dataset.id;
        this.setData({
            provinceId: provinceId,
        });
        this.loadSchool(provinceId);
    },
    //
    loadSchool(provinceId) {
        this.setData({
            provinceId: provinceId,
        });
        //
    	let that = this;
    	School.getByProvinceId(provinceId)
    	.then(result => {
    		let schools = result.data;
    		that.setData({
    			schools: schools,
    		});
    	});
    },
    //
    /* search start */
    search (event) {
        let that = this;
        let value = event.detail.value;
        School.search(value)
        .then(res => {
            let items = res.data;
            that.setData({
                items: items,
            });
        });
    },
    clear () {
        this.setData({
            items: [],
        });
    },
    /* search end */
    //
});