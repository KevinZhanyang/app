//
import { User } from '../../model/user';

//
Page({
    data: {
        // tenant 
        user: {},
        verification_code:'',
        //
        phoneChanged: false,
    },
    //
    onLoad(){
        this.loadUser();
    },
    loadUser() {
        let that = this;
        User.get()
        .then(res => {
            let user = res.data;
            that.setData({
                user: user,
            });
        });
    },
    getPhoneNumber: function(e) { 
        let detail = e.detail;
        if (detail.errMsg == 'getPhoneNumber:fail user deny') {
            return;
        }
        /*
        encryptedData:"LopD23wFFlQuBfMuI6eTYM9PpRbMBpiNA2oYJjL+4RYByHrOe9kTEc19qvum5thKOTMkyvkHu/jCXKTvL2rEWSsHGwQ1ZTiDce8iWSxxMR6kL2Fcly3KIziu3iif+F32pNlnmLK98baKckTYSG9Uslg95T4PKqYRLGyXbx8Os5TL6HEvf0ikqlgDdLHPJwrj9P76YvqnpG+0CsqGz8B4xQ=="
        errMsg:"getPhoneNumber:ok"
        iv:"2CB1MGEZJA4bWdI8EhRs+g=="
        */
        let that = this;
        let encryptedData = detail.encryptedData;
        let iv = detail.iv;
        //
        wx.checkSession({
            // 如果已经登陆了，获取手机号
            success: res => {
                //
                let options = {
                    encryptedData: encryptedData,
                    iv: iv,
                };
                //
                User.getPhone(options)
                .then(res => {
                    let user = res.data;
                    //
                    wx.showToast({
                        title: '绑定完成',
                        duration: 1500,
                    });

                    //
                    that.setData({
                        user: user,
                    });

                    //
                    setTimeout(function(){
                        //
                        // wx.redirectTo({
                        //     url: '/pages/home/index',
                        // });
                        wx.navigateBack({
                          
                        })
                        //
                    }, 1500);
                    //
                });
                //
            },
            fail: res => {
                wx.login({
                    success:res => {
                        let code = res.code;
                        //
                        let options = {
                            code: code,
                            encryptedData: encryptedData,
                            iv: iv,
                        };
                        //
                        User.getPhone(options)
                        .then(res => {
                            //
                            let user = res.data;

                            //
                            wx.showToast({
                                title: '绑定完成',
                                duration: 1500,
                            });

                            //
                            that.setData({
                                user: user,
                            });

                            // 转到首页
                            console.log('11111');
                            setTimeout(function(){
                                //
                                console.log('222222');
                                wx.redirectTo({
                                    url: '/pages/home/index',
                                });
                                //
                            }, 1500);
                        });
                        //
                    },
                });
            },
        });
        //
    },
    //
});