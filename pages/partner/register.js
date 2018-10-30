//
import { User } from '../../model/user';
import { Partner } from '../../model/partner';

//
Page({
    data: {
        // user: {},
        partner: {
            // id: 0,
            name: '',
            phone: '',
            school: '',
        },
    },
    onLoad() {
        // this.loadUser();
        this.loadPartner();
    },
    /*
    loadUser() {
        let that = this;
        User.get()
        .then(res => {
            let user = res.user;
            that.setData({
                user: user,
            });
        });
    },
    */
    updatePhone(event) {
        let value = event.detail.value;
        let partner = this.data.partner;
        partner.phone = value;
        this.setData({
            partner: partner,
        });
    },
    updateName(event) {
        let value = event.detail.value;
        let partner = this.data.partner;
        partner.name = value;
        this.setData({
            partner: partner,
        });
    },
    updateSchool(event) {
        let value = event.detail.value;
        let partner = this.data.partner;
        partner.school = value;
        this.setData({
            partner: partner,
        });
    },
    //
    register() {
        let that = this;
        let partner = this.data.partner;

        //
        if (partner.name.length == 0) {
            wx.showToast({
                title: '名字不能为空',
                icon: 'none',
            });
            return;
        }
        if (partner.phone.length == 0) {
            wx.showToast({
                title: '手机号码不能为空',
                icon: 'none',
            });
            return;
        }
        if (partner.school.length == 0) {
            wx.showToast({
                title: '学校不能为空',
                icon: 'none',
            });
            return;
        }

        //
        Partner.register(partner)
        .then(res => {
            // 注册成功后转到
            let partner = res.data;
            that.setData({
                partner: partner,
            });
        });
    },
    //
    loadPartner() {
        let that = this;
        Partner.get()
        .then(res => {
            let partner = res.data;
            that.setData({
                partner: partner,
            });
        });
    },
    //
});