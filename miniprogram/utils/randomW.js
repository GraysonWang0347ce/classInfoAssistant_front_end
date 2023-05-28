export class randomW {
    /* @brief 生成随机classid，用于加入班级时随机id
     * @params m 位数下限
     * @params n 位数上限
     * @return [m,n)位的整形classid
     */
    randomClassId(m, n) {
        let res = ''
        let b = Math.floor(Math.random() * (n - m)) + m
        for (var i = 0; i < b; i++) {
            res += Math.floor(10 * Math.random()).toString()
        }
        return parseInt(res)
    }

    /* @brief 生成随机RGB颜色代码，用于主界面标题栏随机颜色更换
     * @return “#xxxxxx”六位十六进制数字
     */
    randomColor() {
        let res = ''
        const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        for (var i = 0; i < 6; i++) {
            res += num[Math.floor(15 * Math.random())]
        }
        return '#' + res
    }
}