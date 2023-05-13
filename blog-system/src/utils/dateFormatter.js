/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-23 22:48:35
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 02:15:35
 * @Description: 日期格式化，将时间戳格式化为 yyyy-MM-dd hh:mm:ss 格式
 */
function dateFormatter(time) {
    const date = new Date(time * 1000) // 将时间戳转换为日期对象
    const year = date.getFullYear() // 获取年份
    const month = ('0' + (date.getMonth() + 1)).slice(-2) // 获取月份并补零
    const day = ('0' + date.getDate()).slice(-2) // 获取日期并补零
    const hours = ('0' + date.getHours()).slice(-2) // 获取小时并补零
    const minutes = ('0' + date.getMinutes()).slice(-2) // 获取分钟并补零
    return `${year}-${month}-${day} ${hours}:${minutes}` // 格式化日期字符串
}

export default dateFormatter
