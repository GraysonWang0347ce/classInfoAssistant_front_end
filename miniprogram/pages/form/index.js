// pages/form/index.js
import {
    User
} from '../../model/user'
// import {
//     Request
// } from '../../utils/http.js'
const app = getApp()
const user = new User()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin: false,
        formNum: 0,
        isName: false,
        isSubscribe: false,
        loading: true,
        msgId: ['ftVKNuGz2hIqvNrZ0OGD2mb7NXTFs8FfUBWPuSAaErw'],
        events: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        //判断是否登录
        this.setData({
            isName: wx.getStorageSync('user').name ? true : false,
        })

        //拉取事项
        const res = await app.call({
            url: 'event/get'
        })
        this.setData({
            events: res,
            formNum: res.length,
        })





        //拉取事项
        // Request({
        //     url: 'event/get'
        // }).then(res => {
        //     //console.log(res)
        //     this.data.events = res
        // })
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

        // 判断是否弹出登录PopUp层
        this.setData({
            isName: wx.getStorageSync('user').name ? true : false,
            isLogin: app.globalData.hasLogin,
            formNum: this.data.events.length,
        })
        wx.getSetting({
            withSubscriptions: true,
            success: res => {
                if (res.subscriptionsSetting.mainSwitch && res.subscriptionsSetting.itemSettings) {
                    this.setData({
                        isSubscribe: true
                    })
                }
            }
        })

        //拉取事项
        const res = await app.call({
            url: 'event/get'
        })
        this.setData({
            events: res,
            formNum: res.length,
        })

        // Request({
        //     url: 'event/get'
        // }).then(res => {
        //     //console.log(res)
        //     this.setData({
        //         events: res,
        //         formNum: res.length
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

    async onLogin() {
        wx.getUserProfile({
            desc: '做为身份标识',
            success: async res => {
                console.log(res)
                user.avatarUrl = res.userInfo.avatarUrl
                user.aliyas = res.userInfo.nickName
                //user.openid = res.userInfo.openid
                user.storgeUserInfoSync
                app.globalData.hasLogin = true
                await app.call({
                    url: 'user/login',
                    method: 'POST',
                    data: {
                        "user": {
                            "aliyas": user.aliyas,
                            "avatarUrl": user.avatarUrl,
                            "name": user.name || ''
                        }
                    }
                })

                // console.log(wx.getStorageSync('user'))
                // Request({
                //     url: 'user/login',
                //     method: 'POST'
                // })
            }
        })
        this.setData({
            isLogin: true
        })
    },

    onTest() {
        wx.cloud.callContainer({
            "config": {
                "env": "prod-1gadj5n1ef1640f7"
            },
            "path": "/api/count",
            "header": {
                "X-WX-SERVICE": "koa-va3h"
            },
            "method": "POST",
            "data": {
                "action": "inc"
            }
        })
    },

    onSubscribe() {
        wx.requestSubscribeMessage({
            tmplIds: this.data.msgId,
            success: res => {
                //console.log(res[this.data.msgId] )
                if (res[this.data.msgId] == 'accept') {
                    this.setData({
                        isSubscribe: true
                    })
                }
            }
        })
    },

    async onName(event) {
        user.name = event.detail
        user.storgeUserInfoSync
        app.globalData.hasName = true
        this.setData({
            isName: true
        })
        if (wx.getStorageSync('user').avatarUrl) {
            const aliyas = wx.getStorageSync('user').aliyas
            const avatarUrl = wx.getStorageSync('user').avatarUrl
            const name = wx.getStorageSync('user').name
            await app.call({
                url: 'user/login',
                method: 'POST',
                data: {
                    "user": {
                        "aliyas": aliyas,
                        "avatarUrl": avatarUrl,
                        "name": name
                    }
                }
            })

            // Request({
            //     url: 'user/login',
            //     method: 'POST',
            //     body: wx.getStorageSync('user')
            // })
        }
    },

    async onCancel(event) {
        console.log(event.detail)
        switch (event.detail.type) {
            case 100:
                const res = await app.call({
                    url: `event/confirm?eventId=${event.detail.eventId}&classid=${event.detail.classid}`,
                    method: "POST"
                })
                wx.showToast({
                    title: res.msg,
                    icon: res.errorCode ? 'error' : 'success',
                    duration: 3000
                })
                if (res.errorCode == 0) {
                    for (let a = 0; a != this.data.events.length; a++) {
                        if (this.data.events[a].eventId == event.detail.eventId) {
                            this.data.events.splice(a, 1)
                            this.setData({
                                events: this.data.events,
                                formNum: this.data.events.length
                            })
                            wx.vibrateShort({
                                type: 'heavy',
                            })
                        }
                    }
                }

                // Request({
                //         url: `event/confirm?eventId=${event.detail.eventId}&classid=${event.detail.classid}`,
                //         method: "POST"
                //     })
                //     .then(res => {
                //         wx.showToast({
                //             title: res.msg,
                //             icon: res.errorCode ? 'error' : 'success',
                //             duration: 3000
                //         })
                //         if (res.errorCode == 0) {
                //             for (let a = 0; a != this.data.events.length; a++) {
                //                 if (this.data.events[a].eventId == event.detail.eventId) {
                //                     this.data.events.splice(a, 1)
                //                     this.setData({
                //                         events: this.data.events,
                //                         formNum: this.data.events.length
                //                     })
                //                     wx.vibrateShort({
                //                         type: 'heavy',
                //                     })
                //                 }
                //             }
                //         }
                //     })
                break;

            default:
                wx.showToast({
                    title: 'Invalid',
                    icon: 'error'
                })
                break;
        }
    },


})