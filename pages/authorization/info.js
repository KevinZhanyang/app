//
import { User } from '../../model/user';

//
Page({
    data: {
        // 
        from: '',
    },
    onLoad(options){
        //
        let from = this.options.from;
        this.data.from = from;

        //
        /*
    	let that = this;
    	wx.getSetting({
            success: res => {
                console.log('授权信息');
                console.log(res);
                let authSetting = res.authSetting;
                // 如果已授权返回上一页
                if (authSetting['scope.userInfo']) {
                    that.back();
                // 如果没有授权马上提示授权
                } 
                else {
                    // 弹出授权对话框，成功后还是返回上一页
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: res => {
                            that.updateUserinfo();
                            that.back();
                        },
                        // 用户拒绝授权|用户以前拒绝过不提示，警告
                        fail: res => {
                        	//
                        	// that.getUserInfo();
                        },
                    });
                }
            }
        });
        */
        /*
        let that = this;
        wx.authorize({
            scope: 'scope.userInfo',
            success: res => {
                let authSetting = res.authSetting;
                if (authSetting != undefined && authSetting['scope.userInfo'] != undefined && authSetting['scope.userInfo'] == true) {
                    console.log('>>>>>>>>>>>>>>>>>>>> wx.authorize success');
                    console.log(res);
                    that.updateUserinfo();
                    that.back();
                } else {
                    console.log('>>>>>>>>>>>>>>>>>>>> wx.authorize fail');
                    console.log(res);
                }
            },
        });
        */
    	//
    },
    /*
    updateUserinfo()
    {
        //
        console.log('+++++++++++++++++++ start update user info');
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                // avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIEe5ZSxElHMHLH7yYtKRjicsfNABQBcsB9LFwXsAmCT88zibicka5wr1rxlJm0at7yjVZZZ1UDfkJbA/132"
                // city:"Zhabei"
                // country:"China"
                // gender:1
                // language:"zh_CN"
                // nickName:"高飞"
                // province:"Shanghai"
                console.log(res);
                let userInfo = res.userInfo;
                User.patch(userInfo)
                .then(res => {
                    //
                    console.log('+++++++++++++++++++ update user info success');
                });
            },
            fail: function(res) {
                console.log('+++++++++++++++++++ update user info fail');
            },
            complete: function(res) {
                console.log('+++++++++++++++++++ update user info complete');
            }
        });
        //
    },
    */
    //
    handler(event) {
        let detail = event.detail;
        /*
        let detail = {
        	errMsg:"getUserInfo:fail auth deny",
        };
        //
        let detail = {
        	encryptedData:"NwtnBcglVCRkNGAlGpMmGpLC1mgOTFLhAPfz+L1j/tthJHxRkYPgRc18k8GZkkcpT9kalG3Hg80CaFEYuN4acvkl5MgPejg9o3zdPskjjjldPGQiKlWGOhiQHVKp0YeTLNuvVpkvF7/AIlSctVH/yVGBq5S8LCcg7t4jzFuqxZlDmRrwKIvOUqKe5HIxfTmthj0hXSwvZ3Ae4MiNujRT1R8CGcNIdG1rS5jgnAmhquZBsN/ezki/u5sekwo+qI3I0C/0CD2/7MIbRlFVwTIdrMnWL8uG1mJXPGojHd+EVcu17/E2TquHtB+lQV3RYSEUikQ/mkb5ANfmU8uqnMi1gWQ2H6tMUnCnXxvUqPzCYSLe5jPg+oH2swNYRp+7y88Zq5wJmbjraC/M4eDaNDDNLU1mClbg7LCIDzrOvvFAq5Ew6cAASAh6sIsxiqOgN8ZZZPOTftOa70WhlttkY4QBtVutk1Ss3kwDegB9iiElNF4="
			errMsg:"getUserInfo:ok"
			iv:"vICvxE5GuJGa3rGGHagYiw=="
			rawData:"{"nickName":"高飞🐶",
			"gender":1,
			"language":"zh_CN",
			"city":"Zhabei",
			"province":"Shanghai",
			"country":"China",
			"avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKYakRbKet4XUMQDKTkU4Yk0VxyGh27EkOPmY0RSHUy8SW2icvrPm34MmgkRUzXVawF2d84jtIj3zw/132"}"
			signature:"be4ecbd47c7b48f8880e34130d8386c78463711c",
			userInfo: {
				avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKYakRbKet4XUMQDKTkU4Yk0VxyGh27EkOPmY0RSHUy8SW2icvrPm34MmgkRUzXVawF2d84jtIj3zw/132"
				city:"Zhabei",
				country:"China",
				gender:1,
				language:"zh_CN",
				nickName:"高飞🐶",
				province:"Shanghai",
			}
        }
        */
        // 授权成功
        if (detail.errMsg == 'getUserInfo:ok'){
            let that = this;
            let info = detail.userInfo;
            User.patch(info)
            .then(res => {
                console.log('++++++++++++++++++++ 用户通过USERINFO按钮授权，更新服务器数据。')
                that.back();
            })
        } else {
        	//
        	/*
	        wx.showModal({
	            title: '提示',
	            content: '如果不授权用户信息，不能使用部分功能',
	            showCancel: false,
	            // 如果用户同意了转到设置页
	            success: res => {
	            	//
	            },
	            fail: res => {
	            	//
	            	wx.redirectTo({
	            		url: '/pages/index/index',
	            	});
	            },
	        });
	        */
        	//
        }
        //
    },
    // 授权成功返回上一页，失败返回首页
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