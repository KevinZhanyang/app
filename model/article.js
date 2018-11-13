//
import Config from '../lib/config';
import { Http } from '../lib/http';
import { Upload } from '../lib/upload';

//
export class Article
{
    //
    static refresh(id) 
    {
        //
        let url = Config.host + '/article/' + id + '/refresh';
        let options = {
            url: url,
            method:'put',
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
    }
    // 更改商品状态：上下架
    static polish(id, status) 
    {
        //
        //
        let url = Config.host + '/article/' + id + '/polish';
        let options = {
            url: url,
            method:'put',
            data: {
                status: status,
            }
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
        //
    }

    // 删除图片
    static deleteImg(id, imageId) 
    {
        //
        let url = Config.host + '/article/' + id + '/img/' + imageId;
        let options = {
            url: url,
            method:'delete',
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
    }

    // 下载商品的图片
    static loadImage(url) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            wx.downloadFile({
                url: url,
                success: function(res) {
                    /*
                    errMsg:"downloadFile:ok"
                    statusCode:200
                    tempFilePath:"http://tmp/wx31f8d157fbe5ebc8.o6zAJs62ybNtJR0qpr24DJPSg66s.Lbfd9lEaQc6c435f5c9851920093c3c137fa7c5cb938.jpeg"
                    */
                    console.log('下载图片的信息：');
                    console.log(res);
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath);
                    }
                }, 
                fail: res => {
                    console.log('下载图片失败');
                    console.log(res);
                },
                complete: res => {
                    console.log('下载图片过程完成');
                    console.log(res);
                },
            });
            //
        });
        //
    }

    /*
    static circle(id) 
    {
        //
        let url = Config.host + '/article/' + id + '/circle';
        let options = {
            url: url,
            method:'get',
        }

        //
        return new Promise(function(resolve, reject){
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
    }
    */
    
    // 上传图片
    static uploadTempImg(name, path)
    {
        // add
        let url = Config.host + '/temp_img';

        //
        let options = {
            // url String  是   开发者服务器 url
            url: url,
            // filePath    String  是   要上传文件资源的路径
            filePath: path,
            // name    String  是   文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
            name: 'img',
            // header  Object  否   HTTP 请求 Header, header 中不能设置 Referer
            formData: {
                'name': name,
            } //     Object  否   HTTP 请求中其他额外的 form data
            // success Function    否   接口调用成功的回调函数
            /*
            success: function(result) {
                resolve(result);
            },
            // fail    Function    否   接口调用失败的回调函数
            fail: function(result) {
                reject(result);
            },
            // complete    Function    否   接口调用结束的回调函数（调用成功、失败都会执行）
            complate: function (result) {
            //
            },
            */
        }; 
        //
        return new Promise(function(resolve, reject){
            //
            Upload.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
            //
        });
        //
    }

    static getImg(articleId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + articleId + '/img';
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    //
    static getPublished()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/published';
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    // 读取某人发布的所有商品
    static getPublishedByUserId(userId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/user/' + userId + '/article';
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    //
    static getCollected()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/collect';
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    //
    static getCollect (articleId) {
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/collect/' + articleId;
            let options = {
                url: url,
                method:'get',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    static collect (articleId) {
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/collect/';
            let options = {
                url: url,
                method:'post',
                data: {
                    article_id: articleId,
                }
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    static uncollect (articleId) {
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/collect/' + articleId;
            let options = {
                url: url,
                method:'delete',
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    //
    static post(items) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article';
            let options = {
                url: url,
                method:'POST',
                data: items,  
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    //
    static item(id, data = {}) {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article/' + id;
            let options = {
                url: url,
                method:'get',  
                data: data
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    //
    static get(parameters) {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/article';
            let options = {
                url: url,
                method:'get',
                /*
                data: {
                    category_id: categoryId,
                },  
                */
                data: parameters,
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    //
    static search(parameters) {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/search';
            let options = {
                url: url,
                method:'get',
                /*
                data: {
                    category_id: categoryId,
                },  
                */
                data: parameters,
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    //
    static recent(item){
        item.order = 'recent';
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/recent';
            let options = {
                url: url,
                method:'get',
                /*
                data: {
                    order: 'recent',
                    latitude: item.latitude,
                    longitude: item.longitude,
                },  
                */
                data: item,
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }

    //
    static hot(item){
        //
        item.order = 'hot';
      item.category_id = 11;
        //
        return new Promise(function(resolve, reject){
            //
          let url = Config.host + '/article';
            let options = {
                url: url,
                method:'get',
                /*
                data: {
                    order: 'hot',
                    latitude: item.latitude,
                    longitude: item.longitude,
                },  
                */
                data: item,
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
        //
    }
    // game over
}