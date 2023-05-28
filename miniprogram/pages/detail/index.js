// pages/detail/index.js
// import {
//     Request
// } from '../../utils/http.js'
import {
    randomW
} from '../../utils/randomW.js'
const app = getApp()
const randomw = new randomW()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        class: [],
        classIds: [],
        classCount: 0,
        color: '#000000',
        isCMS: false,
        isClass: false,
        tempInfo: {},
        tempClass: -1,
        tempCount: -1,
        actions: [{
                name: "提升为管理员"
            },
            {
                name: "降低管理员权限"
            },
            {
                name: "逐出班级",
                color: "#ee0a24"
            },
            {
                name: "取消",
                color: "#cccccc"
            }
        ],
        actionsC: [{
                name: "发布事项"
            },
            {
                name: "查看事项"
            },
            {
                name: "退出班级",
                color: "#ee0a24"
            },
            {
                name: "取消",
                color: "#cccccc"
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
            url: 'class/latest'
        })
        //console.log(res)
        this.setData({
            class: res.class,
            classIds: res.classIds,
            classCount: res.count
        })

        // Request({
        //     url: 'class/latest'
        // }).then(res => {
        //     console.log(res)
        //     this.setData({
        //         class: res.class,
        //         classIds: res.classIds,
        //         classCount: res.count
        //     })
        // })
        // this.setData({
        //     color: randomw.randomColor()
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

    onCMS(event) {
        console.log(event.detail)
        this.setData({
            isCMS: true,
            tempInfo: event.detail
        })
    },

    onClose() {
        this.setData({
            isCMS: false,
            isClass: false
        })
    },

    async onSelect(event) {
        //console.log(event.detail)
        switch (event.detail.name) {
            case "取消":
                this.onClose()
                break;
            case "提升为管理员":
                //console.log(this.data.tempInfo)
                const res = await app.call({
                    url: `class/promote?status=1&classid=${this.data.tempInfo.classid}`,
                    method: 'POST',
                    data: {
                        "tarName": this.data.tempInfo.name,
                        "aliyas": this.data.tempInfo.aliyas
                    }
                })
                console.log(res)
                wx.showToast({
                    title: res.msg,
                    icon: res.errorCode ? 'error' : 'success',
                    duration: 3000
                })

                // Request({
                //     url: `class/promote?status=1&classid=${this.data.tempInfo.classid}`,
                //     method: 'POST',
                //     tarName: this.data.tempInfo.name,
                //     aliyas: this.data.tempInfo.aliyas
                // }).then(res => {
                //     console.log(res)
                //     wx.showToast({
                //         title: res.msg,
                //         icon: res.errorCode ? 'error' : 'success',
                //         duration: 3000
                //     })
                // })
                break;
            case "降低管理员权限":
                const ress = await app.call({
                    url: `class/promote?status=0&classid=${this.data.tempInfo.classid}`,
                    method: 'POST',
                    data: {
                        "tarName": this.data.tempInfo.name,
                        "aliyas": this.data.tempInfo.aliyas
                    }
                })
                wx.showToast({
                    title: ress.msg,
                    icon: ress.errorCode ? 'error' : 'success',
                    duration: 3000
                })

                // Request({
                //     url: `class/promote?status=0&classid=${this.data.tempInfo.classid}`,
                //     method: 'POST',
                //     tarName: this.data.tempInfo.name,
                //     aliyas: this.data.tempInfo.aliyas
                // }).then(res => {
                //     console.log(res)
                //     wx.showToast({
                //         title: res.msg,
                //         icon: res.errorCode ? 'error' : 'success',
                //         duration: 3000
                //     })
                // })
                break;
            case "逐出班级":
                this.twiceComfirm(this.data.tempInfo)
                break;
            default:
                break;
        }
    },

    onSelectC(event) {
        switch (event.detail.name) {
            case "发布事项":
                this.jumpEventDetail(this.data.tempClass, 'publish')
                break;
            case "查看事项":
                this.jumpEventDetail(this.data.tempClass, 'view')
                break;
            case "退出班级":
                this.twiceComfirmQuit(this.data.tempClass)
                break;
            default:
                break;
        }
    },

    jumpEventDetail(classid, action) {
        wx.navigateTo({
            url: `../event/index?classid=${classid}&action=${action}&count=${this.data.tempCount}`,
        })
    },

    async twiceComfirm(tempInfo) {
        wx.showModal({
            title: '提示',
            content: '此操作不能撤销',
            success: async res => {
                if (res.confirm) {
                    //console.log(this)
                    const res = await app.call({
                        url: `class/delete?classid=${tempInfo.classid}`,
                        method: 'POST',
                        data: {
                            "tarName": this.data.tempInfo.name,
                            "aliyas": this.data.tempInfo.aliyas
                        }
                    })
                    wx.showToast({
                        title: res.msg,
                        icon: res.errorCode ? 'error' : 'success',
                        duration: 3000
                    })

                    // Request({
                    //     url: `class/delete?classid=${tempInfo.classid}`,
                    //     method: 'POST',
                    //     tarName: tempInfo.name,
                    //     aliyas: tempInfo.aliyas
                    // }).then(res => {
                    //     wx.showToast({
                    //         title: res.msg,
                    //         icon: res.errorCode ? 'error' : 'success',
                    //         duration: 3000
                    //     })
                    // })
                }
            }
        })
    },

    async twiceComfirmQuit(classid) {
        wx.showModal({
            title: `确定要退出${classid}吗`,
            content: '此操作不能撤销，且如班级创建者退出则会导致整个班级被删除',
            success: async res => {
                if (res.confirm) {
                    //console.log(this)
                    const res = await app.call({
                        url: `class?status=300&classid=${classid}`,
                        method: 'POST',
                    })
                    wx.showToast({
                        title: res.msg,
                        icon: res.errorCode ? 'error' : 'success',
                        duration: 3000
                    })

                    // Request({
                    //     url: `class?status=300&classid=${classid}`,
                    //     method: 'POST',
                    // }).then(res => {
                    //     wx.showToast({
                    //         title: res.msg,
                    //         icon: res.errorCode ? 'error' : 'success',
                    //         duration: 3000
                    //     })
                    // })
                }
            }
        })
    },

    onClass(event) {
        //console.log(event.detail)
        this.setData({
            tempClass: event.detail.classid,
            tempCount: event.detail.count,
            isClass: true
        })
    }
})