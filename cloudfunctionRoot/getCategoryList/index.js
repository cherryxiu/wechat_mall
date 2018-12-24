/**
 * 获取种类列表
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const categories = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //种类列表
  return categories.collection("cl_category").get()
}