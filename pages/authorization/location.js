//
import { User } from '../../model/user';

//
Page({
    data: {
        // tenant 
        from: '',
    },
    onLoad(options){
        //
        let from = this.options.from;
        this.data.from = from;

        // 如果用户已经授权地址位置了就返回
    },
    onShow() {
        /*
        let that = this;
        wx.getSetting({
            success: res => {
                //
                console.log('授权信息');
                console.log(res);

                let authSetting = res.authSetting;
                if (authSetting['scope.userLocation']) {
                    //
                    console.log('wx.getSetting scope.userLocation 已授权');
                    that.back();
                // 如果没有授权马上提示授权
                } else {
                    console.log('wx.getSetting scope.userLocation 末授权');
                    // 弹出授权对话框
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: res => {
                            console.log('wx.authorize scope.userLocation success');
                            that.back();
                        },
                        // 如果用户拒绝授权或者用户以前拒绝而无法弹出弹窗，
                        fail: res => {
                            //
                            console.log('wx.authorize scope.userLocation fail');
                        },
                        complete: res => {
                            //
                            console.log('wx.authorize scope.userLocation complete');
                        }
                    });
                }
            },
            fail: res => {
                console.log('wx.getSetting fail');
            }
        });
        */
        let that = this;
        wx.authorize({
            scope: 'scope.userLocation',
            success: res => {
                console.log('################# wx.authorize scope.userLocation success');
                console.log(res);
            
                that.back();
            },
            // 如果用户拒绝授权或者用户以前拒绝而无法弹出弹窗，
            fail: res => {
                //
                console.log('################# wx.authorize scope.userLocation fail');
            },
            complete: res => {
                //
                console.log('################# wx.authorize scope.userLocation complete');
            }
        });
    },
    /*
    onShow() {
        //
        let that = this;
        wx.getSetting({
            success: res => {
                let authSetting = res.authSetting;
                if (authSetting['scope.userLocation'] == true) {
                    that.back();
                // 如果没有授权马上提示授权
                }
            }
        });
        //
    },
    */
    // 让用户授权地理位置。然后返回上一页
    /*
    getUserLocation() {
        //
        let that = this;
    	// 请求权限，如果成功了返回上一次，如果失败了转到设置
        wx.authorize({
            scope: 'scope.userLocation',
            // 如果是第一次请求，弹出提示，授权成功，转到上一页
            success: res => {
                that.back();
            },
            // 如果第二次授权，没有弹出提示框或者用户拒绝了授权地理位置
            fail: res => {
                wx.showModal({
                    title: '提示',
                    content: '如果不授权地址位置，不能使用部分功能',
                    // 如果用户同意了转到设置页
                    success: res => { 
                        wx.openSetting({
                        });
                        console.log('open settiong success');
                    },
                    // 如果失败了，让用户自已返回上一页
                    fail: res => {
                        //
                    },
                });
            },
        });
        
    },
    */
    handler(event) {
        //
        let authSetting = event.detail.authSetting;
        // 授权成功
        if (authSetting['scope.userLocation']){
            this.back();
            return;
        } 
        //
        /*
        wx.showModal({
            title: '提示',
            content: '如果不授权地址位置，不能使用部分功能',
            showCancel: false,
            // 如果用户同意了转到设置页
        });
        */
        //

    },
    // 返回上一页
    back() {
        let from = decodeURIComponent(this.data.from);
        console.log(this.data.from);
        console.log(from);

        //
        wx.redirectTo({
            url: from,
        });
    },
    //
});