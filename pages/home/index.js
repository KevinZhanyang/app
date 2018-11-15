//
import { User } from '../../model/user';
import { Notify } from '../../model/notify';

//
const appInstance = getApp();

//
Page({
    data: {
        // tenant 
        systemNotify: 0,
        //
        showShadow: true,
      // 向导
      guideStatus: 0, // 0显示|1不显示
      // 是否有系统通知
    },
  /* share */
  /* guide start */
  showModal() {
    this.setData({
      modal: !this.data.modal
    });
  },
  goPublish() {
    wx.navigateTo({
      url: '/pages/publish/index',
    })
  }
  ,
  goBuy() {
    wx.navigateTo({
      url: '/pages/buy/index',
    })
  },
  initGuide() {
    let that = this;
    wx.getStorage({
      key: "index_guide",
      success: res => {
        that.setData({
          guideStatus: 1
        });
      },
      fail: res => {
        that.setData({
          guideStatus: 0
        });
      }
    });
  },
  closeGuide() {
    this.setData({
      guideStatus: 1
    });
    wx.setStorage({
      key: "index_guide",
      data: Date.now()
    });
  },
  preventTouchMove: function (e) {
    this.setData({
      modal: !this.data.modal
    });
  },
  /* guide end */
    //
    onLoad() {
        let that = this;
        // 如果没有授权地理位置，转到授权
        User.testAuthorizeUserLocation()
        .then(res => {
            //
            User.testAuthorizeUserInfo()
            .then(res => {
                //
                that.setData({
                    showShadow: false,
                });

                //
                that.loadUser();
            })
            .catch(res => {
                console.log('========== 进入个人中心页面，用户信息末授权，转向/pages/authorization/info');
                wx.redirectTo({
                    url: '/pages/authorization/info?from=/pages/home/index',
                });
            });
            //
        })
        .catch(res => {
            console.log('========== 进入地址授权页，转向/pages/authorization/location');
            wx.redirectTo({
                url: '/pages/authorization/location?from=/pages/home/index',
            });
            return;
        });
        //
    },
    onShow() {
        this.loadNotify();
    },
    loadNotify() {
        let that = this;
        Notify.count()
        .then(res => {
            let notify = res.data;
            that.setData({
                systemNotify: notify,
            });
        });
    },
    //
    loadUser() {
        //
        let that = this;
        User.get()
        .then(res => {
            let user = res.data;
            that.setData({
                user: user,
            });

            // 如果用户头像或昵称为空，
            // 如果用户授权了
            // 更新信息
            console.log(user.nickname);
            console.log(user.avatar.length);

            //
            if (user.nickname.length < 2 || user.avatar.length == 0) {
                User.syncUserInfo();
            } 
        });
    },
    //
    /*
    invite(){
    	wx.showShareMenu({
  			withShareTicket: false,
		});
    },
    */
    onShareAppMessage: function (res) {
        //
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }

        //
        return {
            title: '为留学生打造的专业二手交易平台',
            path: '/pages/index/index',
            imageUrl: 'http://static.124115.com/static/program/img/index/share.png',
        };
    },
    //
});