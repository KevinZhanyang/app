//
import Session from './session';
import Constants from './constants';
import Config from './config';
import Debug from './debug';

//
export class Authenticate 
{
    //
    static isLogin() {
        if (Session.get() == null) {
            return false;
        } else {
            return true;
        }
    }

    //
    static login()
    {
        return new Promise(function(resolve, reject) { 
            // 执行登陆
            wx.login({
                // 执行成功后，换取的参数传给服务端
                success: function (loginResult) {
                    let url = Config.host + '/login';
                    let data = {
                        code: loginResult.code,
                    };

                    // process
                    wx.request({
                        url: url,
                        method: 'POST',
                        data: data,
                        success: function (result) {
                            let statusCode = result.statusCode;
                            let token = result.data;
                            
                            if (statusCode < 300) {
                                Session.set(token);
                                resolve(result);
                            } else {
                                Session.clear();
                                reject(result);
                            }
                        },
            
                        // 响应错误
                        fail: function (loginResponseError) {
                            Debug.output('server error when login');
                        },
                    });
                },
                // 
                fail: function (loginError) {
                    Debug.output('wx.login fail');
                    // console.log(loginError);
                },
                //
            });
        });
        //
    }
}

