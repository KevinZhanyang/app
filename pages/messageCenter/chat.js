var util = require('../../utils/im/util.js'); // 转换时间插件
var utils = require('../../utils/util.js');
var im = require('../../utils/im/webim_wx.js'); // 腾讯云 im 包
var imhandler = require('../../utils/im/im_handler.js'); // 这个是所有 im 事件的 js
var uploadImage = require('../../utils/uploadFile.js');
const app = getApp()

Page({
  data: {
    ishui: false,
    options: {
      duration: 90000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3'
    },
    friendId: '',
    friendName: '',
    friendAvatarUrl: '',
    /**
     * 消息集合（结构如下）：
     * msgTime 消息时间
     * myself 消息发送人 1 - 自己发的 0 - 好友发的
     * avatarUrl 头像
     * msgText 消息内容
     */
    messages: [], // 消息集合
    complete: 0, // 是否还有历史消息可以拉取，1 - 表示没有，0 - 表示有
    content: '', // 输入框的文本值
    lock: false, // 发送消息锁 true - 加锁状态 false - 解锁状态
    scroll_height: wx.getSystemInfoSync().windowHeight - 54,
  },

  //更换底部样式
  changeSendMsgType(event){
    var type = event.currentTarget.dataset.type;
    if (type === "sound"){
      this.setData({
        msgType:"sound"
      })
    }else{
      this.setData({
        msgType: "text"
      })
    }
  },
  onLoad: function(options) {
    var that = this
    if (options) { // 设置会话列表传参过来的好友id
      that.setData({
        friendId: options.friendId,
        friendName: options.friendName,
        friendAvatarUrl: options.friendAvatarUrl
      })
      wx.setNavigationBarTitle({
        title: options.friendName
      })
    }
    that.data.messages = [] // 清空历史消息



    const recorderManager = wx.getRecorderManager();
    recorderManager.onStart(() => {
      let begain = new Date().getTime();
      this.data.begaintime = begain;
      this.innerAudioContext.stop();
      this.setData({
        showModal: true
      })
    });
    recorderManager.onStop((res) => {
      this.setData({
        showModal: false
      })
      let endtime = new Date().getTime();
      let begaintime = this.data.begaintime;
      let time = (endtime - begaintime) / 1000;
      time = Math.ceil(time);
      if (time > 90) {
        time = 90;
      };
      const {
        tempFilePath
      } = res;
      this.setStorage(time, tempFilePath);
    });
    recorderManager.onError((res) => {
      wx.showToast({
        title: '失败，请重试！',
        icon: 'none',
        duration: 0
      });
    });
    this.recorderManager = recorderManager;
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onEnded(_ => {
      this.setData({
        playing: false
      })
    });
    innerAudioContext.onStop(_ => {
      this.setData({
        playing: false
      })
    });
    this.innerAudioContext = innerAudioContext;
  },

  onShow: function() {

    var that = this
    // 私聊参数初始化
    imhandler.init({
      accountMode: app.data.im.accountMode,
      accountType: app.data.im.accountType,
      sdkAppID: app.data.im.sdkappid,
      selType: im.SESSION_TYPE.C2C, //私聊
      imId: app.data.im.identifier,
      imName: app.data.im.imName,
      imAvatarUrl: app.data.im.imAvatarUrl,
      friendId: that.data.friendId,
      friendName: that.data.friendName,
      friendAvatarUrl: that.data.friendAvatarUrl,
      contactListThat: null,
      chatThat: that
    })
    if (im.checkLogin()) {
      //获取聊天历史记录
      imhandler.getC2CHistoryMsgs(function cbOk(result) {
        handlerHistoryMsgs(result, that)
        im.syncMsgs(imhandler.onMsgNotify());
      })
    } else {
      imhandler.sdkLogin(that, app, this.data.selToID, () => {
        //获取聊天历史记录
        imhandler.getC2CHistoryMsgs(function cbOk(result) {
          handlerHistoryMsgs(result, that)
        });
        im.syncMsgs(imhandler.onMsgNotify());
      });
    }
  },
  /**
   * 获取文本的消息
   */
  getContent: function(e) {
    var that = this;
    that.setData({
      content: e.detail.value
    })
  },
  /**
   * 发送消息
   */
  sendMsg: function(e) {
    debugger
    var that = this
    // 消息锁 锁定中
    if (that.data.lock) {
      wx.showToast({
        title: '发消息太急了，慢一点'
      });
      return
    }
    // 开始加锁
    that.setData({
      lock: true
    })
    if (that.data.content == '' || !that.data.content.replace(/^\s*|\s*$/g, '')) {
      wx.showToast({
        title: '总得填点内容吧'
      });
      this.setData({
        lock: false
      })
      return;
    }
    var content = that.data.content
    // 调用腾讯IM发送消息
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, 'text', that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })

    imhandler.sendCustomMsg({
      Data: "宝马一辆",
      Desc: "166",
      Ext: "2177"
    }, function cbOk() {
      that.addMessage({
        data: "宝马一辆",
        desc: "166",
        ext: "2177"
      }, true, 'custom', that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })

    // 解锁
    this.setData({
      lock: false
    })
  },

  //创建自定义消息体
  createhousemsg: function() {
    var that = this;
    var param = {
      app_token: app.data.userInfo.app_token,
      id: that.data.houseId,
      type: that.data.type
    }
    app.request('get', 'createhousemsg', that, param,
      (data) => {
        //这里的data.array.MsgContent为获取到需要发送的消息体字段
        webimhandler.sendCustomMsg(data.array.MsgContent, (data) => {
          var myMessages = that.setDatas(data)
          that.setData({
            myMessages: myMessages,
          })
          setTimeout(function() {
            that.pageScrollToBottom()
          }, 100)
        })
      }, () => {
        setTimeout(function() {
          login.login(app)
        }, 500)
      }, () => {
        wx.navigateBack({
          delta: 1
        })
        return;
      })
  },


  /**
   * 发送消息 这里的type主要区分文本消息和自定义消息；自定义消息具体的类型在消息体里面；
   */
  addMessage: function(msg, isSend, type, that) {
    var messages = this.data.messages;
    var message = {
      'myself': isSend ? 1 : 0,
      'avatarUrl': isSend ? app.data.im.imAvatarUrl : this.data.friendAvatarUrl,
      'msgText': msg,
      'msgType': type,
      'msgTime': util.getDateDiff(Date.parse(new Date()))
    }
    messages.push(message);
    this.setData({
      messages: messages,
      content: '' // 清空输入框文本
    })
    this.scrollToBottom();
  },
  addMessageFriend: function (msg, isSend, type, that) {
    var messages = this.data.messages;
    var message = {
      'myself': msg.isSend ? 1 : 0,
      'avatarUrl': msg.isSend ? app.data.im.imAvatarUrl : that.data.friendAvatarUrl,
      'msgText': msg.elems[0].content,
      'msgType': "custom",
      'msgTime': util.getDateDiff(msg.time * 1000)
    }
    messages.push(message);
    this.setData({
      messages: messages,
      content: '' // 清空输入框文本
    })
    this.scrollToBottom();
  },

  scrollToBottom: function() {
    this.setData({
      toView: 'row_' + (this.data.messages.length - 1)
    });
  },
  //发送图片消息
  toSelectPic() {
    let that = this;
    utils.chooseImage(9).then(res => {
      that.uploadPic(res)
    }).catch(err => wx.showToast({
      title: '图片选择错误' + err,
      icon: "none"
    }))
  },
  //上传图片
  uploadPic(res) {
    let that = this;
    var nowTime = util.formatTime(new Date());
    uploadImage(res.tempFilePaths[0], 'cbb/' + nowTime + '/',
      function(result) {
        console.log("======上传成功图片地址为：", result);
        //调用im 发送自定义图片消息
        var msg = {
          Data: result,
          Desc: "customType",
          Ext: "pic"
        }
        imhandler.sendCustomMsg(msg, function cbOk() {
          var msgT = {
            data: result,
            desc: "customType",
            ext: "pic"
          }
          that.addMessage(msgT, true, 'custom', that)
        }, function cbErr(err) {
          im.Log.error("消息发送失败", err)
        })
      },
      function(result) {
        console.log("======上传失败======", result);
      }
    )
  },


  //语音消息处理
  start() {
    this.setData({
      ishui: true
    })
    this.recorderManager.start(this.data.options);
  },
  end() {
    this.setData({
      ishui: false
    })
    this.recorderManager.stop();
  },
   //param录音时长、语音文件路径
  /**
  * 发送语音消息
  */
  setStorage(ntime, tempFilePath) {
    this.uploadSound(ntime, tempFilePath);
  },
  //上传语音
  uploadSound(rentime, tempFilePaths) {
    let that = this;
    var nowTime = util.formatTime(new Date());
    uploadImage(tempFilePaths, 'cbb/' + nowTime + '/',
      function (result) {
        console.log("======上传成功语音地址为：", result);
        //调用im 发送自定义语音消息
        var msg = {
          Data: result,
          Desc: "customType",
          Ext: "sound"
        }
        imhandler.sendCustomMsg(msg, function cbOk() {
          var msgT = {
            data: result,
            desc: "customType",
            ext: "sound"
          }
          that.addMessage(msgT, true, 'custom', that)
        }, function cbErr(err) {
          im.Log.error("语音消息发送失败", err)
        })
      },
      function (result) {
        console.log("======语音上传失败======", result);
      }
    )
  },
  paly(event) {
    //设置当前语音文件路径
    this.innerAudioContext.src = event.currentTarget.dataset.src;
    this.innerAudioContext.play();
    this.setData({
      playing: true
    })
  },
  //点击自定义消息跳转页面内
  go(event) { 
    var id =  event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/article/item?id=' + id,
    })
  },
  preView(event){
    var current = event.currentTarget.dataset.src;
    //预览图片
    wx.previewImage({
      current: current,
      urls: [current],
    });
  }
})
/**
 * 处理历史消息
 */
function handlerHistoryMsgs(result, that) {
  var historyMsgs = [];
  for (var i = 0; i < result.MsgList.length; i++) {
    var msg = result.MsgList[i]
    var message;
    if (msg.elems[0].type != 'TIMCustomElem') {
      message = {
        'myself': msg.isSend ? 1 : 0,
        'avatarUrl': msg.isSend ? app.data.im.imAvatarUrl : that.data.friendAvatarUrl,
        'msgText': msg.elems[0].content.text,
        'msgType': "text",
        'msgTime': util.getDateDiff(msg.time * 1000)
      }
    } else {
      message = {
        'myself': msg.isSend ? 1 : 0,
        'avatarUrl': msg.isSend ? app.data.im.imAvatarUrl : that.data.friendAvatarUrl,
        'msgText': msg.elems[0].content,
        'msgType': "custom",
        'msgTime': util.getDateDiff(msg.time * 1000)
      }
    }

    historyMsgs.push(message)
  }
  // 拉取消息后，可以先将下一次拉取信息所需要的数据存储起来
  wx.setStorageSync('lastMsgTime', result.LastMsgTime);
  wx.setStorageSync('msgKey', result.MsgKey);
  that.setData({
    messages: historyMsgs,
    complete: result.Complete
  })
}