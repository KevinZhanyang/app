//
import { Packet } from '../../model/packet';

//
Page({
    data: {
        //
        currentPacket: {}, 
        //
        packets: [],
    },
    //
    onLoad(options) {
        let articleId = options.article_id;
        // 
        this.loadPacketItem();

        //
        this.loadPacket(articleId);
    },
    //
    loadPacketItem() {
        let that = this;
        Packet.recentItem()
        .then(result => {
            let packet = result.data;
            if (packet.number == undefined) {
                packet.number = 0;
            }
            this.setData({
                currentPacket: packet,
            });
        });
    },
    //
    loadPacket(articleId) {
        // 
        let that = this;
        let options = {
            page: 1,
            article_id: articleId,
        };
        Packet.get(options)
        .then(result => {
            let packets = result.data;
            that.setData({
                packets: packets.data,
            });
        });
    }
    //
});