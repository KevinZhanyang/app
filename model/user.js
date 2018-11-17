//
import Config from '../lib/config';
import { Http } from '../lib/http';

//
export class User
{
    // 
    static getUserInfo()
    {
        //
        return new Promise(function(resolve, reject){
            //
            wx.getSetting({
                success(res) {
                    // 已授权
                    if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] == true) {
                        //
                        wx.getUserInfo({
                            success: function (res) {
                                /*
                                avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIEe5ZSxElHMHLH7yYtKRjicsfNABQBcsB9LFwXsAmCT88zibicka5wr1rxlJm0at7yjVZZZ1UDfkJbA/132"
                                city:"Zhabei"
                                country:"China"
                                gender:1
                                language:"zh_CN"
                                nickName:"高飞"
                                province:"Shanghai"
                                */
                                let userInfo = res.userInfo;
                                resolve(userInfo);
                                //
                            },
                            fail: function(res) {
                                //
                                reject();
                            },
                            complete: function(res) {
                                //
                            }
                        });
                        // 没有授权马上请求授权
                    } else {
                        //
                        reject();
                        //
                    }
                }
            });
            //
        });
        //
    }

    // 同步用户昵称
    static syncUserInfo()
    {
        //
        wx.getSetting({
            success(res) {
                // 已授权
                if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] == true) {
                    //
                    wx.getUserInfo({
                        success: function (res) {
                            /*
                            avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIEe5ZSxElHMHLH7yYtKRjicsfNABQBcsB9LFwXsAmCT88zibicka5wr1rxlJm0at7yjVZZZ1UDfkJbA/132"
                            city:"Zhabei"
                            country:"China"
                            gender:1
                            language:"zh_CN"
                            nickName:"高飞"
                            province:"Shanghai"
                            */
                            let userInfo = res.userInfo;
                            //
                            let url = Config.host + '/user_info';
                            let options = {
                                url: url,
                                method:'PUT',
                                data: userInfo,
                            }
                
                            //
                            Http.executeWithLogin(options).then(function(result){
                                console.log('sycn userinfo success');
                            }, function(error) {
                                console.log('sync userinfo fail');
                            });
                        },
                        fail: function(res) {
                            //
                        },
                        complete: function(res) {
                            //
                        }
                    });
                    // 没有授权马上请求授权
                }
            }
        });
        //
    }

    // 如果用户没有授权地址位置，让用户授权
    static getLocation()
    {
        //
        return new Promise(function(resolve, reject){
            wx.getSetting({
                success: (res) => {
                    let authSetting = res.authSetting;
                    if (authSetting != undefined && authSetting['scope.userLocation'] != undefined && authSetting['scope.userLocation'] == true) {
                        // start
                        wx.getLocation({
                            type:'wgs84',
                            altitude: false,
                            success: function(res){
                                console.log('>>>>>>>>>>>>>>>>>>> get location success');
                                console.log(res);
                                let location = {
                                    longitude: res.longitude,
                                    latitude: res.latitude,
                                };
                                // console.log(location);
                                resolve(location);
                            }, 
                            fail: (res) => {
                                console.log('>>>>>>>>>>>>>>>>>>> get location fail');
                                console.log(res);
                                let location = {
                                    longitude: 0,
                                    latitude: 0,
                                };
                                resolve(location);
                            },
                        });
                        // end 
                    } else {
                        //
                        console.log('>>>>>>>>>>>>>>>>>>> get location fail');
                        console.log(res);
                        let location = {
                            longitude: 0,
                            latitude: 0,
                        };
                        resolve(location);
                        //
                    }
                }   
            });
        });
    }
    /*
    {
        encryptedData: ,
        iv: ,
        code:, 
    } 
    */
    static getPhone(data)
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/user/phone';
            let options = {
                url: url,
                method:'post',
                data: data,
            }
            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

    // scope.userLocation
    /*
    static mustAuthorizeUserInfo()
    {
        return new Promise(function(resolve, reject){
            // get setting start 
            wx.getSetting({
                success(res) {
                    // if no location authorize, then request, if faill open settiong
                    if (!res.authSetting['scope.userInfo']) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success() {
                                resolve();
                            },
                            fail() {
                                // dialog
                                wx.showModal({
                                    title: '提示',
                                    content: '必须授权才能使用全部功能',
                                    success: function(res) {
                                        if (res.confirm) {
                                            // open setting
                                            wx.openSetting({
                                                success: (res) => {
                                                    if (res.authSetting['scope.userInfo'] == true) {
                                                        resolve();
                                                    } else {
                                                        reject();
                                                    }
                                                },
                                            });
                                        // open setting
                                        } else if (res.cancel) {
                                            reject();
                                            console.log('用户点击取消')
                                        }
                                    },
                                });
                                //
                            },
                        });
                    } else {
                        resolve();
                    }
                }
            });
            // get setting end 
        });
    }
    */

    // 
    static testAuthorizeUserLocation()
    {
        //
        return new Promise(function(resolve, reject){
            // get setting start 
            wx.getSetting({
                success(res) {
                    console.log('-------------------- testAuthorizeUserLocation');
                    console.log(res);
                    // 已授权
                    if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] == true) {
                        resolve();
                    // 没有授权马上请求授权
                    } else if (res.authSetting['scope.userLocation'] == undefined) {
                        console.log('-------------------- 用户没有授权，现在请求授权');
                        wx.authorize({
                            scope: 'scope.userLocation',
                            success: res => {
                                console.log('-------------------- 请求授权成功');
                                resolve();
                            }, 
                            fail: res => {
                                console.log('-------------------- 请求授权失败(用户拒绝)');
                                reject();
                            },
                        });
                    } else {
                        console.log('-------------------- 用户以前拒绝授权');
                        reject();
                    }
                }
            });
            // get setting end 
        });
        //
    }

    // 
    static testAuthorizeUserInfo()
    {
        //
        return new Promise(function(resolve, reject){
            // get setting start 
            wx.getSetting({
                success(res) {
                    // 用户已授权
                    if (res.authSetting['scope.userInfo'] != undefined && res.authSetting['scope.userInfo'] == true) {
                        resolve();
                    // 用户没有授权信息，请求授权
                    } else if (res.authSetting['scope.userInfo'] == undefined) {
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: res => {
                                resolve();
                            }, 
                            fail: res => {
                                reject();
                            },
                        });
                    // 用户以前就拒绝了授权
                    } else {
                        reject();
                    }
                }
            });
            // get setting end 
        });
        //
    }

    // scope.userLocation
    static authorizeLocationStatus()
    {
        return new Promise(function(resolve, reject){
            // get setting start 
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                       reject();
                    } else {
                        resolve();
                    }
                }
            });
            // get setting end 
        });
    }

    //
    static getUserLocation()
    {
        //
        return new Promise(function(resolve, reject){
            //
            wx.getLocation({
                success: res => {
                    console.log('>>>>>>>>>>>>>>>>>>> get location success');
                    let coordinate = {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    };
                    resolve(coordinate);
                },
                fail: res => {
                    console.log('>>>>>>>>>>>>>>>>>>> get location fail');
                    reject();
                },
                complete: res => {
                    console.log('>>>>>>>>>>>>>>>>>>> get user location complate');
                }
            });
            //
        });
        //
    }

    //
    static accredit()
    {
        //
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                /*
                avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIEe5ZSxElHMHLH7yYtKRjicsfNABQBcsB9LFwXsAmCT88zibicka5wr1rxlJm0at7yjVZZZ1UDfkJbA/132"
                city:"Zhabei"
                country:"China"
                gender:1
                language:"zh_CN"
                nickName:"高飞"
                province:"Shanghai"
                */
                console.log('get user info success');
                let userInfo = res.userInfo;
                that.patch(userInfo)
                .then(res => {
                    //
                    console.log('get user info success');
                    wx.navigateTo({
                        url: '/pages/index/index',
                    });
                    //
                });
            },
            fail: function(res) {
                console.log('get user info faiil');
                console.log('get user info fali, navigate to authorization');
                wx.navigateTo({
                    url: '/pages/authorization/info',
                });
            },
            complete: function(res) {
                console.log('get user info complete');
            }
        });
        //
    }

    //
    static getByUserId(userId) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/user/' + userId;
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
    static get()
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/user';
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
    static patch(item) 
    {
        //
        return new Promise(function(resolve, reject){
            //
            let url = Config.host + '/user_info';
            let options = {
                url: url,
                method:'PUT',
                data: item,
            }

            //
            Http.executeWithLogin(options).then(function(result){
                resolve(result);
            }, function(error) {
                reject(error);
            });
        });
    }

  static getCurrentUser() {
    //
    return new Promise(function (resolve, reject) {
      //
      let url = Config.apiRoot + '/v1/currentUser';
      let options = {
        url: url,
        method: 'get',
      }

      //
      Http.executeWithLogin(options).then(function (result) {
        resolve(result);
      }, function (error) {
        reject(error);
      });
    });
  }
    // 
}