//
const ald = require('./utils/sdk/ald-stat.js');
import { User } from './model/user';

//app.js
App({
	globalData: {
        /*
		coordinate: {
            latitude: 0, // 纬度
            longitude: 0, // 经度
        },
        */
        published: false,
	},
    onLaunch(options) {
    	// 获取用户坐标
        // this.getAccredit();
        // this.getUserLocation();
    	// 获取用户信息
    //
    },
    //
    getAccredit() {
        User.accredit();
    },
    //
    /*
    getUserLocation() {
        let that = this;
        User.getUserLocation()
        .then(result => {
            //
            that.globalData.coordinate = result;
        })
        .catch(result => {
        });
    },
    */
    //
});