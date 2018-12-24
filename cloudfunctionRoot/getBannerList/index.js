/**
 * 获取轮播图列表
 */


// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const banners = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //返回轮播图
  return banners.collection("cl_banner").get()
}