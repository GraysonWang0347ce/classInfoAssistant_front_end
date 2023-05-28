// pages/profile/index.js
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
const user = new User
const check = new Check()
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        color: '#083510',
        profileSrc: '',
        aliyas: '',
        isLogin: false,
        name: '',
        load: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {


        // this.setData({ //tbd
        //     color: randomw.randomColor()
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
    onShow() {
        this.setData({
            isLogin: app.globalData.hasLogin
        })

        if (this.data.isLogin) {
            this.setData({
                profileSrc: check.tryGetInfo.avatarUrl,
                aliyas: check.tryGetInfo.aliyas
            })
        }
        this.setData({
            name: wx.getStorageSync('user').name
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    async onSetProfile() { //获取用户头像、昵称、openid（tbd）
        wx.getUserProfile({
            desc: '做为身份标识',
            success: async res => {
                if (this.data.isLogin) {
                    wx.removeStorageSync('user')
                }
                console.log(res)
                this.setData({
                    aliyas: res.userInfo.nickName,
                    profileSrc: res.userInfo.avatarUrl,
                    isLogin: true,
                })
                user.avatarUrl = res.userInfo.avatarUrl
                user.aliyas = res.userInfo.nickName
                user.storgeUserInfoSync
                app.globalData.hasLogin = true
                console.log(wx.getStorageSync('user'))
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
            }
        })
    },

    onChangeName() {
        this.setData({
            load: true
        })
    },

    onClose() {
        this.setData({
            load: false
        })
    },

    async onName(event) {
        user.name = event.detail
        user.changeName
        this.setData({
            load: false,
            name: wx.getStorageSync('user').name
        })
        const iUser = wx.getStorageSync('user')
        await app.call({
            url: 'user/login',
            method: 'POST',
            data: {
                "user": {
                    "aliyas": iUser.aliyas,
                    "avatarUrl": iUser.avatarUrl,
                    "name": iUser.name || ''
                }
            }
        })
        //console.log(wx.getStorageSync('user').name)
    },

    // 非云托管情景下获取用户openid，详见服务器API'/v1/user/sendmsg'
    onGetOpenId() {
        wx.login({
            success: res => {
                wx.request({
                    url: 'http://localhost:3000/v1/user/sendmsg',
                    header: {
                        openid: 'oLdGg5AhHBXbNzaQh19MZb5u48fg'
                    },
                    success: ress => {
                        console.log(ress)
                    }
                })
            }
        })
    },

    // 彻底抹除数据库与本地所有个人信息
    onCancellate() {
        wx.showModal({
            title: '提示',
            content: '此操作无法撤销',
            success: async ress => {
                if (ress.confirm) {
                    const res = await app.call({
                        url: 'user/cancellate',
                        method: 'POST'
                    })
                    wx.showToast({
                        title: res.msg,
                        icon: res.statusCode != 204 ? 'error' : 'success',
                        duration: 3000
                    })
                    if (res.errorCode == 0) {
                        wx.removeStorageSync('user')
                        this.setData({
                            profileSrc:'',
                            aliyas:'',
                            isLogin:false,
                            name:''
                        })
                    }


                    // Request({
                    //         url: 'user/cancellate',
                    //         method: 'POST'
                    //     })
                    //     .then(res => {
                    //         console.log(res)
                    //         wx.showToast({
                    //             title: res.msg,
                    //             icon: res.statusCode != 204 ? 'error' : 'success',
                    //             duration: 3000
                    //         })
                    //     })
                }
            }
        })
    },

    onInstruction() {
        wx.navigateTo({
            url: '../view/index?action=1',
        })
    },

    onConnect() {
        wx.navigateTo({
            url: '../view/index?action=2',
        })
    },
})