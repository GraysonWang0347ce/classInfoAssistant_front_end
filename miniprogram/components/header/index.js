// components/header/index.js
import{
    randomW
} from '../../utils/randomW'
const randomw = new randomW

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        color:{
            type:String
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        year: 1970,
        month: 1,
        day: 1,
        hour: 0,
        months: [
            ["孟春","柳月","芳岁"],
            ["仲春","杏月","酣春"],
            ["季春","桃月","暮春"],
            ["孟夏","麦月","梅月"],
            ["仲夏","蒲月","星月"],
            ["季夏","荷月","晚夏"],
            ["孟秋","瓜月","兰月"],
            ["仲秋","桂月","南宫"],
            ["季秋","菊月","秋末"],
            ["亥月","阳月","露月"],
            ["霜月","葭月","畅月"],
            ["梅月","暮岁","岁杪"]
        ],
        weekday:["日","壹","贰","叁","肆","伍","陆","日"],
        showMonth:null,
    },

    attached() {
        //获取日期
        let date = new Date()
        this.setData({
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDay(),
            hour: date.getHours(),
            //color:randomw.randomColor(),
        })
        this.randMonth()//随机月份别称
    },

    /**
     * 组件的方法列表
     */
    methods: {
        randMonth(){
            const len = this.data.months[this.data.month].length
            const index = Math.floor(Math.random() * len)
            const sM = this.data.months[this.data.month][index]
            this.setData({
                showMonth: sM
            })
        }
    }
})