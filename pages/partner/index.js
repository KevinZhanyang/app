//
import { User } from '../../model/user';
import { Promotion } from '../../model/promotion';

//
Page({
    data: {
        // 
        // user: {},
        count: 8,
        // 过程：用暗号换置顶
        code: '', // 当前输入暗号的字符
    },
    onLoad() {
        this.loadPromotionTimes();
    	this.loadUser();
    },
    //
    loadPromotionTimes() 
    {
        //
    },
    // 
    loadUser() {
    	let that = this;
    	User.get()
    	.then(res => {
    		let user = res.data;
    		// 如果用户不是合伙人，转到合伙人海报页
    		if (user.is_partner != 1) {
    			wx.redirectTo({
    				url: '/pages/partner/poster',
    			});
    		}
    		/*
    		that.setData({
    			user: user,
    		});
    		*/
    	});
    },
    updateCode(event) 
    {
        //
        let value = event.detail.value;
        this.setData({
            code: value,
        });
    },
    obtain() {
        //
        let that = this;
        let code = this.data.code;

        // 
        if (code.length == 0) {
            wx.showToast({
                title: '暗号不能为空',
                icon: 'none',
            });
            return;
        }

        Promotion.TradeCode(code)
        .then(res => {
            let result = res.data;
            // 暗号成功换取置顶次数
            if (result.code == 0 ) {
                // 换取成功效果
                let number = 5;
                for (let i = 0; i < 5; i++) {
                    setTimeout(res => {
                        let count = that.data.count;
                        that.setData({
                            count: count + 1,
                        });
                    },i * 200);
                }
    
                // 兑换完毕，问用问户要不要现在去置顶
                // 如果置顶的话就跳转到published页面
                wx.showModal({
                    title: '您已获取了5个置顶的次数',
                    content: '现在是否要去使用置顶',
                    showCancel: true,
                    cancelText: '不去',
                    confirmText: '去置顶',
                    success: res => {
                        if (res.confirm == true) {
                            wx.redirectTo({
                                url: '/pages/home/published',
                            });
                        }
                    },
                });
            // 暗号换取置顶失败
            } else {
                //
                let title = result.msg;
                wx.showToast({
                    title: title,
                    icon: 'none',
                });
            }
        });
        //
    },
    //
});