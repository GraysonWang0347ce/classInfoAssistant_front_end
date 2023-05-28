// components/classid/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        classid:Number,
        count:Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        classid:-1,
        count:-1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClass(){
            this.triggerEvent('class',{
                classid:this.data.classid,
                count:this.data.count
            },{})
        }
    }
})
