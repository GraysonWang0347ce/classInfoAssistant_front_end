// pages/event/index.js
// import {
//     Request
// } from '../../utils/http.js'
let date = new Date()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPublish: false,
        isCancel: false,
        isView: false,
        classid: -1,
        count: -1,
        minHour: 10,
        maxHour: 20,
        minDate: 0,
        maxDate: 0,
        currentDate: 0,
        typeList: [
            '确认型',
            '位置打卡（待开发)',
            '回答型（待开发）'
        ],
        ShowDate: {},
        type: 100,
        target: '核酸打卡',
        duetime: '',
        load: false,
        msg: '0人',
        viewEvent: {},

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            classid: options.classid,
            count: options.count,
            minDate: date.getTime(),
            currentDate: date.getTime()
        })
        switch (options.action) {
            case 'publish':
                this.setData({
                    isPublish: true
                })
                break;
            case 'cancel':
                this.setData({
                    isCancel: true
                })
                break;
            case 'view':
                this.setData({
                    isView: true
                })
                break;
            default:
                break;
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        const res = await app.call({
            url: `event/getUndo?classid=${this.data.classid}`
        })
        var person = []
        for (let ress of Object.values(res)) {
            let pp = []
            for (let mem of ress) {
                pp.push({
                    name: mem.name,
                    eventId: mem.eventId,
                    target: mem.target
                })
            }
            person.push(pp)
        }
        this.setData({
            viewEvent: person
        })

        // Request({
        //     url: `event/getUndo?classid=${this.data.classid}`
        // }).then(res => {
        //     console.log(res)
        //     var person = []
        //     for (let ress of Object.values(res)) {
        //         let pp = []
        //         for (let mem of ress) {
        //             pp.push({
        //                 name: mem.name,
        //                 eventId: mem.eventId,
        //                 target: mem.target
        //             })
        //         }
        //         person.push(pp)
        //     }
        //     this.setData({
        //         viewEvent: person
        //     })
        // })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 在万年历中选择日期触发回调，将选择的日期显示在下方
    onInput(event) {
        this.data.currentDate = event.detail
        let showDate = new Date(this.data.currentDate)
        let ShowDate = {
            year: showDate.getFullYear(),
            month: showDate.getMonth() + 1,
            day: showDate.getDate(),
            hour: showDate.getHours(),
            minute: showDate.getMinutes(),
        }
        this.setData({
            ShowDate
        })
    },

    onTar(event) {
        this.data.target = event.detail
    },

    // 确认事件回调
    onConfirm(event) {
        switch (event.detail.index) {
            case 0:
                this.data.type = 100
                break;
            case 1:
                this.data.type = 200
                break;
            case 2:
                this.data.type = 300
                break;
            default:
                break;
        }
    },


    // 发布事件
    async onPublish() {
        wx.showLoading({
            title: 'Processing',
        })
        let date = new Date()
        const sd = this.data.ShowDate
        const duetime = `${sd.year}年${sd.month}月${sd.day}日 ${sd.hour}:${sd.minute}`
        const eventId = date.getTime()
        const iclass = this.data.classid
        const res = await app.call({
            url: `event/publish?classid=${iclass}&eventid=${eventId}&type=${this.data.type}`,
            method: 'POST',
            data: {
                "duetime": duetime,
                "target": this.data.target
            }
        })
        console.log(res)
        wx.hideLoading({})
        if (res.failpp.length == 0) {
            var msg = '0人'
        } else {
            var msg = res.failpp
            this.data.msg = msg.toString()
        }
        wx.showModal({
            title: '发布成功',
            content: `${msg}发布失败，请提醒其变更订阅消息设置`,
            cancelText: '复制信息',
            success: res => {
                if (res.cancel) {
                    wx.setClipboardData({
                        data: this.data.msg,
                    })
                }
            }
        })

        // Request({
        //     url: `event/publish?classid=${iclass}&eventid=${eventId}&type=${this.data.type}`,
        //     method: 'POST',
        //     duetime,
        //     target: this.data.target
        // }).then(res => {
        //     //console.log(res)
        //     wx.hideLoading({})
        //     if (res.failpp.length == 0) {
        //         var msg = '0人'
        //     } else {
        //         var msg = res.failpp
        //         this.data.msg = msg.toString()
        //     }
        //     wx.showModal({
        //         title: '发布成功',
        //         content: `${msg}发布失败，请提醒其变更订阅消息设置`,
        //         cancelText: '复制信息',
        //         success: res => {
        //             if (res.cancel) {
        //                 wx.setClipboardData({
        //                     data: this.data.msg,
        //                 })
        //             }
        //         }
        //     })
        // })
    },


    // 取消事件，对当前班级所有人删除该事件
    onCancelEvent(event) {
        wx.showModal({
            title: '提示',
            content: '此操作无法撤销',
            success: async ress => {
                if (ress.confirm) {
                    const res = await app.call({
                        url: `event/publish/cancel?classid=${event.detail.classid}&eventid=${event.detail.eventId}`,
                        method: 'POST'
                    })
                    wx.showToast({
                        title: res.msg,
                        icon: res.errorCode ? 'error' : 'success',
                        duration: 3000
                    })
                    if (res.errorCode == 0) {
                        for (let a = 0; a != this.data.viewEvent.length; a++) {
                            if (this.data.viewEvent[a][0].eventId == event.detail.eventId) {
                                this.data.viewEvent.splice(a, 1)
                                this.setData({
                                    viewEvent: this.data.viewEvent
                                })
                            }
                        }
                    }

                    // Request({
                    //         url: `event/publish/cancel?classid=${event.detail.classid}&eventid=${event.detail.eventId}`,
                    //         method: 'POST'
                    //     })
                    //     .then(res => {
                    //         wx.showToast({
                    //             title: res.msg,
                    //             icon: res.errorCode ? 'error' : 'success',
                    //             duration: 3000
                    //         })
                    //         if (res.errorCode == 0) {
                    //             for (let a = 0; a != this.data.viewEvent.length; a++) {
                    //                 if (this.data.viewEvent[a][0].eventId == event.detail.eventId) {
                    //                     this.data.viewEvent.splice(a, 1)
                    //                     this.setData({
                    //                         viewEvent: this.data.viewEvent
                    //                     })
                    //                 }
                    //             }
                    //         }
                    //     })
                }
            }
        })
    },
})