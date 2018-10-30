//
import { Notify } from '../../model/notify';

//
Page({
    data: {
        // articles
        notifies: [],
    },
    //
    onShow() {
        this.loadNotify();
    },
    //
    loadNotify() {
        //
        let that = this;

        //
        Notify.get()
        .then(res => {
            let notifies = res.data;
            that.setData({
                notifies: notifies,
            });
        });
    },
    // 
    navigator(event) {
        //
        let notifyId = event.currentTarget.dataset.id;

        //
        Notify.patchRead(notifyId)
        .then(res => {
            let notify = res.data;
            let url = '/pages/article/item?id=' + notify.article_id;
            wx.navigateTo({
                url: url,
            });
        });
    }
    //
});