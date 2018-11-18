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
      this.loadPacketItem(articleId);

        //
        this.loadPacket(articleId);
    },
    //
  loadPacketItem(articleId) {
        let that = this;
    Packet.getForPacket(articleId)
        .then(result => {
            let packet = result.data.body;
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