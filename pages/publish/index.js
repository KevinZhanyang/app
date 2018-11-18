//
import {
  Category
} from '../../model/category';
import {
  School
} from '../../model/school';
import {
  User
} from '../../model/user';
import {
  Article
} from '../../model/article';
import {
  Province
} from '../../model/province';
import Config from '../../lib/config';
import {
  Http
} from '../../lib/http';
import {
  Upload
} from '../../lib/upload';
var QQMapWX = require('../../lib/map/qqmap-wx-jssdk.min.js');
var qqmapsdk;
//
const appInstance = getApp();

//
Page({
  data: {
    selectSchoolaActive: false,
    checked: false,
    // 分类的内容
    categories: [],
    categoryKey: 0,
    selectTag: 3,
    // 学校
    multiArray: [], // 省列表
    schools: [], // 学校列表
    multiIndex: [0, 0], // provinceKey schoolKey
    tradeWay: [{
      id: 1,
      name: "自取"
    }, {
      id: 2,
      name: "送货上门"
    }, {
      id: 3,
      name: "邮寄",
      state: 1
    }],
    tempMultiIndex: [0, 0],
    // 新闻内容
    article: {
      price: '',
      content: '',
      phone: '',
      wechat: '',
    },
    // 新闻的图片列表
    images: [],
    // 发布的按钮禁用状态: true 铵钮棼用，不可以发布，false, 铵钮可以，可以发布
    publishButtonDisabled: false,
    // 
    showShadow: true,
    publishedShow: true,
  },
  selectTag(event) {

    console.log(event)
    let id = event.currentTarget.dataset["id"];
    let name = event.currentTarget.dataset["name"];
    let selectTag = this.data.selectTag;
    let tradeWay = this.data.tradeWay;
    for (let item of tradeWay) {
      if (id == item.id) {
        item.state = 1;
      } else {
        item.state = 0;
      }
    }
    this.setData({
      tradeWay: tradeWay,
      selectTag: id,
    });
  },
  selectSchool(event) {

    console.log(event)
    let id = event.currentTarget.dataset["id"];
    // let  = this.data.selectSchool;
    let MySchool = this.data.MySchool;
    if (!MySchool) {
      MySchool = [];
    }
    for (let item of MySchool) {
      if (item) {
        if (id == item.id) {
          item.state = 1;
        } else {
          item.state = 0;
        }
      }
    }
    this.setData({
      MySchool: MySchool,
      selectSchool: id,
      selectSchoolaActive: false
    });
  },
  clickCurrentSchool(event) {
    console.log(event);
    let that = this;
    if (!this.data.selectSchoolaActive) {
      let MySchool = this.data.MySchool;
      if (!MySchool) {
        MySchool = [];
      }
      for (let item of MySchool) {
        if (item) {
        item.state = 0;
        }
      }
      that.setData({
        MySchool: MySchool,
        selectSchool: event.currentTarget.dataset.id
      });
      
    }else{
      that.setData({
       
        selectSchool: undefined
      });
    }
    that.setData({
      selectSchoolaActive: !that.data.selectSchoolaActive,
    
    })
  },
  publishShow() {

    let url = Config.apiRoot + '/v1/location';
    let options = {
      url: url,
      method: 'get',
    }
    //
    return new Promise(function(resolve, reject) {
      //
      Http.executeWithLogin(options).then(function(result) {
        resolve(result);
      }, function(error) {
        reject(error);
      });
      //
    });
    //
  },
  //移动选点
  moveToLocation: function () {

    var that = this;
    wx.chooseLocation({
      success: function (res) {
        let mobileLocation = {
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address,
        };
        that.setData({
          address: res.address
        });

      },
      fail: function (err) {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation'])
              that.openConfirm()
          }
        })
      }
    });
  },
  onShow: function() {
    if (wx.getStorageSync("imagesTmp")) {
      this.setData({
        images: wx.getStorageSync("imagesTmp")
      })
    }
   
  },
  //
  onLoad: function(options) {

    qqmapsdk = new QQMapWX({
      key: 'HG5BZ-TRHW3-5R737-33FXO-KNHNE-ESB5F'
    });
    // //控制国内用户不能上传
    let that = this;
    // this.publishShow().then(function (result) {
    //   var locationData = result.data;
    //   if (locationData.code == 200 && locationData.body && locationData.body.data.country_id == 'CN' && locationData.body.data.country =="中国") {
    //     that.setData({
    //       publishedShow: false,
    //     });
    //     wx.showModal({
    //       title: '发布提示',
    //       content: '暂不支持国内用户上传！',
    //       showCancel: false,
    //       success:function(){
    //         wx.navigateBack({

    //         })
    //       }
    //     })
    //   }
    // });

    // 如果没有授权地理位置，转到授权
    User.testAuthorizeUserLocation()
      .then(res => {
        //
        User.testAuthorizeUserInfo()
          .then(res => {
            //
            that.setData({
              showShadow: false,
            });

            // 
            that.loadLocalArticle();
            //
            that.loadCategory();
            that.loadProvince();


            User.getLocation()
              .then(res => {
                qqmapsdk.reverseGeocoder({
                  location: {

                    latitude: res.latitude,
                    longitude: res.longitude
                  },
                  success: function(addressRes) {
                    var address = addressRes.result.formatted_addresses.recommend;
                    // console.log("hh");
                    // console.log(address);
                    that.setData({
                      address: address
                    })
                  },
                  fail: function(res) {
                    // console.log("pp");
                    // console.log(res);
                  },
                  complete: function(res) {
                    // console.log("op");
                    // console.log(res);
                  }
                });


              })


            //
            that.Sycn();
          })
          .catch(res => {
            console.log(res);
            console.log('========== 进入个人中心页面，用户信息末授权，转向/pages/authorization/info');
            wx.redirectTo({
              url: '/pages/authorization/info?from=/pages/publish/index',
            });
          });
        //
      })
      .catch(res => {
        console.log('========== 进入地址授权页，转向/pages/authorization/location');
        wx.redirectTo({
          url: '/pages/authorization/location?from=/pages/publish/index',
        });
        return;
      });
  },
  Sycn() {
    //
    User.get()
      .then(res => {
        let user = res.data;

        //
        if (user.nickname.length < 2 || user.avatar.length == 0) {
          User.syncUserInfo();
        }
      });
    //
  },
  /* init start */
  loadLocalArticle() {
    // 
    let that = this;
    wx.getStorage({
      key: 'publish',
      success: function(res) {
        // 成功取得变量，变量可能为空
        let publish = res.data;
        //
        let article = that.data.article;
        //
        if (publish.content != undefined) {
          article.content = publish.content;
        }
        //
        if (publish.price != undefined) {
          article.price = publish.price;
        }
        //
        if (publish.phone != undefined) {
          article.phone = publish.phone;
        }
        //
        if (publish.wechat != undefined) {
          article.wechat = publish.wechat;
        }
        // 读取新闻
        that.setData({
          article: article,
        });
        // 
        if (publish.multiIndex != undefined) {
          that.setData({
            multiIndex: publish.multiIndex,
          });
          that.data.tempMultiIndex = publish.multiIndex;
        }
        // 读取学校
        if (publish.categoryKey != undefined) {
          that.setData({
            categoryKey: publish.categoryKey,
          });
        }
        /*
        // 读取图片
        if (publish.images != undefined) {
            that.setData({
                images: publish.images,
            });
        }
        */
        //
      },
      fail() {
        //
      },
    });
  },
  //
  loadCategory: function() {
    let that = this;
    Category.get().then(function(result) {
      var categories = result.data;
      categories.unshift({
        id: 0,
        name: '点击选择',
      });
      that.setData({
        categories: categories,
      });
    });
  },
  //
  loadProvince() {
    let that = this;
    Province.get({
        school: 1,
      })
      .then(res => {
        //
        let multiArray = [];

        // provinces
        let provinces = res.data; // 数组可能为空
        multiArray.push(provinces);
        that.setData({
          multiArray: multiArray,
        });

        

        //
        that.loadSchool();
      });
  },
  //
  loadSchool: function() {
    let that = this;
    School.get().then(function(result) {
      //
      let schools = result.data;
      that.data.schools = schools;
   
      that.generatePickSchools();
      //
    });
  },
  generatePickSchools() {
    console.log('>>>>>>>>>>>>>>>>>>>>> generatePickSchools');
    //
    let that = this;
    // 获取学校列表
    let multiArray = this.data.multiArray;
    // provinceKey
    let provinceKey = this.data.multiIndex[0];
    let provinceId = this.data.multiArray[0][provinceKey].id;

    //
    let schools = this.data.schools;
    let currentSchools = [];
    for (let x in schools) {
      if (schools[x].province_id == provinceId) {
        currentSchools.push(schools[x]);
      }
    }
    multiArray[1] = currentSchools;
    that.setData({
      multiArray: multiArray,
    });

    var MySchool = wx.getStorageSync("MySchool");
    console.log(this.data.multiIndex);
    console.log(this.data.multiArray);
    var id = this.data.multiArray[1][this.data.multiIndex[1]].id;
    var newMySchool = [];
    if(!MySchool){
         MySchool=[];
    }
    MySchool.map((item) => {
      if (item) {
        if (item.id == id) {
        } else {
          newMySchool.push(item)
        }
      }

      return item;
    })

    for (let item of MySchool) {
      if (item) {
        item.state = 0;
      }
    }
    this.setData({
      MySchool: newMySchool,
      selectSchool: id,
      selectSchoolaActive: true
    });







  },
  /* init end */
  /* update start */
  bindcolumnchange(event) {
    //
    let that = this;
    let detail = event.detail;
    let column = detail.column;
    let value = detail.value;
    //
    switch (column) {
      // 修改了省份,更新学校
      case 0:
        console.log('>>>>>>>>>>>>>>>>>>>>> bindcolumnchange 0');
        console.log(event);
        let multiIndex = this.data.multiIndex;
        multiIndex[0] = value;
        multiIndex[1] = 0;
        this.setData({
          multiIndex: multiIndex,
        });
        that.generatePickSchools();
        break;
      case 1:
        console.log('>>>>>>>>>>>>>>>>>>>>> bindcolumnchange 1');
        console.log(event);
        break;
    }
    //
  },
  bindSchoolChange(event) {
    console.log('>>>>>>>>>>>>>>>>>>>>> bindSchoolChange');
    console.log(event);
    let detail = event.detail;
    let value = detail.value; // value 是一个数组
    let tempMultiIndex = [
      value[0],
      value[1],
    ];
    //
    this.setData({
      multiIndex: value,
      tempMultiIndex: tempMultiIndex,
    });

    console.log(event)
    let multiIndex = value;
    let id = this.data.multiArray[1][multiIndex[1]].id;
    // let  = this.data.selectSchool;
    let MySchool = wx.getStorageSync("MySchool");

    if (!MySchool) {
      MySchool = [];
    }
    var is_new = true;
    MySchool.map((item) => {
      if (item) {
        if (item.id == id) {
          is_new = false;
        }
      }
      
      return item;
    })
    if (is_new) {
      MySchool.push(this.data.multiArray[1][multiIndex[1]]);
    }
    wx.setStorageSync("MySchool", MySchool);
    var newMySchool=[];
    
      MySchool.map((item) => {
        if (item){
          if (item.id == id) {

          } else {
            newMySchool.push(item)
          }
        }
        
        return item;
      })
    for (let item of MySchool) {
      if (item) {
        item.state = 0;
      }
    }
    this.setData({
      MySchool: newMySchool,
      // newMySchool: newMySchool,
      selectSchool: id,
      selectSchoolaActive:true
    });
  },
  // picker cancel
  bindCancel(event) {
    let tempMultiIndex = this.data.tempMultiIndex;
    let multiIndex = [
      tempMultiIndex[0],
      tempMultiIndex[1],
    ];
    this.setData({
      multiIndex: multiIndex,
    });
    this.generatePickSchools();
  },
  updateContent: function(event) {
    let value = event.detail.value;
    let article = this.data.article;
    article.content = value;
    if (value.length > 100) {
      wx.showLoading({
        title: '文字太多啦',
        duration: 1500
      })
      return false;

    }
    this.setData({
      article: article,
    });
  },
  //
  updatePrice: function(event) {
    let value = event.detail.value;
    // value = parseInt(value);
    let article = this.data.article;
    article.price = value;
    this.setData({
      article: article,
    });
  },
  updatePhone(event) {
    let value = event.detail.value;
    let article = this.data.article;
    article.phone = value;
    this.setData({
      article: article,
    });
  },
  //
  updateWechat(event) {
    let value = event.detail.value;
    let article = this.data.article;
    article.wechat = value;
    this.setData({
      article: article,
    });
  },
  //
  bindCategoryChange(event) {
    let key = event.detail.value; // schools 数组的KEY
    let category = this.data.categories[key];
    let categoryId = category['id'];
    this.data.categoryId = categoryId;
    this.setData({
      categoryKey: key,
    });
  },
  //
  chooseImage(event) {
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: [
        'original',
        'compressed',
      ],
      sourceType: [
        'album',
        'camera',
      ],
      success: function(res) {
        // 现有图片
        let images = that.data.images;
        let coverStatus = 1;
        for (let x in images) {
          if (images[x].isCover == 1) {
            coverStatus = 0;
            break;
          }
        }
        // 添加的图片
        let tempFilePaths = res.tempFilePaths;
        // 处理添加的图片，

        for (let x in tempFilePaths) {
          //
          let path = tempFilePaths[x];
          let isCover = coverStatus;
          //
          coverStatus = 0;
          let position = path.lastIndexOf('/') + 1;
          let name = path.substr(position);

          //
          images.push({
            path: path,
            isCover: isCover,
            server: 0,
            name: name,
          });
        }
        //
        that.setData({
          images: images,
        });



        // 上传到服务器
        for (let x in images) {
          let image = images[x];
          if (image.server == 0) {
            let name = image.name;
            let path = image.path;
            Article.uploadTempImg(name, path)
              .then(function(result) {
                //
                images[x].server = 1;
                that.setData({
                  images: images,
                });
                wx.setStorageSync("imagesTmp", images);
              })
              .catch(function(result) {
                //
                images[x].server = -1;
                that.setData({
                  images: images,
                });
                wx.setStorageSync("imagesTmp", images);
              });
          }
        }
      },
      fail: function(red) {
        //
      },
      complete: function() {
        //
      }
    });
  },
  // 如果只有一张图就算了。如果还有在工作中的图，把帽子给他们
  delImage(event) {
    //
    let key = event.currentTarget.dataset.key;
    let images = this.data.images;

    // 如果已经上传到服务器的图片
    if (images[key].server == 1) {
      images[key].server = 2;
    } else {
      images[key].server = -1;
    }

    //
    if (images[key].isCover == 1) {
      images[key].isCover = 0;
      //
      for (let x in images) {
        if (images[x].server == 1) {
          images[x].isCover = 1;
          break;
        }
      }
    }
    //
    this.setData({
      images: images,
    });
    wx.setStorageSync("imagesTmp", images);
  },
  // preview image
  previewImage(event) {
    //
    let imageUrl = event.currentTarget.dataset.src;

    let imageUrls = [];
    imageUrls.push(imageUrl)
    //
    wx.previewImage({
      current: imageUrl, // 当前显示图片的http链接
      urls: imageUrls // 需要预览的图片http链接列表
    });
  },
  //
  setCover(event) {
    this.previewImage(event);
    //
    let key = event.currentTarget.dataset.key;
    let images = this.data.images;
    //
    for (let x in images) {
      let isCover = (x == key ? 1 : 0);
      images[x].isCover = isCover;
    }
    //
    this.setData({
      images: images,
    });
    wx.setStorageSync("imagesTmp", images);
  },
  /* update end */
  //
  /* publish start */
  showError(str) {
    //
    wx.showToast({
      title: str,
      icon: 'none',
      duration: 2000
    });
    return;
  },
  publish(event) {

    //
    let formId = event.detail.formId;

    let imageLength = 0; // 服务器上已存在的图片数量
    let onProgress = 0;
    let images = this.data.images;
    for (let x in images) {
      if (images[x].server == 1) {
        imageLength++;
      } else if (images[x].server == 0) {
        onProgress++
      }
    }

    if (onProgress > 0) {
      this.showError('还有照片上传中');
      return;
    }
    if (imageLength <= 0) {
      this.showError('必须发布照片');
      return;
    }

    if (this.data.article.price <= 0) {
      this.showError('必须填写价格');
      return;
    }


    if (this.data.article.content.length == 0) {
      this.showError('内容不能为空');
      return;
    }

    // if (this.data.article.phone.length == 0 && this.data.article.wechat.length == 0) {
    //   this.showError('联系方式不能为空');
    //   return;
    // }

    // test
    if (this.data.categoryKey == 0) {
      this.showError('必须选择分类');
      return;
    }

    //
    wx.showLoading({
      title: '发布中',
    });
    this.setData({
      publishButtonDisabled: true,
    });

    // 
    let that = this;
    User.getLocation()
      .then(res => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        // 如果经度或纬度没有授权提示
        if (latitude == 0 || longitude == 0) {
          wx.redirectTo({
            url: '/pages/authorization/location?from=/pages/publish/index',
          });
          return;
        }
        //
        let multiIndex = that.data.multiIndex;

        let categoryId = that.data.categories[that.data.categoryKey].id;
        let schoolId = that.data.selectSchool ? that.data.selectSchool : this.data.multiArray[1][multiIndex[1]].id;
        let images = this.data.images;
        let article = this.data.article;
        //
        let item = {
          category_id: categoryId,
          school_id: schoolId,
          price: article.price,
          content: article.content,
          phone: article.phone,
          wechat: article.wechat,
          latitude: latitude,
          longitude: longitude,
          // 
          form_id: formId,
          images: images,
        };
        //
        Article.post(item)
          .then(result => {
            let article = result.data;
            let articleId = article.id;
            wx.removeStorageSync("images");

            var updateData = {
              tardeWay: that.data.selectTag,
              isNew: that.data.checked ? 1 : 0,
              type: 0,
              id: articleId
            }
            console.log(articleId)
            Article.update(updateData).then(res => {

            })
            that.skip(articleId);

          });
        //
      });
    //
  },
  // 
  skip(articleId) {
    wx.removeStorage({
      key: 'publish',
      success: function(res) {
        console.log('========= remove storage success');
        //
        //
      },
      fail: function(res) {
        console.log('========= remove storage fail');
      },
      complete: function(res) {
        let url = '/pages/publish/share?id=' + articleId;
        wx.hideLoading();
        wx.redirectTo({
          url: url,
        });
      }
    });
    //
  },
  /* publish end */
  /* close start */
  /*
  关闭页面 如果发布成功
          // content: '',
          phone: '',
          wechat: '',
          multiIndex,
          categoryKey
          没有发布
          content: '',
          phone: '',
          wechat: '',
          multiIndex,
          categoryKey
  */
  onUnload() {
    // 没有发布
    if (this.data.publishButtonDisabled == false) {
      let article = this.data.article;
      let item = {
        price: article.price,
        content: article.content,
        phone: article.phone,
        wechat: article.wechat,
        //
        categoryKey: this.data.categoryKey,
        // images: this.data.images,
        multiIndex: this.data.multiIndex,
      };
      wx.setStorage({
        key: 'publish',
        data: item,
      });
      // 发布成功
    } else {
      //
      let article = this.data.article;
      let item = {
        // price: article.price,
        // content: article.content,
        phone: article.phone,
        wechat: article.wechat,
        //
        categoryKey: this.data.categoryKey,
        // images: this.data.images,
        multiIndex: this.data.multiIndex,
      };
      wx.setStorage({
        key: 'publish',
        data: item,
      });
      //
    }
  },
  radioChange(event) {
    console.log("3333333333333")
    console.log(event);
    this.setData({
      checked: !this.data.checked
    })
  }
  /* close end */
  //
});