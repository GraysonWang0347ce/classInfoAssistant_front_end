/* @brief 经过Promise化的HTTPRequest请求
 * @return Promise对象
 */

export function Request({
    url = '',
    method = '',
    tarName = '',
    aliyas = '',
    duetime = '',
    target = ''
}) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'http://localhost:3000/v1/' + url,
            method: method || 'GET',
            header: {
                openid: 'xxxxx'
            },
            data: {
                test: 'test',
                user: wx.getStorageSync('user'),
                tarName: tarName,
                aliyas: aliyas,
                duetime: duetime,
                target: target
            },
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}