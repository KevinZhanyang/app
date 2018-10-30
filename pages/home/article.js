//
import { Category } from '../../model/category';
import { School } from '../../model/school';
import { User } from '../../model/user';
import { Article } from '../../model/article';
import { Province } from '../../model/province';
import { Published } from '../../model/published';

//
const appInstance = getApp();

//
Page({
    data: {
        // categories
        categories: [],
        categoryKey: 0,
        //
        multiArray: [], // provines
        multiIndex: [0, 0], // provinceKey schoolKey
        tempMultiIndex: [0, 0],
        schools:[],
        // 新闻内容
        article: {
            id: 0,
            price: '',
            content: '',
            phone: '',
            wechat: '',
        },
        // article_images
        /*
        id  :   263
        // article_id  :   191
        img :   https://download.beimei2.com/article/26/tmp_f2a564eb9801de987269cbb8977b8d73.jpg?x-oss-process=style/small_thumbnail
        // is_cover    :   1
        // created_at  :   2018-10-10 06:18:58
        // updated_at  :   2018-10-10 06:18:58
        name    :   article/26/tmp_f2a564eb9801de987269cbb8977b8d73.jpg
        path    :   http://tmp/wx31f8d157fbe5ebc8.o6zAJs62ybNtJR0qpr24DJPSg66s.mqfAEHfTkzTW31a784877d663e48d792e65bb93d34aa.jpeg
        // status  :   0
        isCover :   1
        originCover :   1
        server  :   -1
        covered :   0
        */
        images:[],
        // 发布的按钮禁用状态
        publishButtonDisabled: false,

    },
    //
    onLoad: function(options){
        let articleId = options.id;
        this.loadArticle(articleId);
    },
    /* close start */
    /* init start */
    loadArticle (articleId) {
        //
        let that = this;
        Published.item(articleId)
        .then(res => {
            //
            let article = res.data;

            // 保存新闻
            that.setData({
                article: article,
            });

            // 保存新闻下的图片
            let remoteImages = article.images;
            let images = that.data.images;
            //
            for (let x in remoteImages) {
                // 下载图片
                let url = remoteImages[x].img;
                Article.loadImage(url)
                .then(res => {
                    let image = remoteImages[x];
                    image.path = res;
                    image.status = 0;
                    image.isCover = image.is_cover;
                    image.originCover = image.is_cover;
                    image.server = -1; //  -1 0 1 2
                    image.covered = 0;
                    images.push(image);
                    //
                    that.setData({
                        images: images,
                    });
                });
            }

            // 学校与省
            /*
            let schoolId = article.school_id;
            let provinceId = article.province_id;
            let categoryId = article.category_id;
            */

            //
            this.loadCategory();
            this.loadProvince();
        });
    },
    //
    loadCategory: function(){
        console.log('>>>>>>>>>>>>>>> loadCategory');
    	let that = this;
    	Category.get().then(function(result) {
    		var categories = result.data;
            let categoryId = that.data.article.category_id;
            //
            /*
            categories.unshift({
                id: 0, 
                name: '选择分类',
            });
            */

            // 添存分类
            for (let x in categories) {
                if (categories[x].id == categoryId) {
                    that.setData({
                        categoryKey: x,
                    });
                    break;
                }
            }

            //
    		that.setData({
                categories: categories,
            });
    	});
    },
    //
    loadProvince() {
        console.log('>>>>>>>>>>>>>>> loadProvince');
        let that = this;
        Province.get({
            school: 1,
        })
        .then(res => {
            // prepare provinces
            let multiArray = []; // 有可能省为空
            let provinces = res.data;
            multiArray.push(provinces);

            // prepare provinceKey
            let provinceKey = 0;
            let provinceId = that.data.article.province_id;
            for (let x in provinces) {
                if (provinces[x].id == provinceId) {
                    provinceKey = x;
                    break;
                }
            }
            // 
            let multiIndex = this.data.multiIndex;
            multiIndex[0] = provinceKey;
            let tempMultiIndex = this.data.tempMultiIndex;
            tempMultiIndex[0] = provinceKey;

            // save provinces,provinceKey
            that.setData({
                //
                multiArray: multiArray,
                //
                multiIndex: multiIndex,
                tempMultiIndex: tempMultiIndex,
            });

            // load school
            that.loadSchool();
        });
    },
    loadSchool: function(){
        console.log('>>>>>>>>>>>>>>> loadSchool');
        let that = this;
        School.get().then(function(result) {
            let schools = result.data;
            that.data.schools = schools; // 有时学校可能为空
            // init pick of school
            that.initPickSchools();
        });
    },
    initPickSchools() {
        console.log('>>>>>>>>>>>>>>> initPickSchools');
        let that = this;
        let multiArray = this.data.multiArray;
        let schoolId = this.data.article.school_id;

        // 
        let multiIndex = this.data.multiIndex; // provinceKey schoolKey
        let provinceKey = this.data.multiIndex[0]; // provinceKey
        let provinceId = this.data.multiArray[0][provinceKey].id;

        //
        let schools = this.data.schools;
        let currentSchools = [];
        for (let x in schools) {
            if (schools[x].province_id == provinceId) {
                currentSchools.push(schools[x]);
            }
        }

        //
        let tempMultiIndex = this.data.tempMultiIndex;
        for (let x in currentSchools) {
            if (currentSchools[x].id == schoolId) {
                multiIndex[1] = x;
                tempMultiIndex[1] = x;
                break;
            }
        }

        //
        multiArray[1] = currentSchools;
        that.setData({
            multiArray: multiArray,
            multiIndex: multiIndex,
            tempMultiIndex: tempMultiIndex,
        });
        //
    },
    //
    generatePickSchools() {
        console.log('>>>>>>>>>>>>>>> generatePickSchools');
        let that = this;
        let multiArray = this.data.multiArray;

        // province.id
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
        //
        multiArray[1] = currentSchools;
        that.setData({
            multiArray: multiArray,
        });
        //
    },
    /* init end */
    /* update start */
    // 
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
    },
    // picker cancel
    bindCancel(event) {
        console.log('>>>>>>>>>>>>>>>>>>>>> bindCancel');
        console.log(event);
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
            success: function(res){
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
                // 处理添加的图片
                for(let x in tempFilePaths) { 
                    let path = tempFilePaths[x];
                    //
                    let isCover = coverStatus;
                    coverStatus = 0;
                    /*
                    image = {
                        path : 'path',
                        isCover: 1
                        server: 0, // 0用户端|1用户端服务端|2服务端
                    }
                    */
                    let position = path.lastIndexOf('/') + 1;
                    let name = path.substr(position);
                    images.push({
                        path: path,
                        isCover: isCover,
                        server: 0,
                        name: name,
                        originCover: isCover,
                        coverd: 1,
                    });
                    //
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
                        .then(function(result){
                            //
                            images[x].server = 1;
                            that.setData({
                                images: images,
                            });
                        });
                    }
                }
                // 上传服务器结束
            },
            fail: function(red){
                //
            }, 
            complete: function(){
                //
            }
        });
    },
    //
    delImage(event) {
        console.log('>>>>>>>>>>>>>>>>>> delImage');
        let key = event.currentTarget.dataset.key;
        console.log(key);
        let images = this.data.images;
        // 如果是原来服务端有的图片，
        if (images[key].server == -1) {
            images[key].server = -2;
        // 如果是上传的临时文件
        } else if (images[key].server == 1) {
            images[key].server = 2;
        }

        // 如果删除的这张是封面，把封面换给-1或1
        if (images[key].isCover == 1) {
            images[key].isCover = 0;
            // 给正常显示的图片设为封面
            for (let x in images) {
                if (images[x].server == -1 || images[x].server == 1) {
                    images[x].isCover = 1;
                    break;
                }
            }
        }

        this.setData({
            images: images,
        });
    },
    //
    setCover(event) {
        //
        let key = event.currentTarget.dataset.key;
        let images = this.data.images;
        //
        for(let x in images) {
            let isCover = (x == key ? 1 : 0);
            if (isCover != images[x].originCover) {
                images[x].covered = 1;
            } else {
                images[x].covered = 0;
            }
            images[x].isCover = isCover;
        }
        //
        this.setData({
            images: images,
        });
    },
    /* update end */
    /* publish start */
    publish(event) {
        // test
        if (this.data.article.categoryId == 0) {
            this.showError('必须选择分类');
            return;
        }
        if (this.data.article.schoolId == 0) {
            this.showError('必须选择学校');
            return;
        }
        if (this.data.article.content.length == 0) {
            this.showError('内容不能为空');
            return;
        }
        if (this.data.article.phone.length == 0 && this.data.article.wechat.length == 0) {
            this.showError('联系方式不能为空');
            return;
        }

        //
        let imageLength = 0;
        let images = this.data.images;
        for(let x in images) {
            if (images[x].server == -1 || images[x].server == 1) {
                imageLength++;
            }
        }
        //
        if (imageLength == 0) {
            this.showError('必须发布照片');
            return;
        } 

        //
        wx.showLoading({
            title: '发布中',
        });
        this.setData({
            publishButtonDisabled: true,
        });

        let that = this;
        // 新闻id 
        let articleId = this.data.article.id;

        // 生成patch参数
        // 分类id
        let categoryId = this.data.categories[that.data.categoryKey].id; 
        // 学校id
        let multiIndex = this.data.multiIndex;
        let schoolId = this.data.multiArray[1][multiIndex[1]].id;
        //
        let price = this.data.article.price;
        let content = this.data.article.content;
        let phone = this.data.article.phone;
        let wechat = this.data.article.wechat;
        // let images = this.data.images; // 上面已经生成
        // item 
        let item = {
            category_id: categoryId,
            school_id: schoolId,
            price: price,
            content: content,
            phone: phone,
            wechat: wechat,
            images: images,
        };
        // put
        Published.post(articleId, item)
        .then(result => {
            let article = result.data;
            let articleId = article.id;
            that.skip(articleId);
        });
    },
    showError(str) {
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        });
        return;
    },
    skip(articleId) {
        wx.hideLoading();
        // redirect
        let url = '/pages/publish/share?id=' + articleId;
        wx.redirectTo({
            url: url,
        });
    },
    /* publish end */
    //
});