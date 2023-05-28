// components/avatar/index.js
Component({
    options: {
        multipleSlots: true
    },
    externalClasses: [''],
    /**
     * 组件的属性列表
     */
    properties: {
        color: {
            type: String,
            value:"#ffffff",
            observer:'setColor'
        },
        imgSrc:String,
        name:String,
        aliyas:String,
        isAdmin:Boolean,
        classid:Number
    },

    attached() {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        color: '',
        imgSrc:'',
        name:'',
        aliyas:'',
        isAdmin:false,
        classid:-1
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // setColor(){
        //     this.setData({
        //         color
        //     })
        // }

        onTap(event){
            this.triggerEvent('onAvatar',{
                name:this.data.name,
                aliyas:this.data.aliyas,
                isAdmin:this.data.isAdmin,
                classid:this.data.classid
            },{})
            //console.log(event)
        }
    }
})