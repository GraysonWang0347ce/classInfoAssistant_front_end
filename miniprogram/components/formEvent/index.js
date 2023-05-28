// components/formEvent/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        event: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        event: {},
        date: '',
    },

    attached() {
        this.setDate(this.data.event)
        //console.log(this.data.event)
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setDate(event) {
            let time = parseInt(event.eventId)
            let date = new Date(time)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hour = date.getHours()
            const minute = date.getMinutes()
            const second = date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds()
            this.setData({
                date : `${year} 年 ${month} 月 ${day} 日 ${hour}:${minute}:${second}`
            })
        },

        onEvent(){
            this.triggerEvent('event',{
                eventId:this.data.event.eventId,
                classid:this.data.event.classid,
                type:this.data.event.type
            })
        }
    }
})