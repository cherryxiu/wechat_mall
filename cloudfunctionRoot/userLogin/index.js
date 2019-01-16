/**
 * 授权登录时判断是否已经授权过
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection("cl_user_base_info").where({
     "nick_name": _.eq(event.nickName)
   }).get()
  }