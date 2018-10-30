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
export class Upload 
{
    //
    static defaultOptions() {
        return {
            formData: {},
            success: noop,
            fail: noop,
            complete: function() {
                Debug.output('upload complete');
            },
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
            'content-type': 'multipart/form-data',
        }
        
        return isObject(obj) ? obj : {};
    }

    static executeAppendHeader(options) 
    {
        // debug
        Debug.output('upload append header start');
        
        // process
        let completedOptions = this.completeOptions(options);
        Debug.output('upload append header start');
        let token = this.appendHeader();
        completedOptions.header = token;
        Debug.output('upload append header end');
        //
        completedOptions.fail = function(error){
            Debug.output('upload executeAppendHeader fail');
        }

        //
        let promise = new Promise((resolve, reject) => {
            //
            completedOptions.success = function(res){
                //
                if (res.statusCode < 300) {
                    //
                    Debug.output('upload execute append header success < 300');
                    resolve(res);
                } else if (res.statusCode >= 400) {
                    //
                    Debug.output('upload execute append header fail  >= 400');
                    reject(res);
                } else {
                    Debug.output('upload execute append header fail ' + res.statusCode);
                }
            };
            //
            completedOptions.complete = function(res) {
                // resolve(res);
            };
            completedOptions.fail = function(res) {
                reject(res);
            }

            // process
            Debug.output('start upload');
            const uploadTask = wx.uploadFile(completedOptions);

            console.log(uploadTask);

            uploadTask.onProgressUpdate((res) => {
                console.log('上传进度', res.progress)
                console.log('已经上传的数据长度', res.totalBytesSent)
                console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            });

        });

        //
        return promise;
    }

    //
    static executeWithLogin (options) {
        // debug
        Debug.output('upload executeWithLogin');

        // process 
        let that = this; 

        // start 
        let promise = new Promise((resolve, reject) => {
            // debug
            Debug.output('upload promise start');

            // 如果没有登陆，登陆后执行
            if (!Authenticate.isLogin()) {
                // debug 
                Debug.output('upload no login');

                // 
                Authenticate.login().then(function(){
                    that.executeAppendHeader(options).then(function(res){
                        //
                        resolve(res);
                    });
                }, function(error){
                    // login fail, redirect to protocol exception
                    reject(error);
                    // that.redirectToExceptionPage();
                });
            // logined
            } else {
                // debug
                Debug.output('upload logined');

                // 执行成功
                that.executeAppendHeader(options).then(function(res){
                    Debug.output('upload execute AppendHeader success');
                    resolve(res);
                // 执行失败，重新登陆后执行
                }, function(error) {
                    // start
                    Debug.output('upload executeAppendHeader fail');

                    //
                    Debug.output('upload executeAppendHeader fail, log in login');
                    Authenticate.login().then(function(loginResponse) {
                        //
                        that.executeAppendHeader(options).then(function(res){
                            //
                            Debug.output('upload executeAppendHeader success');
                            resolve(res);
                        });
                    })
                    .catch(error => {
                        Debug.output('catch Authenticate.login');
                        // that.redirectToExceptionPage();
                    }); 
                });
            }
            //
        });

        // return 
        return promise;
    }

    // 注册成功后返回首页
    /*
    static redirectToExceptionPage()
    {
        let page = 'pages/exception/index';
        wx.redirectTo({
            url: page,
        });
    }
    */
    //
// over 
}

