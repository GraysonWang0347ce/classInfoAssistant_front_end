// components/event/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        event: Array,
        classid: Number,
        count: Number,
    },

    /**
     * 组件的初始数据
     */
    data: {
        event: [],
        dateS: '',
        nameS: [],
        classid: -1,
        count: -1,
        template:'',

    },

    attached() {
        this.setDate()
        this.setName()
        this.setData({
            template:wx.getStorageSync('template')
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setDate() {
            const timel = parseInt(parseInt(this.data.event[0].eventId)/1000)
            let date = new Date(timel*1000)
            const year = date.getFullYear()
            const month = date.getMonth()+1
            const day = date.getDate()
            const hour = date.getHours()
            const minute = date.getMinutes()
            const second = date.getSeconds()<10?'0'+date.getSeconds().toString():date.getSeconds()
            this.setData({
                dateS: `${year} 年 ${month} 月 ${day} 日 ${hour}:${minute}:${second}`
            })
        },

        setName() {
            let name = []
            for (let res of this.data.event) {
                name.push(res.name)
            }
            this.setData({
                nameS: name
            })
        },

        // 详尽版
        onCopyZ() {
            wx.setClipboardData({
                data: `${this.data.classid}班共${this.data.count}人,今日${this.data.nameS},共${this.data.nameS.length}人未完成${this.data.event[0].target}任务`,
            })
        },

        // 省略版
        onCopyD() {
            wx.setClipboardData({
                data: `${this.data.classid}班共${this.data.count}人,今日${this.data.count-this.data.nameS.length}人已完成${this.data.event[0].target}任务,${this.data.nameS.length}人未完成${this.data.event[0].target}任务`,
            })
        },

        onSetTemplate(event) {
            const str = event.detail.value
            const str1 = str.replaceAll('${classid}',this.data.classid)
            const str2 = str1.replaceAll('${count}',this.data.count)
            const str3 = str2.replaceAll('${name}',this.data.nameS)
            const str4 = str3.replaceAll('${length}',this.data.nameS.length)
            const str5 = str4.replaceAll('${target}',this.data.event[0].target)

            if(wx.getStorageSync('template')){
                wx.removeStorageSync('template')
                wx.setStorageSync('template', str2)
            }
        },

        onCopyY(){
            wx.setClipboardData({
              data: wx.getStorageSync('template'),
            })
        },

        onCancelEvent(){
            this.triggerEvent('cancel',{
                classid:this.data.classid,
                eventId:this.data.event[0].eventId
            },{})
        },
    }
})