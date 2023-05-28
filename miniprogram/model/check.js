const app = getApp()
export class Check{
    get tryGetInfo(){     //返回用户缓存中授权消息或null
        return wx.getStorageSync('user')?wx.getStorageSync('user'):null
    }

    get isLogin(){        //返回是否登录
       return app.globalData.hasLogin?true:false
    }

    
}