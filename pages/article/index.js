//
import { Category } from "../../model/category";
import { Article } from "../../model/article";
import { Province } from "../../model/province";
import { Keyword } from "../../model/keyword";
import { User } from "../../model/user";

//
Page({
  data: {
    // 搜索时状态分为两种，一种是搜关健字
    status: "article", // search|keywords, article|articles
    // keywords
    keywords: [],
    // options
    optionsKey: 0, // 0, 1, 2, 3

    /* 参数 */
    // 排序
    sorts: ["最新发布", "热门发布", "出售中", "购买中", "价格最高", "价格最低"],
    sortKey: 0,
    // 分类
    categories: [],
    categoryKey: 0,
    // 省
    provinces: [],
    provinceKey: 0,

    /* article */
    page: 0,
    articleLoadStatus: -1,
    articles: []
  },
  //
  onLoad: function(options) {
    // province
    let provinceId = options.province_id == undefined ? "" : options.province_id;
    this.loadProvince(provinceId);

    // category
    let categoryId = options.category_id == undefined ? "" : options.category_id;
    
    this.loadCategory(categoryId);

    // keywords
    this.loadKeywords();

    // if from search
    if (options.from != undefined) {
      this.setData({
        status: "search"
      });
      return;
    } else {
      // article
      // school
      let schoolId = options.school_id == undefined ? "" : options.school_id;

      //
      this.initArticle(provinceId, categoryId, schoolId);
    }
    //
  },
  /* OPTIONS START */
  // province
  loadProvince(provinceId) {
    //
    let that = this;
    Province.get({
      school: 1
    }).then(res => {
      let provinces = res.data;

      //
      provinces.unshift({
        id: 0,
        name: "选择地区"
      });

      //
      let provinceKey = 0;
      for (let x in provinces) {
        if (provinces[x].id == provinceId) {
          provinceKey = x;
        }
      }

      that.setData({
        provinces: provinces,
        provinceKey: provinceKey
      });
    });
  },
  // category
  loadCategory: function(categoryId) {
    let that = this;
    Category.get().then(function(result) {
      //
      let categories = result.data;

      //
      categories.unshift({
        id: 0,
        name: "选择分类"
      });

      //
      let categoryKey = 0;
      for (let x in categories) {
        if (categories[x].id == categoryId) {
          categoryKey = x;
        }
      }

      //
      that.setData({
        categories: categories,
        categoryKey: categoryKey
      });
    });
  },
  //
  changeProvince: function(event) {
    let detail = event.detail;
    let value = detail.value;
    this.setData({
      provinceValue: value
    });

    //
    this.reflesh();
  },
  tapOption(event) {
    //
    let target = event.currentTarget;
    let dataset = target.dataset;
    let key = dataset.key;

    //
    let optionsKey = this.data.optionsKey;
    if (optionsKey == key) {
      key = 0;
    }

    this.setData({
      optionsKey: key
    });

     

  },
  changeOption(event) {
    //
    let target = event.currentTarget;
    let dataset = target.dataset;
    let type = dataset.type;
    let value = dataset.value;

    //
    switch (type) {
      case "province":
        this.setData({
          provinceKey: value,
          optionsKey: 0,
          articleLoadStatus: -1,
          page: 0,
          articles: []
        });
        break;
      case "category":
        this.setData({
          categoryKey: value,
          optionsKey: 0,
          articleLoadStatus: -1,
          page: 0,
          articles: []
        });
        break;
      case "sort":

        if (value==3) {
           this.setData({
             articleType:1
           })
        }else{
          this.setData({
            articleType: 2
          })
        }
        
        this.setData({
          sortKey: value,
          optionsKey: 0,
          articleLoadStatus: -1,
          page: 0,
          articles: []
        });
        break;
    }
    
    //
    this.reflesh();
  },
  clearOption() {
    this.setData({
      optionsKey: 0
    });
  },
  /* OPTIONS END */
  /* KEYWORDS START */
  loadKeywords() {
    //
    let that = this;
    Keyword.get().then(result => {
      let keywords = result.data;
      that.setData({
        keywords: keywords
      });
    });
  },
  search(event) {
    let detail = event.detail;
    let value = detail.value;
    this.setData({
      keyword: value,
      page: 1,
      articles: [],
      articleLoadStatus: 1 // 设置状态条开始搜索
    });
    let item = {
      keyword: value,
      page: 1
    };
    this.searchArticle(item);
  },
  searchByKeyword(event) {
    let currentTarget = event.currentTarget;
    let dataset = currentTarget.dataset;
    let value = dataset.keyword;

    //
    this.setData({
      keyword: value,
      page: this.data.page+1,
      articles: []
    });
    let item = {
      keyword: value,
      page: this.data.page + 1,
    };
    this.searchArticle(item);
  },
  /* KEYWORDS END */
  /* sp */
  initArticle(provinceId, categoryId, schoolId) {
    /*
        console.log('sssssss');
        console.log(provinceId);
        console.log(categoryId);
        */

    let sortId = this.data.sortKey;
    this.loadArticle({
      sort_id: sortId,
      sortId: sortId,
      category_id: categoryId,
      categoryId: categoryId,
      province_id: provinceId,
      provinceId: provinceId,
      school_id: schoolId,
      schoolId: schoolId,
      page: this.data.page + 1,
    });
  },
  /* sp */
  /* ARTICLE START */
  reflesh() {
    let that = this;
    let sortId = this.data.sortKey;
    let categoryId = this.data.categories[this.data.categoryKey].id;
    let provinceId = this.data.provinces[this.data.provinceKey].id;

    this.loadArticle({
      sort_id: sortId,
      category_id: categoryId,
      province_id: provinceId,
      categoryId: categoryId,
      provinceId, provinceId,
      page: this.data.page + 1,
    });
  },
  onReachBottom() {
    this.reflesh();
  },
  // （学校) | 分类 | 地区 | 排序
  loadArticle: function(options) {
    //
    if (this.data.articleLoadStatus == 2) {
      console.log("========== all loaded");
      return;
    }

    //
    this.setData({
      status: "article"
    });

    let that = this;
    User.getLocation().then(res => {
      //
      options.longitude = res.longitude;
      options.latitude = res.latitude;
      that.setData({
        articleLoadStatus:0
      })
      that.getWithPage(options);
      //
      // Article.get(options).then(function(res) {
      //   //
      //   let paginate = res.data;
      //   let paginateArticles = paginate.data;
      //   let articles = that.data.articles;

      //   // 如果返回空，显示空标质
      //   if (paginateArticles.length == 0) {
      //     that.setData({
      //       empty: "找不到数据",
      //       articleLoadStatus: -1
      //     });
      //     return;
      //   }

      //   for (let x in paginateArticles) {
      //     articles.push(paginateArticles[x]);
      //   }

      //   // if current_page equal to last_page, mean need finish
      //   let articleLoadStatus =
      //     paginate.current_page == paginate.last_page ? 2 : 0;
      //   that.data.page = paginate.current_page + 1;
      //   that.setData({
      //     articles: articles,
      //     articleLoadStatus: articleLoadStatus
      //   });
      //   //
      // });
      //
    });
  },
   

  getWithPage(options){
    let that = this;
    
    options.page = options.page;
    // options.currentStartIndex = that.data.recentPage * 10;
    options.currentPageIndex = options.page;
    options.longitude = null;
    options.latitude = null;
    if (options.categoryId == 0 || options.categoryId == undefined) {
      delete options.categoryId
    }
    if (options.provinceId == 0 || options.provinceId == undefined) {
      delete options.provinceId
    }
    if (that.data.articleType==1){
         options.type=1;
    }

    Article.getWithPage(options).then(function (result) {
      var oldarticles = that.data.articles;
      let articles = result.data.body.articlesList;
      console.log(65656)
      console.log(result)
      for (let x in result.data.body.articlesList) {
        oldarticles.push(result.data.body.articlesList[x]);
      }
      // if current_page equal to last_page, mean need finish
      let articleLoadStatus = articles.length < 10 ? 2 : 1;
      that.setData({
        articles: oldarticles,
        articleLoadStatus: articleLoadStatus,
        page: options.page
      });
    })
    //
  },

  //
  searchArticle: function(options) {
  
    //
    if (this.data.articleLoadStatus == 2) {
      console.log("========== all loaded");
      return;
    }
    //
    this.setData({
      status: "article"
    });
    

    let that = this;
    User.getLocation().then(res => {
      //
      options.longitude = res.longitude;
      options.latitude = res.latitude;


      that.getWithPage(options);
      //
      // Article.search(options).then(function(res) {
      //   //
      //   let paginate = res.data;
      //   let paginateArticles = paginate.data;
      //   let articles = that.data.articles;

      //   // 如果返回空，显示空标质
      //   if (paginateArticles.length == 0) {
      //     that.setData({
      //       empty: "找不到数据",
      //       articleLoadStatus: -1
      //     });
      //     return;
      //   }

      //   for (let x in paginateArticles) {
      //     articles.push(paginateArticles[x]);
      //   }

      //   // if current_page equal to last_page, mean need finish
      //   let articleLoadStatus =
      //     paginate.current_page == paginate.last_page ? 2 : 0;
      //   that.data.page = paginate.current_page + 1;
      //   that.setData({
      //     articles: articles,
      //     articleLoadStatus: articleLoadStatus
      //   });
      //   //
      // });
      //
    });
  }
  /* ARTICLE END */
  //
});
