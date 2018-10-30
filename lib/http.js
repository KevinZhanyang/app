//
import { Authenticate } from './authenticate';
import { extend } from '../vendor/utils';
import Session from './session';
import Constants from './constants';
import { Debug } from './debug';

//
let noop = function noop() {};

function isObject(val) {
  return val !== null && typeof val === 'object';
}

//
export class Http 
{
    //
    static defaultOptions() {
        return {
            method: 'GET',
            success: noop,
            fail: noop,
            complete: noop,
            url: null,
        };
    }

    //
    static completeOptions(options)
    {
        let defaultOptions = this.defaultOptions();
        return extend(
            {},
            defaultOptions,
            options
        );
    }

    //
    static appendHeader()
    {
        let token = Session.get();
        let obj = {
            [Constants.WX_HEADER_TOKEN]: token,
        }
        
        return isObject(obj) ? obj : {};
    }

    static executeAppendHeader(options) 
    {
        // debug
        Debug.output('execute append header start');
        // process
        let completedOptions = this.completeOptions(options);
        Debug.output('append header start');
        let token = this.appendHeader();
        completedOptions.header = token;
        Debug.output('append header end');
        //
        completedOptions.fail = function(error){
            // Debug.output('wx executeAppendHeader fail');
        }

        //
        let promise = new Promise((resolve, reject) => {
            //
            completedOptions.success = function(res){
                //
                if (res.statusCode < 300) {
                    //
                    Debug.output('execute append header success < 300');
                    resolve(res);
                } else if (res.statusCode >= 400) {
                    //
                    Debug.output('execute append header fail  >= 400');
                    reject(res);
                } else {
                    Debug.output('execute append header fail ' + res.statusCode);
                }
            };

            // process
            wx.request(completedOptions);
        });

        //
        return promise;
    }

    //
    static executeWithLogin (options) {
        // debug
        Debug.output('executeWithLogin');

        // process 
        let that = this; 

        // start 
        let promise = new Promise((resolve, reject) => {
            // debug
            Debug.output('promise start');

            // 如果没有登陆，登陆后执行
            if (!Authenticate.isLogin()) {
                // debug 
                Debug.output('no login');

                // 
                Authenticate.login().then(function(){
                    that.executeAppendHeader(options).then(function(res){
                        //
                        resolve(res);
                    });
                }, function(error){
                    // login fail, redirect to protocol exception
                    reject(error);
                    that.redirectToExceptionPage();
                });
            // logined
            } else {
                // debug
                Debug.output('logined');

                // 执行成功
                that.executeAppendHeader(options).then(function(res){
                    Debug.output('executeAppendHeader success');
                    resolve(res);
                // 执行失败，重新登陆后执行
                }, function(error) {
                    // start
                    Debug.output('executeAppendHeader fail');
                    Authenticate.login().then(function(loginResponse) {
                        //
                        that.executeAppendHeader(options).then(function(res){
                            resolve(res);
                        });
                    })
                    .catch(error => {
                        that.redirectToExceptionPage();
                    }); 
                });
            }
            //
        });

        // return 
        return promise;
    }

    // 注册成功后返回首页
    static redirectToExceptionPage()
    {
        let page = 'pages/exception/index';
        wx.redirectTo({
            url: page,
        });
    }
    //
// over 
}

