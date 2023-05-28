// pages/class/index.js
/*
 *@page 此页面对应Tabbar第一页
 */
import {
    randomW
} from '../../utils/randomW'
import {
    User
} from '../../model/user'
import {
    Check
} from '../../model/check'
// import {
//     Request
// } from '../../utils/http.js'
const randomw = new randomW()
const app = getApp()
const user = new User()
const check = new Check()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        classidG: -1,
        classidP: -1,
        color: "#000000",
        value: '',
        isLogin: false,
        isSubscribe: false,
        isName: false,
        msgId: ['ftVKNuGz2hIqvNrZ0OGD2mb7NXTFs8FfUBWPuSAaErw'], // 在小程序后台申请模板消息，每一个对应一个唯一ID
        errmsg: "",
        errmsgg: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //判断是否登录
        this.setData({
            isName: wx.getStorageSync('user').name ? true : false
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            isLogin: app.globalData.hasLogin,
        })
        wx.getSetting({ //
            withSubscriptions: true,
            success: res => {
                if (res.subscriptionsSetting.mainSwitch && res.subscriptionsSetting.itemSettings) {
                    this.setData({
                        isSubscribe: true
                    })
                }
            }
        })

        this.setData({
            color: randomw.randomColor()
        })
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
        wx.navigateTo({
            url: '../detail/index',
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 用于加入班级
    async onConfirmG(event) {
        if (this.data.classidG === -1) {
            this.setData({
                errmsg: "班级号不能为空"
            })
            wx.vibrateShort({
                type: 'heavy',
            })
        } else {
            const res = await app.call({
                url: `class?status=200&classid=${this.data.classidG}`,
                method: 'POST'
            })
            if (res.errorCode != 0) {
                this.setData({
                    errmsg: res.msg
                })
                wx.vibrateShort({
                    type: 'heavy',
                })
                if (res.msg === 'unLogin') {
                    wx.removeStorageSync('user')
                }
            } else if (res.errorCode == 0) {
                wx.navigateTo({
                    url: '../detail/index',
                })
            } else {
                this.setData({
                    errmsg: res.msg
                })
            }

            // Request({url:`class?status=200&classid=${this.data.classidG}`,method:'POST'}).then(res=>{
            //     console.log(res)
            //     if(res.errorCode != 0 ){
            //         this.setData({
            //             errmsg:res.msg
            //         })
            //         wx.vibrateShort({
            //           type: 'heavy',
            //         })
            //     }
            //     else if(res.errorCode == 0){
            //         wx.navigateTo({
            //           url: '../detail/index',
            //         })
            //     }
            //     else{
            //         this.setData({
            //             errmsg:res.msg
            //         })
            //     }
            // })
        }
        //console.log(this.data.classidG) //post代码
    },

    // 用于创建班级
    async onConfirmP(event) {
        if (this.data.classidP === -1) {
            this.setData({
                errmsgg: "班级号不能为空"
            })
            wx.vibrateShort({
                type: 'heavy',
            })
        } else {
            const res = await app.call({
                url: `class?status=100&classid=${this.data.classidP}`,
                method: 'POST'
            })
            if (res.errorCode != 0) {
                this.setData({
                    errmsgg: res.msg
                })
                wx.vibrateShort({
                    type: 'heavy',
                })
                if (res.msg === 'unLogin') {
                    wx.removeStorageSync('user')
                }
            } else if (res.errorCode == 0) {
                wx.navigateTo({
                    url: '../detail/index',
                })
            } else {
                this.setData({
                    errmsgg: res.msg
                })
            }

            // Request({
            //     url: `class?status=100&classid=${this.data.classidP}`,
            //     method: 'POST'
            // }).then(res => {
            //     console.log(res)
            //     if (res.errorCode != 0) {
            //         this.setData({
            //             errmsgg: res.msg
            //         })
            //         wx.vibrateShort({
            //             type: 'heavy',
            //         })
            //     } else if (res.errorCode == 0) {
            //         wx.navigateTo({
            //             url: '../detail/index',
            //         })
            //     } else {
            //         this.setData({
            //             errmsgg: res.msg
            //         })
            //     }
            // })
        }
        console.log(this.data.classidP)
    },

    onChangeG(event) {
        this.data.classidG = event.detail
    },

    onChangeP(event) {
        this.data.classidP = event.detail
    },

    onRandomC() {
        this.setData({
            value: randomw.randomClassId(5, 10), //随机产生5-9位的classid号
        })
        this.data.classidP = this.data.value
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

    // 用于判断是否同意程序发送模板消息
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

    // 在弹出层输入姓名
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
    }
})